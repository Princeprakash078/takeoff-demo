import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalRequests = await prisma.usageRecord.count();
    const activeModels = await prisma.modelConfig.count({ where: { active: true } });
    const blockedRequests = await prisma.usageRecord.count({ where: { status: { not: 200 } } });
    
    // Calculate Average Latency
    const stats = await prisma.usageRecord.aggregate({
      _avg: {
        latency: true,
      },
    });
    
    const avgLatency = Math.round(stats._avg.latency || 0);

    // Get usage over time (last 7 days)
    // For SQLite, we can use strftime to group by day
    const rawUsage = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m-%d', createdAt) as day,
        SUM(tokensIn + tokensOut) as totalTokens
      FROM UsageRecord
      WHERE createdAt > datetime('now', '-7 days')
      GROUP BY day
      ORDER BY day ASC
    ` as any[];

    // Get models by cost
    const modelCosts = await prisma.usageRecord.groupBy({
      by: ['modelId', 'provider'],
      _sum: {
        cost: true,
      },
      orderBy: {
        _sum: {
          cost: 'desc',
        },
      },
      take: 5,
    });

    // Provider distribution for analytics
    const providerDistribution = await prisma.usageRecord.groupBy({
      by: ['provider'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      metrics: {
        totalRequests,
        avgLatency,
        activeModels,
        blockedRequests,
      },
      chartData: rawUsage.map(d => ({
        name: new Date(d.day).toLocaleDateString('en-US', { weekday: 'short' }),
        tokens: Number(d.totalTokens) || 0,
      })),
      topModels: modelCosts.map((m: any) => ({
        modelId: m.modelId,
        provider: m.provider,
        cost: m._sum.cost || 0,
      })),
      providerDistribution: providerDistribution.map((p: any) => ({
        provider: p.provider,
        count: p._count.id
      }))
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
