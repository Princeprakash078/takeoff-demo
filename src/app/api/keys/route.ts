import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(keys);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, budgetLimit } = await req.json();
    
    // Generate a secure-looking random key
    const randomKey = `tk_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    
    const newKey = await prisma.apiKey.create({
      data: {
        name: name || "New Agent Key",
        key: randomKey,
        budgetLimit: parseFloat(budgetLimit) || 10.0,
      },
    });
    
    return NextResponse.json(newKey);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
