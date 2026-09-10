import { Bell, Moon, UserCircle } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/80 px-8 backdrop-blur-xl">

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
          Security Operations
        </p>

        <h2 className="mt-1 text-xl font-bold text-white">
          Network Port Scanning & Security Analysis
        </h2>
      </div>

      <div className="flex items-center gap-3">

        {/* Target */}
        <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:block">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target
          </p>

          <p className="font-mono text-sm text-slate-200">
            10.59.47.15
          </p>
        </div>

        {/* Notification */}
        <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-400 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-white">
          <Bell size={18} />
        </button>

        {/* Theme */}
        <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-400 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:text-white">
          <Moon size={18} />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-all duration-300 hover:bg-white/10">
          <UserCircle size={22} className="text-blue-400" />

          <span className="hidden text-sm text-slate-300 md:block">
            Security Analyst
          </span>
        </button>

      </div>

    </header>
  );
}

export default Header;