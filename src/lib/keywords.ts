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

  // ========================================
  // NEW AI RESEARCH CATEGORIES
  // ========================================

  'nlp': [
    // Core NLP
    { term: 'natural language processing', weight: 10 },
    { term: 'nlp', weight: 9, exact: true },
    { term: 'text classification', weight: 8 },
    { term: 'named entity recognition', weight: 9 },
    { term: 'ner', weight: 7, exact: true },
    { term: 'sentiment analysis', weight: 8 },
    { term: 'machine translation', weight: 9 },
    { term: 'neural machine translation', weight: 9 },
    { term: 'nmt', weight: 7, exact: true },
    { term: 'text generation', weight: 7 },
    { term: 'language understanding', weight: 8 },
    { term: 'parsing', weight: 6 },
    { term: 'dependency parsing', weight: 7 },
    { term: 'constituency parsing', weight: 7 },
    { term: 'part-of-speech', weight: 7 },
    { term: 'pos tagging', weight: 7 },
    { term: 'tokenization', weight: 6 },
    { term: 'word embedding', weight: 7 },
    { term: 'word2vec', weight: 7, exact: true },
    { term: 'glove', weight: 6, exact: true },
    { term: 'question answering', weight: 8 },
    { term: 'qa', weight: 5, exact: true },
    { term: 'reading comprehension', weight: 8 },
    { term: 'text summarization', weight: 8 },
    { term: 'abstractive summarization', weight: 9 },
    { term: 'extractive summarization', weight: 8 },
    { term: 'information extraction', weight: 7 },
    { term: 'relation extraction', weight: 8 },
    { term: 'coreference resolution', weight: 7 },
    { term: 'dialogue system', weight: 8 },
    { term: 'conversational ai', weight: 8 },
  ],

  'llm': [
    // Core LLM
    { term: 'large language model', weight: 10 },
    { term: 'llm', weight: 10, exact: true },
    { term: 'foundation model', weight: 9 },
    { term: 'pretrained language model', weight: 9 },
    { term: 'pretraining', weight: 8 },
    { term: 'instruction tuning', weight: 10 },
    { term: 'instruction following', weight: 9 },
    { term: 'rlhf', weight: 10, exact: true },
    { term: 'reinforcement learning from human feedback', weight: 10 },
    { term: 'dpo', weight: 9, exact: true },
    { term: 'direct preference optimization', weight: 9 },
    { term: 'scaling laws', weight: 9 },
    { term: 'emergent abilities', weight: 9 },
    { term: 'in-context learning', weight: 9 },
    { term: 'icl', weight: 7, exact: true },
    { term: 'few-shot learning', weight: 8 },
    { term: 'zero-shot', weight: 7 },
    { term: 'prompt engineering', weight: 8 },
    { term: 'prompting', weight: 6 },
    // Models
    { term: 'gpt-4', weight: 9 },
    { term: 'gpt-3', weight: 8 },
    { term: 'claude', weight: 8, exact: true },
    { term: 'llama', weight: 9, exact: true },
    { term: 'mistral', weight: 9, exact: true },
    { term: 'gemini', weight: 8, exact: true },
    { term: 'palm', weight: 7, exact: true },
    { term: 'chinchilla', weight: 8, exact: true },
    { term: 'falcon', weight: 7, exact: true },
    { term: 'qwen', weight: 8, exact: true },
    { term: 'phi', weight: 6, exact: true },
    // Training
    { term: 'fine-tuning', weight: 7 },
    { term: 'parameter-efficient', weight: 8 },
    { term: 'peft', weight: 8, exact: true },
    { term: 'sft', weight: 7, exact: true },
    { term: 'supervised fine-tuning', weight: 8 },
  ],

  'rag': [
    // Core RAG
    { term: 'retrieval-augmented generation', weight: 10 },
    { term: 'retrieval augmented', weight: 10 },
    { term: 'rag', weight: 10, exact: true },
    { term: 'vector database', weight: 9 },
    { term: 'vector store', weight: 8 },
    { term: 'embedding', weight: 7 },
    { term: 'dense retrieval', weight: 9 },
    { term: 'semantic search', weight: 8 },
    { term: 'knowledge base', weight: 7 },
    { term: 'document retrieval', weight: 8 },
    { term: 'passage retrieval', weight: 8 },
    { term: 'chunking', weight: 7 },
    { term: 'reranking', weight: 8 },
    { term: 'cross-encoder', weight: 8 },
    { term: 'bi-encoder', weight: 8 },
    { term: 'hybrid search', weight: 8 },
    { term: 'bm25', weight: 7, exact: true },
    // Systems
    { term: 'pinecone', weight: 7, exact: true },
    { term: 'weaviate', weight: 7, exact: true },
    { term: 'chroma', weight: 6, exact: true },
    { term: 'faiss', weight: 7, exact: true },
    { term: 'milvus', weight: 7, exact: true },
    // Advanced
    { term: 'query expansion', weight: 7 },
    { term: 'hyde', weight: 8, exact: true },
    { term: 'self-rag', weight: 9 },
    { term: 'corrective rag', weight: 9 },
    { term: 'crag', weight: 8, exact: true },
  ],

  'multimodal': [
    // Core multimodal
    { term: 'multimodal', weight: 10 },
    { term: 'multi-modal', weight: 10 },
    { term: 'vision-language', weight: 10 },
    { term: 'vlm', weight: 9, exact: true },
    { term: 'vision language model', weight: 10 },
    { term: 'cross-modal', weight: 9 },
    { term: 'image-text', weight: 8 },
    { term: 'visual question answering', weight: 9 },
    { term: 'vqa', weight: 8, exact: true },
    { term: 'image captioning', weight: 8 },
    { term: 'visual grounding', weight: 8 },
    // Models
    { term: 'clip', weight: 9, exact: true },
    { term: 'blip', weight: 9, exact: true },
    { term: 'llava', weight: 10, exact: true },
    { term: 'gpt-4v', weight: 9 },
    { term: 'gpt-4 vision', weight: 9 },
    { term: 'flamingo', weight: 8, exact: true },
    { term: 'kosmos', weight: 8, exact: true },
    { term: 'cogvlm', weight: 9, exact: true },
    { term: 'qwen-vl', weight: 9 },
    { term: 'internvl', weight: 9, exact: true },
    // Tasks
    { term: 'visual reasoning', weight: 8 },
    { term: 'document understanding', weight: 8 },
    { term: 'chart understanding', weight: 7 },
    { term: 'ocr', weight: 6, exact: true },
    { term: 'scene understanding', weight: 7 },
  ],

  'robotics': [
    // Core robotics
    { term: 'robotics', weight: 10 },
    { term: 'robot', weight: 8 },
    { term: 'embodied ai', weight: 10 },
    { term: 'embodied agent', weight: 10 },
    { term: 'manipulation', weight: 8 },
    { term: 'robotic manipulation', weight: 10 },
    { term: 'grasping', weight: 8 },
    { term: 'navigation', weight: 7 },
    { term: 'robot navigation', weight: 9 },
    { term: 'locomotion', weight: 8 },
    { term: 'humanoid', weight: 9 },
    { term: 'legged robot', weight: 9 },
    { term: 'quadruped', weight: 8 },
    // Learning
    { term: 'imitation learning', weight: 9 },
    { term: 'learning from demonstration', weight: 9 },
    { term: 'sim-to-real', weight: 10 },
    { term: 'sim2real', weight: 10, exact: true },
    { term: 'domain randomization', weight: 8 },
    { term: 'teleoperation', weight: 8 },
    { term: 'robot learning', weight: 9 },
    // Tasks
    { term: 'pick and place', weight: 8 },
    { term: 'motion planning', weight: 8 },
    { term: 'path planning', weight: 7 },
    { term: 'visual servoing', weight: 8 },
    { term: 'slam', weight: 7, exact: true },
    // Foundation
    { term: 'rt-1', weight: 9 },
    { term: 'rt-2', weight: 9 },
    { term: 'palm-e', weight: 9 },
    { term: 'open x-embodiment', weight: 9 },
  ],

  'rl': [
    // Core RL
    { term: 'reinforcement learning', weight: 10 },
    { term: 'rl', weight: 8, exact: true },
    { term: 'policy gradient', weight: 9 },
    { term: 'q-learning', weight: 9 },
    { term: 'dqn', weight: 9, exact: true },
    { term: 'ppo', weight: 9, exact: true },
    { term: 'proximal policy optimization', weight: 9 },
    { term: 'actor-critic', weight: 9 },
    { term: 'a2c', weight: 8, exact: true },
    { term: 'a3c', weight: 8, exact: true },
    { term: 'sac', weight: 8, exact: true },
    { term: 'soft actor-critic', weight: 9 },
    { term: 'td3', weight: 8, exact: true },
    { term: 'ddpg', weight: 8, exact: true },
    // Concepts
    { term: 'reward', weight: 5 },
    { term: 'reward shaping', weight: 8 },
    { term: 'reward model', weight: 9 },
    { term: 'policy', weight: 5 },
    { term: 'value function', weight: 7 },
    { term: 'markov decision process', weight: 8 },
    { term: 'mdp', weight: 6, exact: true },
    { term: 'exploration', weight: 5 },
    { term: 'exploitation', weight: 5 },
    // Advanced
    { term: 'offline rl', weight: 9 },
    { term: 'batch rl', weight: 8 },
    { term: 'multi-agent rl', weight: 9 },
    { term: 'marl', weight: 8, exact: true },
    { term: 'hierarchical rl', weight: 8 },
    { term: 'meta-rl', weight: 8 },
    { term: 'inverse rl', weight: 8 },
    { term: 'world model', weight: 8 },
    { term: 'model-based rl', weight: 8 },
  ],

  'transformers': [
    // Core architecture
    { term: 'transformer', weight: 9 },
    { term: 'attention mechanism', weight: 9 },
    { term: 'self-attention', weight: 9 },
    { term: 'multi-head attention', weight: 9 },
    { term: 'cross-attention', weight: 8 },
    { term: 'positional encoding', weight: 7 },
    { term: 'positional embedding', weight: 7 },
    // Efficient transformers
    { term: 'efficient transformer', weight: 9 },
    { term: 'linear attention', weight: 9 },
    { term: 'sparse attention', weight: 9 },
    { term: 'flash attention', weight: 10, exact: true },
    { term: 'flashattention', weight: 10, exact: true },
    { term: 'mamba', weight: 10, exact: true },
    { term: 'state space model', weight: 9 },
    { term: 'ssm', weight: 8, exact: true },
    { term: 'rwkv', weight: 9, exact: true },
    { term: 'retnet', weight: 9, exact: true },
    { term: 'hyena', weight: 8, exact: true },
    // Variants
    { term: 'bert', weight: 8, exact: true },
    { term: 'gpt', weight: 7, exact: true },
    { term: 'encoder-decoder', weight: 7 },
    { term: 'decoder-only', weight: 8 },
    { term: 'causal language model', weight: 8 },
    // Components
    { term: 'layer normalization', weight: 6 },
    { term: 'rmsnorm', weight: 7, exact: true },
    { term: 'rotary embedding', weight: 8 },
    { term: 'rope', weight: 7, exact: true },
    { term: 'alibi', weight: 7, exact: true },
    { term: 'mixture of experts', weight: 9 },
    { term: 'moe', weight: 8, exact: true },
    { term: 'grouped query attention', weight: 8 },
    { term: 'gqa', weight: 7, exact: true },
  ],

  'safety': [
    // Core safety
    { term: 'ai safety', weight: 10 },
    { term: 'alignment', weight: 9 },
    { term: 'ai alignment', weight: 10 },
    { term: 'interpretability', weight: 9 },
    { term: 'explainability', weight: 8 },
    { term: 'xai', weight: 7, exact: true },
    // Attacks & defense
    { term: 'jailbreak', weight: 10 },
    { term: 'adversarial', weight: 7 },
    { term: 'adversarial attack', weight: 8 },
    { term: 'red-teaming', weight: 10 },
    { term: 'red team', weight: 9 },
    { term: 'guardrails', weight: 9 },
    { term: 'content moderation', weight: 8 },
    { term: 'safety filter', weight: 8 },
    // Concepts
    { term: 'harmlessness', weight: 9 },
    { term: 'helpfulness', weight: 7 },
    { term: 'honesty', weight: 7 },
    { term: 'constitutional ai', weight: 10 },
    { term: 'cai', weight: 7, exact: true },
    { term: 'value alignment', weight: 9 },
    { term: 'preference learning', weight: 8 },
    // Risks
    { term: 'bias', weight: 6 },
    { term: 'fairness', weight: 7 },
    { term: 'toxicity', weight: 8 },
    { term: 'hallucination', weight: 8 },
    { term: 'factuality', weight: 8 },
    { term: 'misinformation', weight: 7 },
    // Mechanistic
    { term: 'mechanistic interpretability', weight: 10 },
    { term: 'probing', weight: 7 },
    { term: 'circuit analysis', weight: 9 },
    { term: 'activation patching', weight: 9 },
  ],

  'science': [
    // Core AI for science
    { term: 'ai for science', weight: 10 },
    { term: 'scientific discovery', weight: 9 },
    { term: 'scientific machine learning', weight: 9 },
    // Biology
    { term: 'protein', weight: 7 },
    { term: 'protein structure', weight: 9 },
    { term: 'protein folding', weight: 10 },
    { term: 'alphafold', weight: 10, exact: true },
    { term: 'esm', weight: 8, exact: true },
    { term: 'drug discovery', weight: 9 },
    { term: 'molecule', weight: 7 },
    { term: 'molecular', weight: 6 },
    { term: 'drug design', weight: 9 },
    { term: 'docking', weight: 7 },
    { term: 'binding affinity', weight: 8 },
    { term: 'genomics', weight: 8 },
    { term: 'dna', weight: 6, exact: true },
    { term: 'rna', weight: 6, exact: true },
    // Chemistry
    { term: 'chemistry', weight: 7 },
    { term: 'retrosynthesis', weight: 9 },
    { term: 'reaction prediction', weight: 8 },
    { term: 'materials science', weight: 8 },
    { term: 'materials discovery', weight: 9 },
    // Physics
    { term: 'physics simulation', weight: 8 },
    { term: 'climate', weight: 7 },
    { term: 'weather prediction', weight: 8 },
    { term: 'weather forecasting', weight: 8 },
    { term: 'pangu-weather', weight: 9, exact: true },
    { term: 'graphcast', weight: 9, exact: true },
    // Math
    { term: 'theorem proving', weight: 9 },
    { term: 'mathematical reasoning', weight: 8 },
    { term: 'formal verification', weight: 8 },
  ],

  'efficiency': [
    // Core efficiency
    { term: 'efficient', weight: 6 },
    { term: 'efficiency', weight: 6 },
    { term: 'lightweight', weight: 8 },
    { term: 'small language model', weight: 9 },
    { term: 'slm', weight: 7, exact: true },
    // Quantization
    { term: 'quantization', weight: 9 },
    { term: 'int8', weight: 8, exact: true },
    { term: 'int4', weight: 9, exact: true },
    { term: 'fp16', weight: 7, exact: true },
    { term: 'bf16', weight: 7, exact: true },
    { term: 'gptq', weight: 9, exact: true },
    { term: 'awq', weight: 9, exact: true },
    { term: 'gguf', weight: 8, exact: true },
    // Pruning & compression
    { term: 'pruning', weight: 8 },
    { term: 'structured pruning', weight: 9 },
    { term: 'unstructured pruning', weight: 8 },
    { term: 'model compression', weight: 9 },
    { term: 'knowledge distillation', weight: 9 },
    { term: 'distillation', weight: 8 },
    // Deployment
    { term: 'on-device', weight: 9 },
    { term: 'edge deployment', weight: 9 },
    { term: 'mobile', weight: 7 },
    { term: 'embedded', weight: 7 },
    { term: 'real-time', weight: 7 },
    { term: 'low latency', weight: 8 },
    { term: 'inference optimization', weight: 9 },
    // Techniques
    { term: 'sparse', weight: 6 },
    { term: 'sparsity', weight: 7 },
    { term: 'mixture of experts', weight: 8 },
    { term: 'early exit', weight: 8 },
    { term: 'speculative decoding', weight: 9 },
    { term: 'kv cache', weight: 8 },
    { term: 'cache optimization', weight: 8 },
  ],
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
  // New categories
  'nlp': [],
  'llm': [],
  'rag': [],
  'multimodal': [],
  'robotics': [
    { term: 'surgical robot', penalty: 3 },
  ],
  'rl': [],
  'transformers': [],
  'safety': [
    { term: 'road safety', penalty: 8 },
    { term: 'workplace safety', penalty: 8 },
    { term: 'food safety', penalty: 8 },
  ],
  'science': [],
  'efficiency': [],
};

