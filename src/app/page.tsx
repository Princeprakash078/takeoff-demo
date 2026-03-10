"use client";

import { useEffect, useState } from "react";
import { Activity, Zap, Server, ShieldAlert, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = data.metrics;
  const chartData = data.chartData.length > 0 ? data.chartData : [
    { name: "Mon", tokens: 0 }, { name: "Tue", tokens: 0 }, { name: "Wed", tokens: 0 }, 
    { name: "Thu", tokens: 0 }, { name: "Fri", tokens: 0 }, { name: "Sat", tokens: 0 }, { name: "Sun", tokens: 0 }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 text-primary border border-primary/20 text-sm px-3 py-1 rounded-full font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Card 1 */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Total Requests
            </h3>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium">Live</span> from database
          </p>
        </div>

        {/* Metric Card 2 */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Avg Latency
            </h3>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.avgLatency}ms</div>
          <p className="text-xs text-muted-foreground mt-1">
            Response time across models
          </p>
        </div>

        {/* Metric Card 3 */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Active Models
            </h3>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.activeModels}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered in database
          </p>
        </div>

        {/* Metric Card 4 */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Blocked Requests
            </h3>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.blockedRequests}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Exceeded budget limits
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="glass-panel rounded-xl p-6 col-span-4">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight text-white">Token Usage Over Time</h3>
            <p className="text-sm text-muted-foreground">Total tokens processed across all models.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value: string | number) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderRadius: '8px',
                    borderColor: 'hsl(var(--border))',
                    color: 'white'
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorTokens)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 col-span-3">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight text-white">Top Models by Cost</h3>
            <p className="text-sm text-muted-foreground">Spend distribution this month.</p>
          </div>
          <div className="space-y-8">
            {data.topModels.map((m: any) => (
              <div key={m.modelId} className="flex items-center">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none text-white">{m.modelId}</p>
                  <p className="text-sm text-muted-foreground capitalize">{m.provider}</p>
                </div>
                <div className="ml-auto font-medium text-white">${m.cost.toFixed(4)}</div>
              </div>
            ))}
            {data.topModels.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8 italic">No usage data recorded yet.</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider Distribution</h4>
            <div className="space-y-3">
              {data.providerDistribution?.map((p: any) => (
                <div key={p.provider} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white capitalize">{p.provider}</span>
                    <span className="text-muted-foreground">{p.count} requests</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-primary h-1 rounded-full" 
                      style={{ width: `${(p.count / data.metrics.totalRequests) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
