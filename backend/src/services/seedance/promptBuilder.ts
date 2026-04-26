import { VisualElements, SeedanceGenerationParams } from '../../types/brandKit';

export class PromptBuilderService {
  /**
   * 将品牌套件的10个视觉要素和用户脚本组装成 Seedance 2 的生成参数
   * @param script 用户输入的视频脚本/内容
   * @param elements 品牌套件中的 10 个视觉要素
   * @param baseParams 基础生成参数（分辨率、比例等）
   * @returns Seedance 2 的完整请求参数
   */
  public buildSeedanceParams(
    script: string,
    elements: VisualElements,
    baseParams: Partial<SeedanceGenerationParams> = {}
  ): SeedanceGenerationParams {
    
    // 1. 构建视觉风格 Prompt (前7个要素)
    const visualPrompt = this.buildVisualPrompt(elements);
    
    // 2. 构建音频与时序 Prompt (后3个要素)
    const audioTimePrompt = this.buildAudioTimePrompt(elements);

    // 3. 提取所有参考图
    const referenceImages = this.extractReferenceImages(elements);
    
    // 4. 提取参考音频
    const referenceAudio = elements.sound_effects?.custom_audio || undefined;

    // 5. 组合最终的核心 Prompt
    // 格式：[核心内容]。[视觉设定]。[音频与时序设定]。
    const finalPrompt = [
      script.trim(),
      visualPrompt,
      audioTimePrompt
    ].filter(Boolean).join('。 ');

    // 6. 解析镜头时长 (默认 15s)
    let videoLength = 15;
    const shotDurationStr = elements.editing_rhythm?.shot_duration;
    if (shotDurationStr) {
      const parsed = parseInt(shotDurationStr.replace('s', ''), 10);
      if (!isNaN(parsed)) {
        videoLength = parsed;
      }
    }

    // 7. 组装并返回 Seedance 2 所需的结构
    return {
      prompt: finalPrompt,
      negative_prompt: "模糊, 变形, 低质量, 水印, 杂乱, 画面不连贯", // 默认负向提示词
      video_length: videoLength,
      reference_images: referenceImages.length > 0 ? referenceImages : undefined,
      reference_audio: referenceAudio,
      resolution: baseParams.resolution || '1080p',
      aspect_ratio: baseParams.aspect_ratio || '16:9',
      style_strength: 0.8, // 假设 0-1 之间，品牌套件风格需要较强约束
      motion_strength: this.calculateMotionStrength(elements.editing_rhythm?.pace)
    };
  }

  /**
   * 构建视觉部分 Prompt (要素 1-7)
   */
  private buildVisualPrompt(elements: VisualElements): string {
    const parts: string[] = [];

    // 1. 材质
    if (elements.material) {
      const mat = elements.material;
      const matText = mat.custom_text || mat.description || mat.preset;
      if (matText) parts.push(`物体表面材质呈现${matText}质感`);
    }

    // 2. 调色
    if (elements.color_grading) {
      const col = elements.color_grading;
      const colText = col.custom_text || col.preset;
      if (colText) {
        let colStr = `画面整体采用${colText}调色风格`;
        if (col.primary_color) colStr += `，主色调为${col.primary_color}`;
        parts.push(colStr);
      }
    }

    // 3. 表情
    if (elements.expression) {
      const exp = elements.expression;
      const expText = exp.custom_text || exp.description || exp.preset;
      if (expText) parts.push(`人物面部表情表现为${expText}`);
    }

    // 4. 服装
    if (elements.costume) {
      const cos = elements.costume;
      const cosText = cos.custom_text || cos.preset;
      if (cosText) parts.push(`人物穿着${cosText}风格的服装`);
    }

    // 5. 构图
    if (elements.composition) {
      const comp = elements.composition;
      const compText = comp.custom_text || comp.template;
      if (compText) {
        let compStr = `采用${compText}构图`;
        if (comp.shot_size) compStr += `，景别为${comp.shot_size}`;
        if (comp.angle) compStr += `，拍摄视角为${comp.angle}`;
        parts.push(compStr);
      }
    }

    // 6. 妆造
    if (elements.makeup) {
      const mkp = elements.makeup;
      const mkpText = mkp.custom_text || mkp.preset;
      if (mkpText) parts.push(`人物妆容为${mkpText}风格`);
    }

    // 7. 肢体
    if (elements.gesture) {
      const ges = elements.gesture;
      const gesText = ges.custom_text || ges.description || ges.preset;
      if (gesText) {
        let gesStr = `人物肢体动作为${gesText}`;
        if (ges.magnitude) {
          const magMap: Record<string, string> = { subtle: '微小', natural: '自然', exaggerated: '夸张' };
          gesStr += `，动作幅度${magMap[ges.magnitude] || ges.magnitude}`;
        }
        parts.push(gesStr);
      }
    }

    if (parts.length === 0) return '';
    return "视觉风格设定: " + parts.join('；');
  }

  /**
   * 构建音频与时序部分 Prompt (要素 8-10)
   */
  private buildAudioTimePrompt(elements: VisualElements): string {
    const parts: string[] = [];

    // 8. 台词节奏
    if (elements.dialogue_rhythm) {
      const dr = elements.dialogue_rhythm;
      const drText = dr.custom_text || dr.tone;
      if (drText) {
        let drStr = `旁白台词采用${drText}语调`;
        if (dr.speed) drStr += `，语速${dr.speed}`;
        if (dr.voice_texture) drStr += `，声音材质为${dr.voice_texture}`;
        parts.push(drStr);
      }
    }

    // 9. 剪辑节奏
    if (elements.editing_rhythm) {
      const er = elements.editing_rhythm;
      const erText = er.custom_text || er.pace;
      if (erText) {
        let erStr = `视频剪辑保持${erText}节奏`;
        if (er.transition) erStr += `，使用${er.transition}转场方式`;
        parts.push(erStr);
      }
    }

    // 10. 音效
    if (elements.sound_effects) {
      const se = elements.sound_effects;
      const seText = se.custom_text || se.music_style;
      if (seText) parts.push(`背景音乐呈现${seText}风格`);
    }

    if (parts.length === 0) return '';
    return "音频与时序设定: " + parts.join('；');
  }

  /**
   * 收集10个要素中所有上传的参考图片
   */
  private extractReferenceImages(elements: VisualElements): string[] {
    const images: string[] = [];
    if (elements.material?.custom_image) images.push(elements.material.custom_image);
    if (elements.costume?.custom_image) images.push(elements.costume.custom_image);
    // 可扩展其他包含 custom_image 的要素
    return images.filter(url => url && url.startsWith('http'));
  }

  /**
   * 根据剪辑节奏推算 Seedance 模型需要的运动强度参数 (Motion Strength)
   */
  private calculateMotionStrength(pace?: 'slow' | 'medium' | 'fast' | string): number {
    switch (pace) {
      case 'slow': return 0.3;
      case 'fast': return 0.8;
      case 'medium':
      default: return 0.5;
    }
  }
}
