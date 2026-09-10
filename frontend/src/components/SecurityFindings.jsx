import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Network,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   SEVERITY CONFIGURATION
========================================================= */

const severityConfig = {
  Critical: {
    icon: ShieldAlert,
    badge:
      "border-red-500/20 bg-red-500/10 text-red-400",
    iconBox:
      "bg-red-500/10 text-red-400",
    label: "CRITICAL",
  },

  High: {
    icon: ShieldAlert,
    badge:
      "border-red-500/20 bg-red-500/10 text-red-400",
    iconBox:
      "bg-red-500/10 text-red-400",
    label: "HIGH PRIORITY",
  },

  Medium: {
    icon: AlertTriangle,
    badge:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
    iconBox:
      "bg-orange-500/10 text-orange-400",
    label: "MEDIUM PRIORITY",
  },

  Low: {
    icon: Info,
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    iconBox:
      "bg-emerald-500/10 text-emerald-400",
    label: "LOW PRIORITY",
  },

  Review: {
    icon: Info,
    badge:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
    iconBox:
      "bg-blue-500/10 text-blue-400",
    label: "REVIEW",
  },

  Informational: {
    icon: Info,
    badge:
      "border-slate-500/20 bg-slate-500/10 text-slate-400",
    iconBox:
      "bg-slate-500/10 text-slate-400",
    label: "INFORMATIONAL",
  },
};

