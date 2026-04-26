export interface VideoGenerationParams {
  brand_kit_id: string;
  script: string;
  title?: string;
  resolution: '720p' | '1080p' | '4K';
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3';
  duration?: '15s' | '30s' | '45s' | '60s';
}

export interface VideoRecord {
  id: string;
  title: string;
  script: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  video_url?: string;
  progress?: number;
  brand_kit_id: string;
  created_at: string;
  brand_kits?: {
    id: string;
    name: string;
    preview_image_url?: string;
  };
}

export interface BrandKitSummary {
  id: string;
  name: string;
  description?: string;
  preview_image_url?: string;
}
