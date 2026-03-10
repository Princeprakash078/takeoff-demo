"use client";

import { useEffect, useState } from "react";
import { Box, Plus, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ModelsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/models");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch models", err);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

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
            <Box className="h-8 w-8 text-primary" />
            Model Registry
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your connected AI providers and available language models.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Provider
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {data.providers.map((p: any) => (
          <div key={p.name} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col items-start justify-between">
            <div className="flex justify-between w-full items-start">
              <h3 className="font-semibold text-white capitalize">{p.name}</h3>
              {p.status === "Connected" ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
                  <XCircle className="h-3.5 w-3.5" />
                  Offline
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-4">
              {p.models} models active
            </p>
          </div>
        ))}
        {data.providers.length === 0 && (
           <p className="text-sm text-muted-foreground italic col-span-4 py-4 text-center glass-panel rounded-xl">No providers connected yet.</p>
        )}
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <h3 className="font-semibold text-white">Available Models</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search models..."
              className="h-9 w-[250px] rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/10 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Model ID</th>
                <th className="px-6 py-4 font-semibold">Provider</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.models.map((model: any) => (
                <tr key={model.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{model.modelId}</td>
                  <td className="px-6 py-4 text-muted-foreground capitalize">{model.provider}</td>
                  <td className="px-6 py-4">
                    {model.active ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/80 font-medium text-sm">
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
              {data.models.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground italic">No models registered in the database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
