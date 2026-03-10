"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  KeyRound,
  Settings2,
  Activity,
  Rocket,
  ArrowRightLeft,
  FileText,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Playground", href: "/playground", icon: Rocket },
  { name: "Models", href: "/models", icon: Box },
  { name: "Prompts", href: "/prompts", icon: FileText },
  { name: "Routing", href: "/routing", icon: ArrowRightLeft },
  { name: "Integrations", href: "/integrations", icon: Share2 },
  { name: "API Keys", href: "/keys", icon: KeyRound },
  { name: "Logs", href: "/logs", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-secondary/20 border-r border-white/5 px-4 py-6 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex bg-primary/20 p-2 rounded-lg border border-primary/30">
          <Rocket className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Takeoff
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
              )}
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-2">
          <div className="text-xs font-semibold text-white/80 uppercase tracking-widest">
            Workspace Limits
          </div>
          <div className="text-2xl font-bold">
            $43.20<span className="text-sm font-medium text-muted-foreground">/mo</span>
          </div>
          <div className="w-full bg-black/40 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">45% of $100 budget</div>
        </div>
      </div>
    </div>
  );
}
