export interface ProviderResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  provider: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function callProvider(
  model: string,
  messages: ChatMessage[],
  options: { stream?: boolean } = {}
): Promise<ProviderResponse> {
  const provider = getProviderForModel(model);
  const apiKey = getApiKeyForProvider(provider);
  
  if (!apiKey) {
    console.warn(`[Gateway] No API key found for ${provider}. Falling back to mock response.`);
    return mockResponse(model, provider);
  }

  try {
    switch (provider) {
      case "openai":
        return await callOpenAI(model, messages, apiKey);
      case "anthropic":
        return mockResponse(model, provider, "[Anthropic Integration Pending]");
      case "google":
        return mockResponse(model, provider, "[Gemini Integration Pending]");
      default:
        return mockResponse(model, "unknown");
    }
  } catch (error) {
    console.error(`[Gateway] Error calling ${provider}:`, error);
    throw error;
  }
}

function getProviderForModel(model: string): string {
  if (model.startsWith("gpt-") || model.includes("openai")) return "openai";
  if (model.startsWith("claude-") || model.includes("anthropic")) return "anthropic";
  if (model.startsWith("gemini-") || model.includes("google")) return "google";
  return "openai";
}

function getApiKeyForProvider(provider: string): string | undefined {
  switch (provider) {
    case "openai": return process.env.OPENAI_API_KEY;
    case "anthropic": return process.env.ANTHROPIC_API_KEY;
    case "google": return process.env.GEMINI_API_KEY;
    default: return undefined;
  }
}

async function callOpenAI(model: string, messages: any[], apiKey: string): Promise<ProviderResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    usage: {
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0,
    },
    model: data.model,
    provider: "openai",
  };
}

function mockResponse(model: string, provider: string, prefix: string = ""): ProviderResponse {
  return {
    content: `${prefix}[TAKEOFF GATEWAY SIMULATION] This is a simulated response for ${model} via ${provider}.`,
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
    model,
    provider,
  };
}
