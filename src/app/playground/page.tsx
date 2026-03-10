import Playground from "@/components/playground/Playground";
import { Terminal } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Terminal className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Prompt Playground</h1>
          <p className="text-slate-400 text-sm mt-1">Test your AI Gateway integration with real-time governance and MCP routing.</p>
        </div>
      </div>

      <Playground />
    </div>
  );
}
