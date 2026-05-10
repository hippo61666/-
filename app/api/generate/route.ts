import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 1. 保存用户的 prompt 消息
    await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: prompt,
        projectId,
      }
    });

    // ==========================================
    // TODO: 这里预留真实接入 Seedance 2.0 API 的位置
    // const response = await fetch('https://api.seedanceai.com/v1/generate', { ... })
    // const data = await response.json()
    // const videoUrl = data.video_url
    // ==========================================

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟生成的视频 URL (这里用图片代替展示)
    const mockVideoUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

    // 2. 保存 AI 的回复和视频 URL
    const aiMessage = await prisma.chatMessage.create({
      data: {
        role: 'ai',
        content: '这是为您调用 Seedance 2.0 大模型生成的视频，请查阅。如果您需要调整（例如修改背景、调整光线），请直接告诉我。',
        videoUrl: mockVideoUrl,
        projectId,
      }
    });

    // 3. 更新项目的状态和封面
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        status: 'COMPLETED',
        thumbnail: mockVideoUrl,
        videoUrl: mockVideoUrl
      }
    });

    return NextResponse.json({
      success: true,
      message: aiMessage
    });

  } catch (error) {
    console.error('Generate Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
