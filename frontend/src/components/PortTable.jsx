import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Network,
  Search,
  Filter,
  ExternalLink,
  X,
  ShieldAlert,
  ShieldCheck,
  Server,
  Activity,
} from "lucide-react";

/* =========================================================
   STATE BADGE
========================================================= */

function StateBadge({ state }) {
  const normalizedState = (state || "").toLowerCase();

  const styles = {
    open: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    closed: "border-slate-500/20 bg-slate-500/10 text-slate-400",
    filtered:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        styles[normalizedState] ||
        "border-slate-500/20 bg-slate-500/10 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalizedState === "open"
            ? "bg-emerald-400"
            : normalizedState === "filtered"
              ? "bg-yellow-400"
              : "bg-slate-400"
        }`}
      />

      {normalizedState
        ? normalizedState.toUpperCase()
        : "UNKNOWN"}
    </span>
  );
}

/* =========================================================
   RISK BADGE
========================================================= */

function RiskBadge({ risk }) {
  const styles = {
    Critical:
      "border-red-500/20 bg-red-500/10 text-red-400",

    High:
      "border-red-500/20 bg-red-500/10 text-red-400",

    Medium:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",

    Low:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    Review:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    Informational:
      "border-slate-500/20 bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[risk] ||
        "border-slate-500/20 bg-slate-500/10 text-slate-400"
      }`}
    >
      {risk || "Unknown"}
    </span>
  );
}

/* =========================================================
   PORT DETAILS MODAL
========================================================= */

