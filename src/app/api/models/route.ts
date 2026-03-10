import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const models = await prisma.modelConfig.findMany({
      orderBy: { provider: 'asc' },
    });
    
    // Group by provider for the summary cards
    const providers = Array.from(new Set(models.map((m: { provider: string }) => m.provider))).map((p) => {
      const name = String(p);
      return {
        name,
        status: "Connected",
        models: models.filter((m: { provider: string }) => m.provider === name).length
      };
    });

    return NextResponse.json({ models, providers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
