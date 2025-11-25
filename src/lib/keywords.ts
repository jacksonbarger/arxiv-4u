import { TopicCategory, CategoryMatch } from '@/types/arxiv';

// Keyword lists for each topic category
// Higher weight = more important keyword (1-10 scale)
// Exact matches get full weight, partial matches get 60% weight

export interface KeywordEntry {
  term: string;
  weight: number; // 1-10
  exact?: boolean; // If true, only match exact word boundaries
}

// Negative keywords reduce relevance score when matched
export interface NegativeKeyword {
  term: string;
  penalty: number; // Subtracted from score
}

export const CATEGORY_KEYWORDS: Record<TopicCategory, KeywordEntry[]> = {
  'agentic-coding': [
    // Core agent concepts (highest priority)
    { term: 'llm agent', weight: 10, exact: true },
    { term: 'language model agent', weight: 10 },
    { term: 'ai agent', weight: 10 },
    { term: 'agentic', weight: 10 },
    { term: 'autonomous agent', weight: 10 },
    { term: 'multi-agent', weight: 10 },
    { term: 'agent framework', weight: 10 },

    // Tool use & function calling
    { term: 'tool use', weight: 9 },
    { term: 'tool calling', weight: 9 },
    { term: 'function calling', weight: 9 },
    { term: 'tool learning', weight: 9 },
    { term: 'api calling', weight: 8 },
    { term: 'external tools', weight: 8 },

    // Reasoning & planning
    { term: 'chain of thought', weight: 8 },
    { term: 'cot', weight: 7, exact: true },
    { term: 'react prompting', weight: 9 },
    { term: 'react agent', weight: 9 },
    { term: 'reasoning', weight: 6 },
    { term: 'planning', weight: 6 },
    { term: 'task decomposition', weight: 8 },
    { term: 'step-by-step', weight: 5 },
    { term: 'self-reflection', weight: 8 },
    { term: 'self-critique', weight: 8 },

    // Code-specific
    { term: 'code generation', weight: 8 },
    { term: 'code agent', weight: 10 },
    { term: 'coding agent', weight: 10 },
    { term: 'code synthesis', weight: 7 },
    { term: 'program synthesis', weight: 7 },
    { term: 'automated programming', weight: 8 },
    { term: 'self-debugging', weight: 9 },
    { term: 'code repair', weight: 7 },

    // Frameworks & systems
    { term: 'langchain', weight: 9, exact: true },
    { term: 'langgraph', weight: 9, exact: true },
    { term: 'autogpt', weight: 9, exact: true },
    { term: 'auto-gpt', weight: 9 },
    { term: 'babyagi', weight: 8, exact: true },
    { term: 'crewai', weight: 9, exact: true },
    { term: 'autogen', weight: 9, exact: true },
    { term: 'metagpt', weight: 9, exact: true },
    { term: 'opendevin', weight: 9, exact: true },
    { term: 'swe-agent', weight: 10 },
    { term: 'devin', weight: 8, exact: true },

    // Agent behaviors
    { term: 'self-improvement', weight: 8 },
    { term: 'self-evolving', weight: 8 },
    { term: 'orchestration', weight: 7 },
    { term: 'agent collaboration', weight: 8 },
    { term: 'agent communication', weight: 7 },
    { term: 'memory augmented', weight: 7 },
    { term: 'retrieval augmented', weight: 6 },
    { term: 'rag', weight: 6, exact: true },
  ],

  'image-generation': [
    // Core diffusion models
    { term: 'diffusion model', weight: 10 },
    { term: 'stable diffusion', weight: 10 },
    { term: 'latent diffusion', weight: 10 },
    { term: 'text-to-image', weight: 10 },
    { term: 't2i', weight: 9, exact: true },
    { term: 'image synthesis', weight: 9 },
    { term: 'image generation', weight: 9 },

    // Specific models
    { term: 'sdxl', weight: 9, exact: true },
    { term: 'sd3', weight: 9, exact: true },
    { term: 'flux', weight: 9, exact: true },
    { term: 'dall-e', weight: 9 },
    { term: 'dalle', weight: 9, exact: true },
    { term: 'midjourney', weight: 8, exact: true },
    { term: 'imagen', weight: 8, exact: true },
    { term: 'kandinsky', weight: 7, exact: true },
    { term: 'pixart', weight: 8, exact: true },
    { term: 'playground', weight: 6 },

    // Fine-tuning & adaptation
    { term: 'lora', weight: 9, exact: true },
    { term: 'dreambooth', weight: 9, exact: true },
    { term: 'textual inversion', weight: 8 },
    { term: 'hypernetwork', weight: 7 },
    { term: 'fine-tuning', weight: 6 },
    { term: 'personalization', weight: 7 },
    { term: 'style transfer', weight: 7 },
    { term: 'image customization', weight: 8 },

    // Control methods
    { term: 'controlnet', weight: 10 },
    { term: 'ip-adapter', weight: 9 },
    { term: 'ipadapter', weight: 9, exact: true },
    { term: 't2i-adapter', weight: 9 },
    { term: 'conditioning', weight: 6 },
    { term: 'guided diffusion', weight: 8 },
    { term: 'classifier-free guidance', weight: 7 },
    { term: 'cfg', weight: 5, exact: true },

    // Image editing
    { term: 'inpainting', weight: 8 },
    { term: 'outpainting', weight: 8 },
    { term: 'img2img', weight: 8 },
    { term: 'image-to-image', weight: 8 },
    { term: 'image editing', weight: 8 },
    { term: 'instruct-pix2pix', weight: 9 },

    // Architecture components
    { term: 'unet', weight: 6, exact: true },
    { term: 'vae', weight: 5, exact: true },
    { term: 'variational autoencoder', weight: 6 },
    { term: 'clip', weight: 6, exact: true },
    { term: 'latent space', weight: 6 },
    { term: 'denoising', weight: 6 },
    { term: 'noise prediction', weight: 6 },
    { term: 'score matching', weight: 7 },

    // Quality & techniques
    { term: 'super resolution', weight: 7 },
    { term: 'upscaling', weight: 6 },
    { term: 'high resolution', weight: 5 },
    { term: 'photorealistic', weight: 6 },
    { term: 'negative prompt', weight: 5 },
  ],

  'video-generation': [
    // Core video generation
    { term: 'video generation', weight: 10 },
    { term: 'video synthesis', weight: 10 },
    { term: 'text-to-video', weight: 10 },
    { term: 't2v', weight: 9, exact: true },
    { term: 'video diffusion', weight: 10 },

    // Specific models
    { term: 'sora', weight: 10, exact: true },
    { term: 'runway', weight: 8 },
    { term: 'gen-2', weight: 8 },
    { term: 'gen-3', weight: 9 },
    { term: 'pika', weight: 8, exact: true },
    { term: 'kling', weight: 8, exact: true },
    { term: 'animatediff', weight: 9, exact: true },
    { term: 'modelscope', weight: 7 },
    { term: 'zeroscope', weight: 8, exact: true },
    { term: 'lavie', weight: 8, exact: true },
    { term: 'videocrafter', weight: 9, exact: true },
    { term: 'cogvideo', weight: 9, exact: true },
    { term: 'lumiere', weight: 9, exact: true },

    // Temporal modeling
    { term: 'temporal consistency', weight: 9 },
    { term: 'temporal coherence', weight: 9 },
    { term: 'motion modeling', weight: 8 },
    { term: 'motion generation', weight: 8 },
    { term: 'frame interpolation', weight: 7 },
    { term: 'optical flow', weight: 6 },
    { term: 'temporal attention', weight: 8 },
    { term: '3d convolution', weight: 6 },

    // Video editing
    { term: 'video editing', weight: 8 },
    { term: 'video-to-video', weight: 8 },
    { term: 'v2v', weight: 7, exact: true },
    { term: 'video inpainting', weight: 8 },
    { term: 'video stylization', weight: 7 },

    // Animation
    { term: 'animation', weight: 6 },
    { term: 'animate', weight: 5 },
    { term: 'motion transfer', weight: 8 },
    { term: 'pose-guided', weight: 7 },
    { term: 'character animation', weight: 8 },

    // Long-form video
    { term: 'long video', weight: 8 },
    { term: 'autoregressive video', weight: 8 },
    { term: 'video continuation', weight: 7 },
  ],

  'ai-content-creators': [
    // Audio & music
    { term: 'music generation', weight: 9 },
    { term: 'audio synthesis', weight: 9 },
    { term: 'text-to-music', weight: 10 },
    { term: 'text-to-audio', weight: 9 },
    { term: 'musicgen', weight: 9, exact: true },
    { term: 'audiogen', weight: 9, exact: true },
    { term: 'jukebox', weight: 8, exact: true },
    { term: 'riffusion', weight: 8, exact: true },
    { term: 'suno', weight: 9, exact: true },
    { term: 'udio', weight: 9, exact: true },
    { term: 'bark', weight: 7, exact: true },

    // Voice & speech
    { term: 'voice cloning', weight: 10 },
    { term: 'voice synthesis', weight: 9 },
    { term: 'text-to-speech', weight: 8 },
    { term: 'tts', weight: 7, exact: true },
    { term: 'speech synthesis', weight: 8 },
    { term: 'voice conversion', weight: 8 },
    { term: 'elevenlabs', weight: 9 },
    { term: 'tortoise', weight: 7 },
    { term: 'xtts', weight: 8, exact: true },
    { term: 'vall-e', weight: 9 },

    // Face & avatar
    { term: 'face generation', weight: 8 },
    { term: 'avatar', weight: 7 },
    { term: 'digital human', weight: 9 },
    { term: 'talking head', weight: 9 },
    { term: 'lip sync', weight: 8 },
    { term: 'face animation', weight: 8 },
    { term: 'deepfake', weight: 6 },
    { term: 'face swap', weight: 6 },
    { term: 'heygen', weight: 8, exact: true },
    { term: 'synthesia', weight: 8, exact: true },
    { term: 'd-id', weight: 8 },

    // Creative content
    { term: 'content generation', weight: 8 },
    { term: 'creative ai', weight: 8 },
    { term: 'storytelling', weight: 7 },
    { term: 'narrative generation', weight: 7 },
    { term: 'script writing', weight: 7 },
    { term: 'virtual influencer', weight: 9 },
    { term: 'ai influencer', weight: 9 },

    // 3D content
    { term: 'text-to-3d', weight: 9 },
    { term: '3d generation', weight: 8 },
    { term: 'nerf', weight: 7, exact: true },
    { term: 'gaussian splatting', weight: 8 },
    { term: '3d reconstruction', weight: 7 },
    { term: 'dreamfusion', weight: 8, exact: true },
  ],

  'comfyui': [
    // Direct mentions
    { term: 'comfyui', weight: 10, exact: true },
    { term: 'comfy ui', weight: 10 },
    { term: 'comfy', weight: 6, exact: true },

    // Workflow concepts (relevant to ComfyUI pipelines)
    { term: 'node-based', weight: 8 },
    { term: 'visual programming', weight: 7 },
    { term: 'workflow', weight: 5 },
    { term: 'pipeline', weight: 5 },
    { term: 'modular', weight: 4 },
    { term: 'custom node', weight: 9 },
    { term: 'node graph', weight: 7 },

    // Implementation-friendly
    { term: 'inference pipeline', weight: 7 },
    { term: 'model chaining', weight: 7 },
    { term: 'composable', weight: 6 },
    { term: 'plug-and-play', weight: 6 },

    // Extensions & nodes
    { term: 'extension', weight: 4 },
    { term: 'plugin', weight: 4 },
    { term: 'custom sampler', weight: 8 },
    { term: 'scheduler', weight: 5 },
  ],

  'runpod': [
    // Direct mentions
    { term: 'runpod', weight: 10, exact: true },

    // Cloud GPU & serverless
    { term: 'serverless', weight: 8 },
    { term: 'serverless inference', weight: 9 },
    { term: 'gpu cloud', weight: 8 },
    { term: 'cloud gpu', weight: 8 },
    { term: 'gpu inference', weight: 8 },
    { term: 'inference api', weight: 7 },
    { term: 'model deployment', weight: 7 },
    { term: 'model serving', weight: 8 },

    // Optimization
    { term: 'inference optimization', weight: 9 },
    { term: 'quantization', weight: 8 },
    { term: 'int8', weight: 7, exact: true },
    { term: 'int4', weight: 7, exact: true },
    { term: 'fp16', weight: 6, exact: true },
    { term: 'bf16', weight: 6, exact: true },
    { term: 'mixed precision', weight: 7 },
    { term: 'model compression', weight: 8 },
    { term: 'pruning', weight: 6 },
    { term: 'distillation', weight: 7 },
    { term: 'knowledge distillation', weight: 7 },

    // Formats & runtimes
    { term: 'onnx', weight: 7, exact: true },
    { term: 'tensorrt', weight: 8, exact: true },
    { term: 'triton', weight: 7, exact: true },
    { term: 'vllm', weight: 8, exact: true },
    { term: 'tgi', weight: 7, exact: true },
    { term: 'llama.cpp', weight: 8 },
    { term: 'gguf', weight: 8, exact: true },
    { term: 'ggml', weight: 7, exact: true },
    { term: 'exllama', weight: 8, exact: true },
    { term: 'gptq', weight: 8, exact: true },
    { term: 'awq', weight: 8, exact: true },

    // Performance
    { term: 'latency', weight: 6 },
    { term: 'throughput', weight: 6 },
    { term: 'batch inference', weight: 7 },
    { term: 'continuous batching', weight: 8 },
    { term: 'speculative decoding', weight: 8 },

    // Deployment
    { term: 'docker', weight: 5 },
    { term: 'container', weight: 4 },
    { term: 'kubernetes', weight: 5 },
    { term: 'autoscaling', weight: 6 },
  ],

  'market-opportunity': [
    // Commercial indicators
    { term: 'commercial', weight: 8 },
    { term: 'commercialization', weight: 9 },
    { term: 'product', weight: 5 },
    { term: 'productization', weight: 9 },
    { term: 'startup', weight: 8 },
    { term: 'business', weight: 5 },
    { term: 'enterprise', weight: 7 },
    { term: 'industry', weight: 5 },

    // Practical & real-world
    { term: 'real-world', weight: 7 },
    { term: 'practical', weight: 6 },
    { term: 'application', weight: 5 },
    { term: 'use case', weight: 7 },
    { term: 'deployment', weight: 5 },
    { term: 'production', weight: 6 },
    { term: 'production-ready', weight: 8 },

    // Efficiency indicators (solo-dev friendly)
    { term: 'efficient', weight: 5 },
    { term: 'lightweight', weight: 7 },
    { term: 'fast', weight: 4 },
    { term: 'real-time', weight: 7 },
    { term: 'low-cost', weight: 8 },
    { term: 'cost-effective', weight: 8 },
    { term: 'resource-efficient', weight: 8 },
    { term: 'on-device', weight: 8 },
    { term: 'edge deployment', weight: 8 },
    { term: 'mobile', weight: 6 },

    // Scalability
    { term: 'scalable', weight: 6 },
    { term: 'scaling', weight: 5 },

    // Open source / accessibility
    { term: 'open source', weight: 6 },
    { term: 'open-source', weight: 6 },
    { term: 'publicly available', weight: 7 },
    { term: 'code release', weight: 7 },
    { term: 'model release', weight: 7 },
    { term: 'weights available', weight: 8 },

    // Innovation signals
    { term: 'state-of-the-art', weight: 6 },
    { term: 'sota', weight: 6, exact: true },
    { term: 'novel', weight: 4 },
    { term: 'breakthrough', weight: 7 },
    { term: 'outperforms', weight: 5 },
    { term: 'surpasses', weight: 5 },
  ],

  'other': [],
};

