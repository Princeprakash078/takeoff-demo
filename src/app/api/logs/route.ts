import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const model = searchParams.get("model") || "";
    
    const logs = await prisma.usageRecord.findMany({
      where: {
        OR: [
          { modelId: { contains: search } },
          { provider: { contains: search } },
          { apiKey: { name: { contains: search } } },
        ],
        ...(model ? { modelId: model } : {}),
      },
      include: {
        apiKey: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    
    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Logs API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
