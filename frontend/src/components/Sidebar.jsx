import {
  LayoutDashboard,
  ScanLine,
  ShieldAlert,
  FileText,
  Settings,
  Network,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Scan Target",
    icon: ScanLine,
  },
  {
    name: "Results",
    icon: Network,
  },
  {
    name: "Security Findings",
    icon: ShieldAlert,
  },
  {
    name: "Reports",
    icon: FileText,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950/95 px-4 py-6 backdrop-blur-xl">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10">
          <ShieldCheck size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide text-white">
            NetSecure
          </h1>

          <p className="text-xs text-slate-500">
            Security Analyzer
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                item.active
                  ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
              }`}
            >
              <Icon
                size={19}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>

      {/* Bottom Card */}
      <div className="mt-auto rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-4">

        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-xs font-medium text-emerald-400">
            SYSTEM READY
          </span>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Authorized network security analysis platform.
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;