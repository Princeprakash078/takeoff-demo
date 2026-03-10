import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const mcpServers = await prisma.mcpServer.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    const agents = await prisma.agentConfig.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    
    return NextResponse.json({ mcpServers, agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, action, id, name, url, mcpType, framework, role, goal, status } = await req.json();
    
    if (type === 'mcp') {
      if (action === 'delete') {
        await prisma.mcpServer.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      const mcp = await prisma.mcpServer.upsert({
        where: { name: name },
        update: { url, type: mcpType, status },
        create: { name, url, type: mcpType, status },
      });
      return NextResponse.json(mcp);
    }
    
    if (type === 'agent') {
      if (action === 'delete') {
        await prisma.agentConfig.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      const agent = await prisma.agentConfig.upsert({
        where: { name: name },
        update: { framework, role, goal, status },
        create: { name, framework, role, goal, status },
      });
      return NextResponse.json(agent);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
