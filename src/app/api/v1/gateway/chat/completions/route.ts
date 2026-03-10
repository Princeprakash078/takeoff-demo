import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { callProvider } from "@/lib/providers/providerManager";
import { routeToMCP } from "@/lib/mcp/mcpRouter";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing or invalid API key" }, { status: 401 });
    }
    
    const apiKeyStr = authHeader.replace("Bearer ", "");
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: apiKeyStr },
      include: { 
        usageRecords: true,
        rateLimits: true 
      },
    });
    
    if (!apiKey || !apiKey.active) {
      return NextResponse.json({ error: "Unauthorized: Invalid or inactive API key" }, { status: 401 });
    }
    
    // 2. Budget Control
    if (apiKey.usageTotal >= apiKey.budgetLimit) {
      return NextResponse.json({ error: "Budget Exceeded: Please increase your limit" }, { status: 429 });
    }

    // 3. Rate Limiting
    const rateLimitCheck = await checkRateLimit(apiKey.id);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ error: "Rate Limit Exceeded: Please slow down" }, { status: 429 });
    }
    
    // 4. Request Parsing & Guardrails
    const body = await req.json();
    const { model, messages, stream } = body;
    
    if (!model || !messages) {
      return NextResponse.json({ error: "Bad Request: Missing 'model' or 'messages' in body" }, { status: 400 });
    }

    // [GUARDRAIL] Simple Moderation Check (Demo)
    const lastMessage = messages[messages.length - 1]?.content || "";
    if (lastMessage.toLowerCase().includes("attack") || lastMessage.toLowerCase().includes("bomb")) {
      return NextResponse.json({ error: "Guardrail Triggered: Content moderation policy check failed." }, { status: 403 });
    }

    // [PHASE 5] MCP Server Routing
    const mcpResult = await routeToMCP(lastMessage);
    if (mcpResult.handled) {
      const endTime = Date.now();
      const latency = endTime - startTime;
      const cost = 0.001; // Base cost for MCP operations

      await prisma.$transaction([
        prisma.usageRecord.create({
          data: {
            apiKeyId: apiKey.id,
            modelId: `mcp-${mcpResult.source}`,
            provider: "mcp",
            tokensIn: 0,
            tokensOut: 0,
            cost: cost,
            latency: latency,
            status: 200,
          },
        }),
        prisma.apiKey.update({
          where: { id: apiKey.id },
          data: {
            usageTotal: { increment: cost },
            lastUsed: new Date(),
          },
        }),
      ]);

      return NextResponse.json({
        id: `mcp-${Math.random().toString(36).substring(7)}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          message: { role: "assistant", content: mcpResult.content },
          finish_reason: "stop",
        }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        mcp_source: mcpResult.source
      });
    }
    
    // 5. Routing & Execution via Provider Manager
    const providerResponse = await callProvider(model, messages, { stream });
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    // 6. Logging & Analytics (Real cost logic)
    const cost = providerResponse.usage.total_tokens * 0.00002; // Mock cost calculation per token
    
    await prisma.$transaction([
      prisma.usageRecord.create({
        data: {
          apiKeyId: apiKey.id,
          modelId: model,
          provider: providerResponse.provider,
          tokensIn: providerResponse.usage.prompt_tokens,
          tokensOut: providerResponse.usage.completion_tokens,
          cost: cost,
          latency: latency,
          status: 200,
        },
      }),
      prisma.apiKey.update({
        where: { id: apiKey.id },
        data: {
          usageTotal: { increment: cost },
          lastUsed: new Date(),
        },
      }),
    ]);
    
    return NextResponse.json({
      id: `chatcmpl-${Math.random().toString(36).substring(7)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: providerResponse.model,
      choices: [{
        index: 0,
        message: { role: "assistant", content: providerResponse.content },
        finish_reason: "stop",
      }],
      usage: providerResponse.usage,
    });
    
  } catch (error: any) {
    console.error("Gateway Error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
