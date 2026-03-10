"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Save, Loader2, Code2, Layers } from "lucide-react";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await fetch("/api/prompts");
        const json = await res.json();
        setPrompts(json);
        if (json.length > 0 && !selectedPrompt) {
          setSelectedPrompt(json[0]);
        }
      } catch (err) {
        console.error("Failed to fetch prompts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompts();
  }, []);

  const savePrompt = async () => {
    if (!selectedPrompt) return;
    setSaving(true);
    try {
      await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPrompt),
      });
      // Refresh list
      const res = await fetch("/api/prompts");
      const json = await res.json();
      setPrompts(json);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-secondary/10">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" /> Templates
          </h3>
          <button className="text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrompt(p)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedPrompt?.id === p.id 
                  ? "bg-primary/10 border border-primary/20 text-white" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <div className="font-medium text-sm truncate">{p.name}</div>
              <div className="text-[10px] opacity-60 mt-1 flex justify-between">
                <span>v{p.version}</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor View */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedPrompt ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-white">{selectedPrompt.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedPrompt.description || "No description provided."}</p>
                </div>
              </div>
              <button 
                onClick={savePrompt}
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> Prompt Content
                </label>
                <textarea
                  value={selectedPrompt.content}
                  onChange={(e) => setSelectedPrompt({...selectedPrompt, content: e.target.value})}
                  className="w-full h-[400px] bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-foreground focus:border-primary/50 outline-none font-mono leading-relaxed"
                  placeholder="Enter your prompt here..."
                />
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/5 bg-primary/5">
                <h4 className="text-sm font-semibold text-white mb-2 underline decoration-primary/30 underline-offset-4">Governance Note</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Changes to this prompt will automatically increment the version. All calls using this template name via the gateway will immediately receive the updated version.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground italic">
            <Layers className="h-12 w-12 mb-4 opacity-20" />
            Select a template from the sidebar to start editing.
          </div>
        )}
      </div>
    </div>
  );
}