function PortDetailsModal({ port, onClose }) {
  if (!port) {
    return null;
  }

  const isHighRisk =
    port.risk === "High" ||
    port.risk === "Critical";

  const assessment =
    port.assessment ||
    `Port ${port.port} is currently reported as ${port.state}. Review the detected service and determine whether the exposure is required.`;

  const recommendation =
    port.recommendation ||
    "Review the service configuration, restrict access where appropriate, and disable the service if it is not required.";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40"
        >
          {/* MODAL HEADER */}

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Network size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Port Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Security analysis for {port.protocol || "TCP"} port{" "}
                  {port.port}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          {/* PORT SUMMARY */}

          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              label="Port"
              value={port.port}
              mono
            />

            <DetailItem
              label="Protocol"
              value={port.protocol || "TCP"}
              mono
            />

            <DetailItem
              label="State"
              value={(port.state || "unknown").toUpperCase()}
              status={port.state}
            />

            <DetailItem
              label="Risk"
              value={port.risk || "Unknown"}
              risk={port.risk}
            />
          </div>

          {/* SERVICE INFORMATION */}

          <div className="px-6 pb-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center gap-3">
                <Server
                  size={18}
                  className="text-purple-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Service Information
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-600">
                    Service
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-300">
                    {port.service || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-600">
                    Detected Version
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {port.version || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY ASSESSMENT */}

          <div className="px-6 pb-6">
            <div
              className={`rounded-xl border p-5 ${
                isHighRisk
                  ? "border-red-500/10 bg-red-500/[0.04]"
                  : "border-blue-500/10 bg-blue-500/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3">
                {isHighRisk ? (
                  <ShieldAlert
                    size={19}
                    className="mt-0.5 shrink-0 text-red-400"
                  />
                ) : (
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />
                )}

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Security Assessment
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {assessment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMMENDATION */}

          <div className="px-6 pb-6">
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
              <div className="flex items-start gap-3">
                <Activity
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Recommended Action
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex justify-end border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
  mono = false,
  status,
  risk,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4">
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {status && (
          <span
            className={`h-2 w-2 rounded-full ${
              status === "open"
                ? "bg-emerald-400"
                : status === "filtered"
                  ? "bg-yellow-400"
                  : "bg-slate-400"
            }`}
          />
        )}

        {risk ? (
          <RiskBadge risk={risk} />
        ) : (
          <p
            className={`text-sm font-semibold text-slate-200 ${
              mono ? "font-mono" : ""
            }`}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PORT TABLE
========================================================= */

function PortTable({ ports = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedPort, setSelectedPort] = useState(null);

  /* =======================================================
     FILTER REAL API DATA
  ======================================================= */

  const filteredPorts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return ports.filter((item) => {
      const portNumber = String(item.port ?? "");

      const service = String(
        item.service ?? ""
      ).toLowerCase();

      const version = String(
        item.version ?? ""
      ).toLowerCase();

      const risk = String(
        item.risk ?? ""
      );

      const matchesSearch =
        !searchValue ||
        portNumber.includes(searchValue) ||
        service.includes(searchValue) ||
        version.includes(searchValue);

      const matchesFilter =
        filter === "All" ||
        risk === filter;

      return matchesSearch && matchesFilter;
    });
  }, [ports, search, filter]);

  return (
    <>
      <motion.section
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.5,
        }}
        className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
      >
        {/* HEADER */}

        <div className="border-b border-white/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Network size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Discovered Ports
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Network ports identified during the security scan
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs text-slate-500">
                Ports Found
              </span>

              <span className="ml-2 text-sm font-semibold text-white">
                {filteredPorts.length}
              </span>
            </div>
          </div>

          {/* SEARCH + FILTER */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search port, service or version..."
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-slate-950/50 pl-9 pr-10 text-sm text-slate-300 outline-none transition focus:border-blue-500/50 sm:w-40"
              >
                <option value="All">
                  All Risks
                </option>

                <option value="Critical">
                  Critical
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Review">
                  Review
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Informational">
                  Informational
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/30">
                <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Port
                </th>

                <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Protocol
                </th>

                <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  State
                </th>

                <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Service
                </th>

                <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Version
                </th>

                <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Risk
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPorts.length > 0 ? (
                filteredPorts.map((item, index) => (
                  <motion.tr
                    key={`${item.protocol || "TCP"}-${item.port}-${index}`}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.05,
                    }}
                    className="group border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    {/* PORT */}

                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-white">
                        {item.port}
                      </span>
                    </td>

                    {/* PROTOCOL */}

                    <td className="px-4 py-4">
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 font-mono text-[10px] font-semibold text-blue-400">
                        {item.protocol || "TCP"}
                      </span>
                    </td>

                    {/* STATE */}

                    <td className="px-4 py-4">
                      <StateBadge
                        state={item.state}
                      />
                    </td>

                    {/* SERVICE */}

                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-slate-300">
                        {item.service || "Unknown"}
                      </span>
                    </td>

                    {/* VERSION */}

                    <td className="max-w-[240px] px-4 py-4">
                      <span className="block truncate text-sm text-slate-500">
                        {item.version || "Unknown"}
                      </span>
                    </td>

                    {/* RISK */}

                    <td className="px-4 py-4">
                      <RiskBadge
                        risk={item.risk}
                      />
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPort(item)
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-white/5 px-2.5 py-1.5 text-[11px] text-slate-500 opacity-70 transition-all hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-400 group-hover:opacity-100"
                      >
                        Details
                        <ExternalLink size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center"
                  >
                    <Search
                      size={28}
                      className="mx-auto mb-3 text-slate-700"
                    />

                    <p className="text-sm text-slate-500">
                      No ports found
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {ports.length === 0
                        ? "No Nmap port data is currently available."
                        : "Try another search or risk filter."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-xs text-slate-600">
            Showing{" "}
            <span className="text-slate-400">
              {filteredPorts.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-400">
              {ports.length}
            </span>{" "}
            discovered ports
          </p>
        </div>
      </motion.section>

      {/* DETAILS MODAL */}

      <AnimatePresence>
        {selectedPort && (
          <PortDetailsModal
            port={selectedPort}
            onClose={() =>
              setSelectedPort(null)
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default PortTable;