// Negative keywords that reduce relevance for specific categories
export const NEGATIVE_KEYWORDS: Record<TopicCategory, NegativeKeyword[]> = {
  'agentic-coding': [
    { term: 'chemical agent', penalty: 10 },
    { term: 'biological agent', penalty: 10 },
    { term: 'pathogen', penalty: 10 },
  ],
  'image-generation': [
    { term: 'medical imaging', penalty: 5 },
    { term: 'mri', penalty: 3 },
    { term: 'ct scan', penalty: 3 },
  ],
  'video-generation': [
    { term: 'video understanding', penalty: 3 },
    { term: 'video classification', penalty: 3 },
  ],
  'ai-content-creators': [],
  'comfyui': [],
  'runpod': [],
  'market-opportunity': [
    { term: 'theoretical', penalty: 4 },
    { term: 'proof', penalty: 2 },
  ],
  'other': [],
};

// arXiv category mappings - boost scores when paper is in relevant arxiv category
export const ARXIV_CATEGORY_BOOST: Record<string, Partial<Record<TopicCategory, number>>> = {
  'cs.AI': {
    'agentic-coding': 1.2,
    'market-opportunity': 1.1,
  },
  'cs.LG': {
    'image-generation': 1.1,
    'video-generation': 1.1,
    'runpod': 1.1,
  },
  'cs.CV': {
    'image-generation': 1.3,
    'video-generation': 1.3,
    'ai-content-creators': 1.2,
  },
  'cs.CL': {
    'agentic-coding': 1.1,
    'ai-content-creators': 1.1,
  },
  'cs.SD': {
    'ai-content-creators': 1.3,
  },
  'cs.GR': {
    'image-generation': 1.2,
    'video-generation': 1.2,
    'comfyui': 1.1,
  },
  'cs.MM': {
    'video-generation': 1.2,
    'ai-content-creators': 1.2,
  },
  'eess.AS': {
    'ai-content-creators': 1.3,
  },
};

