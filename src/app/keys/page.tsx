"use client";

import { useEffect, useState } from "react";
import { KeyRounded, Plus, Copy, MoreVertical, Loader2, Check } from "lucide-react";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchKeys() {
    try {
      const res = await fetch("/api/keys");
      const json = await res.json();
      setKeys(json);
    } catch (err) {
      console.error("Failed to fetch keys", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async () => {
    setCreating(true);
    try {
      const name = prompt("Enter a name for the new API Key:", "My AI Agent");
      if (!name) return;
      
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, budgetLimit: 50.0 }),
      });
      
      if (res.ok) {
        await fetchKeys();
      }
    } catch (err) {
      console.error("Failed to create key", err);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
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
            <KeyRounded className="h-8 w-8 text-primary" />
            Platform API Keys
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Generate and manage API keys to authenticate your applications with Takeoff.
          </p>
        </div>
        <button 
          onClick={createKey}
          disabled={creating}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} 
          Create New Key
        </button>
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-white">Active Keys</h3>
          <p className="text-xs text-muted-foreground">Do not share your API keys in publicly accessible areas.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-black/10 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Secret Key</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Budget Limit</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{key.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-muted-foreground bg-black/30 px-3 py-1.5 rounded-md border border-white/5 w-fit">
                      {key.key.substring(0, 10)}••••••••
                      <button 
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="text-muted-foreground hover:text-white transition-colors ml-2"
                      >
                        {copiedId === key.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-emerald-500 font-medium">
                    ${key.budgetLimit.toFixed(2)}/mo
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    ${key.usageTotal.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">No API keys generated yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
