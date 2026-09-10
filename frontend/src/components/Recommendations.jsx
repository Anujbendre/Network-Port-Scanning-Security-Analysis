import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Info,
  Search,
  ShieldAlert,
  Clock3,
} from "lucide-react";

/* =========================================================
   PRIORITY CONFIG
========================================================= */

const priorityConfig = {
  Critical: {
    label: "Critical",
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  High: {
    label: "High",
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  Medium: {
    label: "Medium",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },

  Low: {
    label: "Low",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  Review: {
    label: "Review",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  Informational: {
    label: "Informational",
    className:
      "border-slate-500/20 bg-slate-500/10 text-slate-400",
  },
};

/* =========================================================
   NORMALIZE PRIORITY
========================================================= */

function normalizePriority(priority) {
  const value = String(priority || "")
    .trim()
    .toLowerCase();

  if (value === "critical") {
    return "Critical";
  }

  if (
    value === "high" ||
    value === "high attention"
  ) {
    return "High";
  }

  if (
    value === "medium" ||
    value === "medium attention"
  ) {
    return "Medium";
  }

  if (value === "low") {
    return "Low";
  }

  if (
    value === "review" ||
    value === "review required"
  ) {
    return "Review";
  }

  return "Informational";
}

/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({ priority }) {
  const normalized = normalizePriority(priority);

  const config =
    priorityConfig[normalized] ||
    priorityConfig.Informational;

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const completed =
    String(status || "").toLowerCase() === "completed" ||
    String(status || "").toLowerCase() === "remediated";

  if (completed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
        <CheckCircle2 size={12} />
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-400">
      <Clock3 size={12} />
      Pending
    </span>
  );
}

/* =========================================================
   RECOMMENDATION CARD
========================================================= */

function RecommendationCard({
  recommendation,
  expanded,
  onToggle,
  completed,
  onComplete,
}) {
  const priority = normalizePriority(
    recommendation?.priority
  );

  const title =
    recommendation?.title ||
    `Review ${recommendation?.service || "Service"}`;

  const port =
    recommendation?.port ?? "N/A";

  const service =
    recommendation?.service || "Unknown";

  const category =
    recommendation?.category || "Network Security";

  const action =
    recommendation?.action ||
    recommendation?.recommendation ||
    "Review this exposed service and apply appropriate security controls.";

  const reason =
    recommendation?.reason ||
    `Port ${port} is currently reported as open.`;

  const status = completed
    ? "Completed"
    : recommendation?.status || "Pending";

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
    >
      {/* Header */}

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.03]"
      >
        <div className="flex min-w-0 items-start gap-4">

          <div className="mt-0.5 rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <ClipboardCheck size={19} />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">
                {title}
              </h3>

              <PriorityBadge priority={priority} />

              <StatusBadge status={status} />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

              <span>
                Port:{" "}
                <span className="text-slate-300">
                  {port}
                </span>
              </span>

              <span>
                Service:{" "}
                <span className="text-slate-300">
                  {service}
                </span>
              </span>

              <span>
                Category:{" "}
                <span className="text-slate-300">
                  {category}
                </span>
              </span>

            </div>

          </div>
        </div>

        <motion.div
          animate={{
            rotate: expanded ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-500"
        >
          <ChevronDown size={18} />
        </motion.div>

      </button>

      {/* Expanded Content */}

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
          >

            <div className="border-t border-white/10 p-5">

              <div className="grid gap-4 md:grid-cols-2">

                {/* Reason */}

                <div className="rounded-xl border border-white/5 bg-slate-950/30 p-4">

                  <div className="flex items-center gap-2">

                    <Info
                      size={16}
                      className="text-blue-400"
                    />

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Why this matters
                    </p>

                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {reason}
                  </p>

                </div>

                {/* Action */}

                <div className="rounded-xl border border-white/5 bg-slate-950/30 p-4">

                  <div className="flex items-center gap-2">

                    <ShieldAlert
                      size={16}
                      className="text-orange-400"
                    />

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recommended action
                    </p>

                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {action}
                  </p>

                </div>

              </div>

              {/* Complete button */}

              <div className="mt-4 flex justify-end">

                {!completed ? (
                  <button
                    type="button"
                    onClick={() =>
                      onComplete(recommendation?.id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 size={15} />
                    Mark Remediated
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={15} />
                    Remediation Completed
                  </span>
                )}

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

   IMPORTANT:
   No useEffect.
   No state synchronization.
   No infinite render loop.

   Receives:
   recommendations={dashboardData.recommendations}
========================================================= */

function Recommendations({
  recommendations = [],
}) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [expandedRecommendation, setExpandedRecommendation] =
    useState(null);

  /*
    Only store IDs of recommendations that the user
    marked as completed.

    This avoids copying API data into local state.
  */

  const [completedIds, setCompletedIds] =
    useState([]);

  /* -------------------------------------------------------
     Safety check
  ------------------------------------------------------- */

  const safeRecommendations =
    Array.isArray(recommendations)
      ? recommendations
      : [];

  /* -------------------------------------------------------
     Filter recommendations
  ------------------------------------------------------- */

  const filteredRecommendations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return safeRecommendations.filter(
      (recommendation) => {
        const priority = normalizePriority(
          recommendation?.priority
        );

        const title =
          recommendation?.title || "";

        const service =
          recommendation?.service || "";

        const category =
          recommendation?.category || "";

        const port = String(
          recommendation?.port || ""
        );

        const matchesSearch =
          !query ||
          title.toLowerCase().includes(query) ||
          service.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query) ||
          port.includes(query);

        const matchesPriority =
          priorityFilter === "All" ||
          priority === priorityFilter;

        return (
          matchesSearch &&
          matchesPriority
        );
      }
    );
  }, [
    safeRecommendations,
    search,
    priorityFilter,
  ]);

  /* -------------------------------------------------------
     Counts
  ------------------------------------------------------- */

  const counts = useMemo(() => {
    return {
      total: safeRecommendations.length,

      critical: safeRecommendations.filter(
        (item) =>
          normalizePriority(item?.priority) ===
          "Critical"
      ).length,

      high: safeRecommendations.filter(
        (item) =>
          normalizePriority(item?.priority) ===
          "High"
      ).length,

      medium: safeRecommendations.filter(
        (item) =>
          normalizePriority(item?.priority) ===
          "Medium"
      ).length,

      completed: safeRecommendations.filter(
        (item) =>
          completedIds.includes(item?.id) ||
          String(item?.status || "").toLowerCase() ===
            "completed"
      ).length,
    };
  }, [
    safeRecommendations,
    completedIds,
  ]);

  /* -------------------------------------------------------
     Mark completed
  ------------------------------------------------------- */

  function handleComplete(id) {
    if (id === undefined || id === null) {
      return;
    }

    setCompletedIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });
  }

  /* -------------------------------------------------------
     Toggle card
  ------------------------------------------------------- */

  function handleToggle(id) {
    setExpandedRecommendation((current) =>
      current === id ? null : id
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.5,
      }}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
    >

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex items-start gap-3">

          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <ClipboardCheck size={20} />
          </div>

          <div>

            <h2 className="font-semibold text-white">
              Security Recommendations
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recommended actions based on the current security analysis
            </p>

          </div>

        </div>

        {/* Summary */}

        <div className="flex flex-wrap gap-2">

          <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">
              Total
            </span>

            <p className="mt-0.5 text-sm font-bold text-white">
              {counts.total}
            </p>
          </div>

          <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">
              Critical
            </span>

            <p className="mt-0.5 text-sm font-bold text-red-400">
              {counts.critical}
            </p>
          </div>

          <div className="rounded-xl border border-orange-500/10 bg-orange-500/[0.03] px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">
              High
            </span>

            <p className="mt-0.5 text-sm font-bold text-orange-400">
              {counts.high}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">
              Medium
            </span>

            <p className="mt-0.5 text-sm font-bold text-yellow-400">
              {counts.medium}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600">
              Completed
            </span>

            <p className="mt-0.5 text-sm font-bold text-emerald-400">
              {counts.completed}
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================== */}

      <div className="mt-6 flex flex-col gap-3 md:flex-row">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search recommendations..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/40"
          />

        </div>

        {/* Priority */}

        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/40"
        >
          <option value="All">
            All Priorities
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

          <option value="Low">
            Low
          </option>

          <option value="Review">
            Review
          </option>

          <option value="Informational">
            Informational
          </option>
        </select>

      </div>

      {/* =================================================
          RECOMMENDATION LIST
      ================================================== */}

      <div className="mt-5 space-y-3">

        {filteredRecommendations.length > 0 ? (

          filteredRecommendations.map(
            (recommendation, index) => {
              const id =
                recommendation?.id ?? index;

              const completed =
                completedIds.includes(id) ||
                String(
                  recommendation?.status || ""
                ).toLowerCase() === "completed";

              return (
                <RecommendationCard
                  key={id}
                  recommendation={recommendation}
                  expanded={
                    expandedRecommendation === id
                  }
                  onToggle={() =>
                    handleToggle(id)
                  }
                  completed={completed}
                  onComplete={handleComplete}
                />
              );
            }
          )

        ) : (

          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-6 py-12 text-center">

            <ClipboardCheck
              size={34}
              className="mx-auto text-slate-700"
            />

            <p className="mt-3 text-sm font-medium text-white">
              No recommendations found
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Recommendations generated from the current scan will appear here.
            </p>

          </div>

        )}

      </div>

      {/* =================================================
          DISCLAIMER
      ================================================== */}

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">

        <Info
          size={16}
          className="mt-0.5 shrink-0 text-blue-400"
        />

        <p className="text-xs leading-relaxed text-slate-500">
          Recommendations are generated from the detected
          network services and risk indicators. They are
          intended to support security review and do not,
          by themselves, confirm the presence of a
          vulnerability.
        </p>

      </div>

    </motion.section>
  );
}

export default Recommendations;