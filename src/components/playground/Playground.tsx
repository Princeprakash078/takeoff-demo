"use client";

import { useState } from "react";
import { Send, Terminal, Zap, Shield, Globe } from "lucide-react";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4-turbo");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!apiKey || !prompt) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/v1/gateway/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Test failed:", error);
      setResponse({ error: "Request transformation failed", details: "Check console for more info." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configuration</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Takeoff API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_takeoff_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Streaming enabled by default</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Governance policies active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Gateway Console</span>
              </div>
              <button
                onClick={handleTest}
                disabled={loading || !apiKey || !prompt}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                {loading ? "Executing..." : "Run Test"}
                {!loading && <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here... try @github to test MCP routing!"
                className="flex-1 bg-transparent p-4 text-sm resize-none outline-none placeholder:text-slate-600"
              />
              
              {response && (
                <div className="h-1/2 border-t border-slate-800 bg-slate-950/80 overflow-y-auto p-4 font-mono text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 uppercase tracking-widest text-[10px]">Response JSON</span>
                    {response.mcp_source && (
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                        {response.mcp_source} Route
                      </span>
                    )}
                  </div>
                  <pre className="text-slate-300">{JSON.stringify(response, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <h4 className="text-sm font-medium">Unified Proxy</h4>
          </div>
          <p className="text-xs text-slate-500">Requests are normalized to the OpenAI standard regardless of the target provider.</p>
        </div>
        <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-medium">Guardrails Active</h4>
          </div>
          <p className="text-xs text-slate-500">Security triggers automatically block prompts that violate safety parameters.</p>
        </div>
        <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-sm font-medium">MCP Aware</h4>
          </div>
          <p className="text-xs text-slate-500">Smart routing intercepts @mentions to call specialized integration servers.</p>
        </div>
      </div>
    </div>
  );
}
