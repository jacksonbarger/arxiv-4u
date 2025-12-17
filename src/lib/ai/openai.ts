import OpenAI from 'openai';

// Initialize PredictionGuard client (OpenAI-compatible API)
const openai = new OpenAI({
  apiKey: process.env.PREDICTIONGUARD_API_KEY || '',
  baseURL: process.env.PREDICTIONGUARD_URL ? `${process.env.PREDICTIONGUARD_URL}/v1` : 'https://globalpath.predictionguard.com/v1',
});

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// PredictionGuard supported models
type PredictionGuardModel = 'Hermes-3-Llama-3.1-8B' | 'Hermes-3-Llama-3.1-70B' | 'llava-1.5-7b-hf' | 'Neural-Chat-7B';

/**
 * Generate text using PredictionGuard (OpenAI-compatible)
 */
export async function generateText(
  prompt: string,
  options?: {
    model?: PredictionGuardModel | string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  // Use Hermes-3-Llama-3.1-70B as the default high-quality model
  const model = options?.model || 'Hermes-3-Llama-3.1-70B';
  const maxTokens = options?.maxTokens || 4000;
  const temperature = options?.temperature || 1.0;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (options?.systemPrompt) {
    messages.push({
      role: 'system',
      content: options.systemPrompt,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const response = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in response');
  }

  return content;
}

/**
 * Generate text with conversation history
 */
export async function generateWithHistory(
  messages: Message[],
  options?: {
    model?: PredictionGuardModel | string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const model = options?.model || 'Hermes-3-Llama-3.1-70B';
  const maxTokens = options?.maxTokens || 4000;
  const temperature = options?.temperature || 1.0;

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (options?.systemPrompt) {
    openaiMessages.push({
      role: 'system',
      content: options.systemPrompt,
    });
  }

  openaiMessages.push(...messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.content,
  })));

  const response = await openai.chat.completions.create({
    model,
    messages: openaiMessages,
    max_tokens: maxTokens,
    temperature,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in response');
  }

  return content;
}

/**
 * Generate structured JSON output
 */
export async function generateJSON<T>(
  prompt: string,
  options?: {
    model?: PredictionGuardModel | string;
    maxTokens?: number;
    systemPrompt?: string;
  }
): Promise<T> {
  const fullPrompt = `${prompt}\n\nIMPORTANT: Respond with valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text. Start your response with { and end with }.`;

  const response = await generateText(fullPrompt, {
    ...options,
    temperature: 0.3, // Lower temperature for more consistent JSON
  });

  // Extract JSON from response (in case GPT adds markdown)
  let jsonStr = response.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonStr);
    throw new Error(`Invalid JSON response from PredictionGuard: ${error}`);
  }
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Check if PredictionGuard API key is configured
 */
export function isConfigured(): boolean {
  return !!process.env.PREDICTIONGUARD_API_KEY && process.env.PREDICTIONGUARD_API_KEY.length > 0;
}