export const CATEGORY_LABELS: Record<TopicCategory, string> = {
  'agentic-coding': 'Agentic Coding',
  'image-generation': 'Image Generation',
  'video-generation': 'Video Generation',
  'ai-content-creators': 'AI Content Creators',
  'comfyui': 'ComfyUI',
  'runpod': 'RunPod/Deployment',
  'market-opportunity': 'Market Opportunity',
  'other': 'Other',
};

export const CATEGORY_COLORS: Record<TopicCategory, string> = {
  'agentic-coding': '#8b5cf6',      // Purple
  'image-generation': '#ec4899',    // Pink
  'video-generation': '#f97316',    // Orange
  'ai-content-creators': '#06b6d4', // Cyan
  'comfyui': '#84cc16',             // Lime
  'runpod': '#6366f1',              // Indigo
  'market-opportunity': '#eab308',  // Yellow
  'other': '#6b7280',               // Gray
};

export const CATEGORY_ICONS: Record<TopicCategory, string> = {
  'agentic-coding': '🤖',
  'image-generation': '🎨',
  'video-generation': '🎬',
  'ai-content-creators': '🎭',
  'comfyui': '🔧',
  'runpod': '☁️',
  'market-opportunity': '💰',
  'other': '📄',
};

export const CATEGORY_DESCRIPTIONS: Record<TopicCategory, string> = {
  'agentic-coding': 'AI agents, tool use, autonomous coding assistants',
  'image-generation': 'Diffusion models, text-to-image, LoRA, ControlNet',
  'video-generation': 'Text-to-video, video synthesis, temporal consistency',
  'ai-content-creators': 'Voice cloning, music gen, avatars, digital humans',
  'comfyui': 'Node-based workflows, custom nodes, pipelines',
  'runpod': 'GPU inference, quantization, model serving, deployment',
  'market-opportunity': 'Commercial potential, efficient methods, practical applications',
  'other': 'Other AI/ML papers',
};

// Priority order for displaying categories (most important first)
export const CATEGORY_PRIORITY: TopicCategory[] = [
  'agentic-coding',
  'image-generation',
  'video-generation',
  'ai-content-creators',
  'comfyui',
  'runpod',
  'market-opportunity',
  'other',
];