// arXiv category mappings - boost scores when paper is in relevant arxiv category
export const ARXIV_CATEGORY_BOOST: Record<string, Partial<Record<TopicCategory, number>>> = {
  'cs.AI': {
    'agentic-coding': 1.2,
    'market-opportunity': 1.1,
    'llm': 1.2,
    'safety': 1.2,
  },
  'cs.LG': {
    'image-generation': 1.1,
    'video-generation': 1.1,
    'runpod': 1.1,
    'rl': 1.3,
    'transformers': 1.2,
    'efficiency': 1.2,
  },
  'cs.CV': {
    'image-generation': 1.3,
    'video-generation': 1.3,
    'ai-content-creators': 1.2,
    'multimodal': 1.3,
  },
  'cs.CL': {
    'agentic-coding': 1.1,
    'ai-content-creators': 1.1,
    'nlp': 1.4,
    'llm': 1.3,
    'rag': 1.2,
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
    'multimodal': 1.3,
  },
  'eess.AS': {
    'ai-content-creators': 1.3,
  },
  'cs.RO': {
    'robotics': 1.4,
    'rl': 1.2,
  },
  'cs.NE': {
    'transformers': 1.2,
    'efficiency': 1.1,
  },
  'q-bio': {
    'science': 1.3,
  },
  'physics': {
    'science': 1.2,
  },
  'stat.ML': {
    'rl': 1.2,
    'transformers': 1.1,
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
  // New categories
  'nlp': 'NLP & Language',
  'llm': 'Large Language Models',
  'rag': 'RAG & Retrieval',
  'multimodal': 'Multimodal AI',
  'robotics': 'Robotics & Embodied AI',
  'rl': 'Reinforcement Learning',
  'transformers': 'Transformers & Architectures',
  'safety': 'AI Safety & Alignment',
  'science': 'AI for Science',
  'efficiency': 'Efficient AI',
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
  // New categories
  'nlp': '#14B8A6',                 // Teal
  'llm': '#7C3AED',                 // Violet
  'rag': '#10B981',                 // Emerald
  'multimodal': '#F43F5E',          // Rose
  'robotics': '#6366F1',            // Slate Blue
  'rl': '#F59E0B',                  // Amber
  'transformers': '#0EA5E9',        // Sky
  'safety': '#EF4444',              // Red
  'science': '#22C55E',             // Green
  'efficiency': '#FB923C',          // Light Orange
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
  // New categories
  'nlp': '📝',
  'llm': '🧠',
  'rag': '🔍',
  'multimodal': '🔲',
  'robotics': '🦾',
  'rl': '🎮',
  'transformers': '🔌',
  'safety': '🛡️',
  'science': '🧪',
  'efficiency': '⚡',
  'other': '📄',
};

// Gradient colors for the new CategoryGradientBar component
export const CATEGORY_GRADIENT_COLORS: Record<TopicCategory, { start: string; end: string }> = {
  'agentic-coding': { start: '#8b5cf6', end: '#6d28d9' },
  'image-generation': { start: '#ec4899', end: '#db2777' },
  'video-generation': { start: '#f97316', end: '#ea580c' },
  'ai-content-creators': { start: '#06b6d4', end: '#0891b2' },
  'comfyui': { start: '#84cc16', end: '#65a30d' },
  'runpod': { start: '#6366f1', end: '#4f46e5' },
  'market-opportunity': { start: '#eab308', end: '#ca8a04' },
  'nlp': { start: '#14B8A6', end: '#0D9488' },
  'llm': { start: '#7C3AED', end: '#5B21B6' },
  'rag': { start: '#10B981', end: '#059669' },
  'multimodal': { start: '#F43F5E', end: '#E11D48' },
  'robotics': { start: '#6366F1', end: '#4F46E5' },
  'rl': { start: '#F59E0B', end: '#D97706' },
  'transformers': { start: '#0EA5E9', end: '#0284C7' },
  'safety': { start: '#EF4444', end: '#DC2626' },
  'science': { start: '#22C55E', end: '#16A34A' },
  'efficiency': { start: '#FB923C', end: '#F97316' },
  'other': { start: '#6b7280', end: '#4b5563' },
};

export const CATEGORY_DESCRIPTIONS: Record<TopicCategory, string> = {
  'agentic-coding': 'AI agents, tool use, autonomous coding assistants',
  'image-generation': 'Diffusion models, text-to-image, LoRA, ControlNet',
  'video-generation': 'Text-to-video, video synthesis, temporal consistency',
  'ai-content-creators': 'Voice cloning, music gen, avatars, digital humans',
  'comfyui': 'Node-based workflows, custom nodes, pipelines',
  'runpod': 'GPU inference, quantization, model serving, deployment',
  'market-opportunity': 'Commercial potential, efficient methods, practical applications',
  // New categories
  'nlp': 'NLP, text classification, translation, summarization',
  'llm': 'Foundation models, pretraining, instruction tuning, RLHF',
  'rag': 'Retrieval-augmented generation, vector search, embeddings',
  'multimodal': 'Vision-language models, cross-modal learning',
  'robotics': 'Robot learning, manipulation, navigation, embodied AI',
  'rl': 'RL algorithms, policy learning, decision making',
  'transformers': 'Model architectures, attention mechanisms, efficiency',
  'safety': 'Alignment, interpretability, red-teaming, guardrails',
  'science': 'Drug discovery, protein folding, climate, materials',
  'efficiency': 'Quantization, pruning, distillation, on-device ML',
  'other': 'Other AI/ML papers',
};

// Priority order for displaying categories (most important first)
export const CATEGORY_PRIORITY: TopicCategory[] = [
  'llm',
  'agentic-coding',
  'rag',
  'multimodal',
  'image-generation',
  'video-generation',
  'ai-content-creators',
  'nlp',
  'transformers',
  'rl',
  'robotics',
  'safety',
  'efficiency',
  'science',
  'comfyui',
  'runpod',
  'market-opportunity',
  'other',
];
