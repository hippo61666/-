export interface VisualElements {
  // 1. 材质 (Material)
  material?: {
    preset?: string;
    custom_image?: string | null;
    description?: string;
    custom_text?: string;
  };
  // 2. 调色 (Color Grading)
  color_grading?: {
    preset?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    custom_text?: string;
  };
  // 3. 表情 (Expression)
  expression?: {
    preset?: string;
    intensity?: number; // 0-100
    description?: string;
    custom_text?: string;
  };
  // 4. 服装 (Costume)
  costume?: {
    preset?: string;
    primary_color?: string;
    custom_image?: string | null;
    custom_text?: string;
  };
  // 5. 构图 (Composition)
  composition?: {
    template?: string;
    shot_size?: string;
    angle?: string;
    custom_text?: string;
  };
  // 6. 妆造 (Makeup)
  makeup?: {
    preset?: string;
    emphasis?: {
      eyes?: number;
      lips?: number;
      base?: number;
    };
    custom_text?: string;
  };
  // 7. 肢体 (Gesture)
  gesture?: {
    preset?: string;
    magnitude?: 'subtle' | 'natural' | 'exaggerated';
    description?: string;
    custom_text?: string;
  };
  // 8. 台词节奏 (Dialogue Rhythm)
  dialogue_rhythm?: {
    speed?: '0.8x' | '1.0x' | '1.2x';
    tone?: string;
    voice_texture?: string; // 声音材质
    pause?: 'tight' | 'standard' | 'relaxed';
    custom_text?: string;
  };
  // 9. 剪辑节奏 (Editing Rhythm)
  editing_rhythm?: {
    pace?: 'slow' | 'medium' | 'fast';
    transition?: string;
    shot_duration?: '15s' | '30s' | '45s' | '60s';
    custom_text?: string;
  };
  // 10. 音效 (Sound Effects)
  sound_effects?: {
    music_style?: string;
    volume_balance?: {
      music?: number;
      voice?: number;
      effects?: number;
    };
    custom_audio?: string | null;
    custom_text?: string;
  };
}

export interface SeedanceGenerationParams {
  prompt: string;
  negative_prompt?: string;
  video_length: number; // 15, 30, 45, 60
  resolution?: string;
  aspect_ratio?: string;
  reference_images?: string[];
  reference_audio?: string;
  // Seedance 特有参数
  style_strength?: number;
  motion_strength?: number;
}
