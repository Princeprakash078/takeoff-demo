"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft, ShieldCheck, Timer, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function RoutingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function fetchGovernance() {
    try {
      const res = await fetch("/api/governance");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch governance", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGovernance();
  }, []);

  const updateRateLimit = async (id: string, limit: number, window: number) => {
    setSaving(id);
    try {
      await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'ratelimit', id, limit, window }),
      });
      await fetchGovernance();
    } finally {
      setSaving(null);
    }
  };

  const toggleGovernance = async (id: string, isEnabled: boolean) => {
    setSaving(id);
    try {
      await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'governance', id, isEnabled }),
      });
      await fetchGovernance();
    } finally {
      setSaving(null);
    }
  };

  if (loading || !data) {
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
            <ArrowRightLeft className="h-8 w-8 text-primary" />
            Governance & Routing
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Control traffic flow, enforce rate limits, and manage content guardrails.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rate Limiting Section */}
        <div className="glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Timer className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Rate Limits</h3>
          </div>
          <div className="space-y-4">
            {data.rateLimits.map((rl: any) => (
              <div key={rl.id} className="bg-black/20 p-4 rounded-lg border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{rl.apiKey.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{rl.apiKey.key.substring(0, 8)}...</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Limit (Req)</label>
                    <input 
                      type="number" 
                      defaultValue={rl.limit}
                      onBlur={(e) => updateRateLimit(rl.id, parseInt(e.target.value), rl.window)}
                      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Window (Sec)</label>
                    <input 
                      type="number" 
                      defaultValue={rl.window}
                      onBlur={(e) => updateRateLimit(rl.id, rl.limit, parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary/50 outline-none"
                    />
                  </div>
                </div>
                {saving === rl.id && (
                  <div className="text-[10px] text-primary animate-pulse flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving changes...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Guardrails Section */}
        <div className="glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Content Guardrails</h3>
          </div>
          <div className="space-y-3">
            {data.configs.map((config: any) => (
              <div key={config.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <div className="font-medium text-white text-sm">{config.name}</div>
                  <div className="text-xs text-muted-foreground">Enforces safety policies on incoming prompts.</div>
                </div>
                <button 
                  onClick={() => toggleGovernance(config.id, !config.isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${config.isEnabled ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white">System Guardrails Active</div>
                <div className="text-xs text-muted-foreground mt-1">Takeoff is currently monitoring all traffic for PII and aggressive prompt injections.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
