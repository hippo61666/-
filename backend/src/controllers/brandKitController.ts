import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../middlewares/errorHandler';

// 临时 mock 用户 ID，直到集成 Auth 中间件
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

/**
 * 获取当前用户的所有品牌套件
 */
export const getBrandKits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || MOCK_USER_ID; // TODO: 替换为实际认证用户

    const { data, error } = await supabase
      .from('brand_kits')
      .select('id, name, description, preview_image_url, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(500, 'Failed to fetch brand kits', true, error);

    res.status(200).json({
      code: 0,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个品牌套件详情（包含10个视觉要素）
 */
export const getBrandKitById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || MOCK_USER_ID;

    const { data, error } = await supabase
      .from('brand_kits')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError(404, 'Brand kit not found');
      }
      throw new AppError(500, 'Failed to fetch brand kit details', true, error);
    }

    res.status(200).json({
      code: 0,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新的品牌套件
 */
export const createBrandKit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || MOCK_USER_ID;
    const { name, description, visual_elements, preview_image_url } = req.body;

    if (!name) {
      throw new AppError(400, 'Brand kit name is required');
    }

    // 默认空视觉要素，如果没有传的话
    const defaultElements = visual_elements || {};

    const { data, error } = await supabase
      .from('brand_kits')
      .insert([
        {
          user_id: userId,
          name,
          description,
          visual_elements: defaultElements,
          preview_image_url
        }
      ])
      .select()
      .single();

    if (error) throw new AppError(500, 'Failed to create brand kit', true, error);

    res.status(201).json({
      code: 0,
      message: 'Brand kit created successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新品牌套件（保存视觉要素编辑）
 */
export const updateBrandKit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || MOCK_USER_ID;
    const { name, description, visual_elements, preview_image_url } = req.body;

    // 构建要更新的字段
    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (visual_elements !== undefined) updateData.visual_elements = visual_elements;
    if (preview_image_url !== undefined) updateData.preview_image_url = preview_image_url;

    const { data, error } = await supabase
      .from('brand_kits')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new AppError(500, 'Failed to update brand kit', true, error);

    if (!data) throw new AppError(404, 'Brand kit not found or unauthorized');

    res.status(200).json({
      code: 0,
      message: 'Brand kit updated successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除品牌套件
 */
export const deleteBrandKit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || MOCK_USER_ID;

    const { error, count } = await supabase
      .from('brand_kits')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new AppError(500, 'Failed to delete brand kit', true, error);
    
    if (count === 0) {
      throw new AppError(404, 'Brand kit not found or unauthorized');
    }

    res.status(200).json({
      code: 0,
      message: 'Brand kit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
