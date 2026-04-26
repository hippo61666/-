import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../middlewares/errorHandler';
import { PromptBuilderService } from '../services/seedance/promptBuilder';
import { SeedanceApiClient } from '../services/seedance/apiClient';
import { VisualElements } from '../types/brandKit';

// 临时 mock 用户 ID
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

const promptBuilder = new PromptBuilderService();
const seedanceClient = new SeedanceApiClient();

/**
 * 提交视频生成任务
 */
export const generateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || MOCK_USER_ID;
    const { brand_kit_id, script, title, resolution = '1080p', aspect_ratio = '16:9' } = req.body;

    if (!brand_kit_id || !script) {
      throw new AppError(400, 'brand_kit_id and script are required');
    }

    // 1. 获取品牌套件中的 10 个视觉要素
    const { data: brandKit, error: bkError } = await supabase
      .from('brand_kits')
      .select('visual_elements')
      .eq('id', brand_kit_id)
      .eq('user_id', userId)
      .single();

    if (bkError || !brandKit) {
      throw new AppError(404, 'Brand kit not found or unauthorized');
    }

    const visualElements = brandKit.visual_elements as VisualElements;

    // 2. 组装发给 Seedance 2 的生成参数
    const seedanceParams = promptBuilder.buildSeedanceParams(script, visualElements, {
      resolution,
      aspect_ratio
    });

    // 3. 在数据库中创建视频记录（状态为 pending，保存生成的 prompt）
    const { data: newVideo, error: insertError } = await supabase
      .from('videos')
      .insert([
        {
          user_id: userId,
          brand_kit_id,
          title: title || '未命名视频',
          script,
          status: 'pending',
          generation_params: {
            ...seedanceParams,
            original_resolution: resolution,
            original_aspect_ratio: aspect_ratio
          }
        }
      ])
      .select('id')
      .single();

    if (insertError || !newVideo) {
      throw new AppError(500, 'Failed to create video record in database', true, insertError);
    }

    // 4. 异步调用 Seedance 2 API 提交任务
    let taskId: string;
    try {
      const taskRes = await seedanceClient.submitGenerationTask(seedanceParams);
      taskId = taskRes.task_id;
    } catch (apiError) {
      // 如果 API 调用失败，将数据库记录更新为 failed
      await supabase.from('videos').update({ status: 'failed' }).eq('id', newVideo.id);
      throw new AppError(502, 'Failed to submit task to Seedance API', true, apiError);
    }

    // 5. 更新视频记录，填入 task_id 并将状态改为 generating
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        status: 'generating',
        generation_params: {
          ...seedanceParams,
          seedance_task_id: taskId
        }
      })
      .eq('id', newVideo.id);

    if (updateError) {
      console.error(`Failed to update video ${newVideo.id} with task_id ${taskId}`, updateError);
      // 虽然更新失败，但任务已在 Seedance 端启动，我们仍然返回给前端（可由轮询修复）
    }

    // 6. 返回结果给前端
    res.status(202).json({
      code: 0,
      message: 'Video generation task submitted successfully',
      data: {
        video_id: newVideo.id,
        task_id: taskId,
        status: 'generating'
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户的视频列表
 */
export const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || MOCK_USER_ID;
    const { brand_kit_id, status } = req.query;

    let query = supabase
      .from('videos')
      .select(`
        id, title, status, video_url, created_at,
        brand_kits ( id, name, preview_image_url )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // 可选过滤条件
    if (brand_kit_id) query = query.eq('brand_kit_id', brand_kit_id);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) throw new AppError(500, 'Failed to fetch videos', true, error);

    res.status(200).json({
      code: 0,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个视频详情（包括轮询状态同步逻辑）
 */
export const getVideoStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || MOCK_USER_ID;

    // 1. 获取数据库中当前状态
    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !video) {
      throw new AppError(404, 'Video not found');
    }

    // 2. 如果仍在生成中，主动去 Seedance 查询最新状态并更新数据库
    if (video.status === 'generating') {
      const taskId = video.generation_params?.seedance_task_id;
      
      if (taskId) {
        try {
          const statusRes = await seedanceClient.getTaskStatus(taskId);
          
          let newStatus = video.status;
          let videoUrl = video.video_url;

          if (statusRes.status === 'success' && statusRes.video_url) {
            newStatus = 'completed';
            // TODO: 在实际生产中，这里应该将 statusRes.video_url 下载并上传到自家的 Supabase Storage
            videoUrl = statusRes.video_url; 
          } else if (statusRes.status === 'failed') {
            newStatus = 'failed';
          }

          // 如果状态发生变化，更新数据库
          if (newStatus !== video.status) {
            await supabase
              .from('videos')
              .update({ 
                status: newStatus, 
                video_url: videoUrl,
                updated_at: new Date().toISOString()
              })
              .eq('id', id);
              
            video.status = newStatus;
            video.video_url = videoUrl;
          }
          
          // 将实时进度合并到返回结果中
          video.progress = statusRes.progress || 0;
          
        } catch (apiError) {
          console.error(`Failed to sync status for video ${id} (Task: ${taskId})`, apiError);
          // 查询失败不阻断接口返回，保留旧状态
        }
      }
    }

    res.status(200).json({
      code: 0,
      data: video
    });
  } catch (error) {
    next(error);
  }
};
