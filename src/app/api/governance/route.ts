import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rateLimits = await prisma.rateLimit.findMany({
      include: { apiKey: true },
    });
    const configs = await prisma.governanceConfig.findMany();
    
    return NextResponse.json({ rateLimits, configs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, id, limit, window, isEnabled } = await req.json();
    
    if (type === 'ratelimit') {
      const updated = await prisma.rateLimit.update({
        where: { id },
        data: { limit, window },
      });
      return NextResponse.json(updated);
    }
    
    if (type === 'governance') {
      const updated = await prisma.governanceConfig.update({
        where: { id },
        data: { isEnabled },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
