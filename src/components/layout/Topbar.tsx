"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-white/5 bg-background/40 px-6 backdrop-blur-xl shrink-0">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search API keys, models, or logs..."
            className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