/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({ severity }) {
  const config =
    severityConfig[severity] ||
    severityConfig.Informational;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${config.badge}`}
    >
      {config.label}
    </span>
  );
}

/* =========================================================
   FINDING CARD
========================================================= */

function FindingCard({
  finding,
  expanded,
  onToggle,
}) {
  const config =
    severityConfig[finding.severity] ||
    severityConfig.Informational;

  const Icon = config.icon;

  const port = finding.port ?? "N/A";
  const protocol = finding.protocol || "TCP";
  const service = finding.service || "Unknown";

  const description =
    finding.description ||
    "A security observation was identified during the network scan.";

  const impact =
    finding.impact ||
    "Review the exposed service and determine whether the observed exposure is required.";

  const recommendation =
    finding.recommendation ||
    "Review the service configuration and restrict access where appropriate.";

  const status =
    finding.status || "Open";

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30 transition-colors hover:border-white/15"
    >
      {/* =================================================
          FINDING HEADER
      ================================================== */}

      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center gap-4 p-5 text-left"
      >
        {/* ICON */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBox}`}
        >
          <Icon size={21} />
        </div>

        {/* MAIN INFO */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {finding.title || "Security Finding"}
            </h3>

            <SeverityBadge
              severity={finding.severity}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Network size={13} />

              Port {port}/{protocol}
            </span>

            <span className="font-mono text-slate-600">
              {service}
            </span>
          </div>
        </div>

        {/* STATUS */}

        <div className="hidden items-center gap-2 sm:flex">
          <CheckCircle2
            size={15}
            className="text-emerald-400"
          />

          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
            {status}
          </span>
        </div>

        {/* EXPAND */}

        <div className="shrink-0 rounded-lg p-2 text-slate-600 transition group-hover:text-white">
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </button>

      {/* =================================================
          EXPANDED CONTENT
      ================================================== */}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-5 pt-4">
              <div className="grid gap-4 lg:grid-cols-3">

                {/* DESCRIPTION */}

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Finding
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </div>

                {/* IMPACT */}

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Potential Impact
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {impact}
                  </p>
                </div>

                {/* RECOMMENDATION */}

                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/70">
                    Recommendation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {recommendation}
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function SecurityFindings({ findings = [] }) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState("All");

  const [expandedFinding, setExpandedFinding] =
    useState(null);

  /* =======================================================
     SAFE FINDINGS ARRAY
  ======================================================= */

  const safeFindings = Array.isArray(findings)
    ? findings
    : [];

  /* =======================================================
     FILTER REAL API DATA
  ======================================================= */

  const filteredFindings = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return safeFindings.filter((finding) => {
      const title = String(
        finding.title ?? ""
      ).toLowerCase();

      const service = String(
        finding.service ?? ""
      ).toLowerCase();

      const port = String(
        finding.port ?? ""
      );

      const description = String(
        finding.description ?? ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        service.includes(searchValue) ||
        port.includes(searchValue) ||
        description.includes(searchValue);

      const matchesSeverity =
        severityFilter === "All" ||
        finding.severity === severityFilter;

      return (
        matchesSearch &&
        matchesSeverity
      );
    });
  }, [
    safeFindings,
    search,
    severityFilter,
  ]);

  /* =======================================================
     REAL COUNTS
  ======================================================= */

  const highCount = safeFindings.filter(
    (item) =>
      item.severity === "High" ||
      item.severity === "Critical"
  ).length;

  const mediumCount = safeFindings.filter(
    (item) => item.severity === "Medium"
  ).length;

  const reviewCount = safeFindings.filter(
    (item) => item.severity === "Review"
  ).length;

  return (
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
        delay: 0.6,
      }}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
            <ShieldAlert size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Security Findings
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Security observations requiring review
            </p>
          </div>
        </div>

        {/* FINDING SUMMARY */}

        <div className="flex flex-wrap items-center gap-2">

          <span className="rounded-lg border border-red-500/10 bg-red-500/[0.04] px-3 py-2 text-xs text-red-400">
            High{" "}
            <span className="ml-1 font-semibold">
              {highCount}
            </span>
          </span>

          <span className="rounded-lg border border-orange-500/10 bg-orange-500/[0.04] px-3 py-2 text-xs text-orange-400">
            Medium{" "}
            <span className="ml-1 font-semibold">
              {mediumCount}
            </span>
          </span>

          <span className="rounded-lg border border-blue-500/10 bg-blue-500/[0.04] px-3 py-2 text-xs text-blue-400">
            Review{" "}
            <span className="ml-1 font-semibold">
              {reviewCount}
            </span>
          </span>

        </div>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        {/* SEARCH */}

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
            placeholder="Search findings, services or ports..."
            className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-600"
          />
        </div>

        {/* FILTER */}

        <div className="relative">
          <Filter
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
            className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-slate-950/50 pl-9 pr-10 text-sm text-slate-300 outline-none transition focus:border-blue-500/50 sm:w-44"
          >
            <option value="All">
              All Findings
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

      {/* =================================================
          FINDINGS LIST
      ================================================== */}

      <div className="mt-5 space-y-3">

        {filteredFindings.length > 0 ? (
          filteredFindings.map(
            (finding, index) => (
              <FindingCard
                key={
                  finding.id ??
                  `${finding.port}-${finding.service}-${index}`
                }
                finding={finding}
                expanded={
                  expandedFinding ===
                  finding.id
                }
                onToggle={() =>
                  setExpandedFinding(
                    expandedFinding ===
                      finding.id
                      ? null
                      : finding.id
                  )
                }
              />
            )
          )
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 px-6 py-14 text-center">

            <Search
              size={28}
              className="mx-auto mb-3 text-slate-700"
            />

            <p className="text-sm text-slate-500">
              {safeFindings.length === 0
                ? "No security findings available"
                : "No findings found"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {safeFindings.length === 0
                ? "Run an Nmap security scan to generate findings."
                : "Try another search or severity filter."}
            </p>

          </div>
        )}
      </div>

      {/* =================================================
          FOOTER
      ================================================== */}

      <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-xs text-slate-600">
          Showing{" "}
          <span className="text-slate-400">
            {filteredFindings.length}
          </span>{" "}
          of{" "}
          <span className="text-slate-400">
            {safeFindings.length}
          </span>{" "}
          findings
        </p>

        <p className="text-[10px] text-slate-600">
          Severity indicates review priority, not confirmed
          vulnerability.
        </p>

      </div>
    </motion.section>
  );
}

export default SecurityFindings;