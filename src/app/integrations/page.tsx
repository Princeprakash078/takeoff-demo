"use client";

import { useEffect, useState } from "react";
import { Share2, Plus, Bot, Server, ExternalLink, Shield, Loader2, Trash2 } from "lucide-react";

export default function IntegrationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mcp' | 'agents'>('mcp');

  async function fetchIntegrations() {
    try {
      const res = await fetch("/api/integrations");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch integrations", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const deleteIntegration = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this integration?")) return;
    try {
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, action: 'delete', id }),
      });
      fetchIntegrations();
    } catch (err) {
      console.error("Delete failed", err);
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
            <Share2 className="h-8 w-8 text-primary" />
            Integrations & Agents
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Connect Model Context Protocol (MCP) servers and specialized AI agents.
          </p>
        </div>
      </div>

      <div className="flex border-b border-white/5 space-x-8 mb-6">
        <button 
          onClick={() => setActiveTab('mcp')}
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'mcp' ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"}`}
        >
          MCP Servers
        </button>
        <button 
          onClick={() => setActiveTab('agents')}
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'agents' ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"}`}
        >
          Agent Frameworks
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === 'mcp' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.mcpServers.map((server: any) => (
              <div key={server.id} className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 hover:border-primary/20 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Server className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${server.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                      {server.status}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{server.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{server.url}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground uppercase">{server.type}</span>
                  </div>
                  <button 
                    onClick={() => deleteIntegration('mcp', server.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-white/5 transition-all min-h-[160px]">
              <div className="p-2 bg-white/5 rounded-full">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium text-white">Add MCP Server</div>
              <p className="text-xs text-muted-foreground">Integrate GitHub, Jira, Slack or custom servers.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {data.agents.map((agent: any) => (
              <div key={agent.id} className="glass-panel p-6 rounded-xl border border-white/5 space-y-6 hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white uppercase">{agent.framework}</span>
                        <div className="text-[10px] flex items-center gap-1 text-emerald-400">
                          <Shield className="h-3 w-3" /> Secure
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteIntegration('agent', agent.id)}
                    className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Role</div>
                      <div className="text-sm text-white">{agent.role}</div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Goal</div>
                      <div className="text-sm text-white truncate">{agent.goal}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-muted-foreground">Last synchronized: {new Date(agent.updatedAt).toLocaleDateString()}</span>
                    <button className="text-primary hover:underline flex items-center gap-1">
                      View Logic <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border border-dashed border-white/10 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <div className="font-medium text-white">Deploy New Agent</div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="p-2 bg-primary/20 rounded-lg mt-1">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-white font-semibold flex items-center gap-2">Enterprise-Grade Integration Protocol</h4>
            <p className="text-sm text-muted-foreground mt-1">
              All MCP servers and Agent frameworks are proxied through the Takeoff Gateway. We ensure all external tool-calling is audited, rate-limited, and compliant with your security guardrails.
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
          Read Integration Docs
        </button>
      </div>
    </div>
  );
}
