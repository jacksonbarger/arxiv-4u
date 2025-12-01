import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate text using Claude
 */
export async function generateText(
  prompt: string,
  options?: {
    model?: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022';
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const model = options?.model || 'claude-3-5-sonnet-20241022';
  const maxTokens = options?.maxTokens || 4000;
  const temperature = options?.temperature || 1.0;

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: options?.systemPrompt,
    messages,
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

/**
 * Generate text with conversation history
 */
export async function generateWithHistory(
  messages: Message[],
  options?: {
    model?: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022';
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const model = options?.model || 'claude-3-5-sonnet-20241022';
  const maxTokens = options?.maxTokens || 4000;
  const temperature = options?.temperature || 1.0;

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: options?.systemPrompt,
    messages: anthropicMessages,
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

/**
 * Generate structured JSON output
 */
export async function generateJSON<T>(
  prompt: string,
  options?: {
    model?: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022';
    maxTokens?: number;
    systemPrompt?: string;
  }
): Promise<T> {
  const fullPrompt = `${prompt}\n\nIMPORTANT: Respond with valid JSON only. Do not include any markdown formatting, code blocks, or explanatory text. Start your response with { and end with }.`;

  const response = await generateText(fullPrompt, {
    ...options,
    temperature: 0.3, // Lower temperature for more consistent JSON
  });

  // Extract JSON from response (in case Claude adds markdown)
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
    throw new Error(`Invalid JSON response from Claude: ${error}`);
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
 * Check if API key is configured
 */
export function isConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_api_key_here';
}
