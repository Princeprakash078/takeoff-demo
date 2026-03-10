"use client";

import { useEffect, useState } from "react";
import { Activity, Search, Filter, Loader2, Clock, Zap, DollarSign } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await fetch(`/api/logs${query}`);
        const json = await res.json();
        setLogs(json);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    }
    
    const handler = setTimeout(fetchLogs, 300); // Simple debounce
    const interval = setInterval(fetchLogs, 5000);
    
    return () => {
      clearTimeout(handler);
      clearInterval(interval);
    };
  }, [search]);

  if (loading && logs.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Request Logs
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time monitoring of all AI requests passing through the gateway.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by model, provider, or key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] lg:w-[300px] rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-black/30 border-b border-white/5 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">API Key</th>
                <th className="px-6 py-4 font-semibold">Model</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Latency</th>
                <th className="px-6 py-4 font-semibold">Tokens</th>
                <th className="px-6 py-4 font-semibold text-right"><DollarSign className="h-3 w-3" /> Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {log.apiKey?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs">
                      {log.modelId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {log.status === 429 ? (
                      <span className="text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">429</span>
                    ) : log.status === 200 ? (
                      <span className="text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">200</span>
                    ) : (
                      <span className="text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold">{log.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {log.latency}ms
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {log.tokensIn + log.tokensOut} <span className="text-[10px] opacity-60">({log.tokensIn} in)</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-white">
                    ${log.cost.toFixed(4)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground italic">No requests recorded yet. Try calling the gateway!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
