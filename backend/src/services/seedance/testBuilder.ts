import { PromptBuilderService } from './promptBuilder';
import { VisualElements } from '../../types/brandKit';

const mockElements: VisualElements = {
  material: { preset: '丝绒', description: '高级柔软的丝绒' },
  color_grading: { preset: '赛博朋克', primary_color: '#FF00FF' },
  expression: { preset: '专业严肃' },
  costume: { preset: '商务正装' },
  composition: { template: '中心构图', shot_size: '近景' },
  makeup: { preset: '精致全妆' },
  gesture: { preset: '站姿挺拔', magnitude: 'natural' },
  dialogue_rhythm: { 
    speed: '1.2x', 
    tone: '权威可信', 
    voice_texture: '磁性低沉', // 新增的声音材质
    pause: 'tight' 
  },
  editing_rhythm: { 
    pace: 'fast', 
    transition: '硬切', 
    shot_duration: '30s' // 新增的时长选项
  },
  sound_effects: { music_style: '动感节奏', custom_audio: 'https://example.com/audio.mp3' }
};

const builder = new PromptBuilderService();
const script = "探索未来科技的无限可能，现在就加入我们的数字体验。";

const result = builder.buildSeedanceParams(script, mockElements, { resolution: '4K', aspect_ratio: '16:9' });

console.log('=== Seedance 2 Generation Params ===\n');
console.log(JSON.stringify(result, null, 2));
