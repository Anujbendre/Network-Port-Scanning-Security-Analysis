import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";

import {
  ShieldCheck,
  AlertTriangle,
  CircleAlert,
  Info,
} from "lucide-react";

/* =========================================================
   RISK COLORS
========================================================= */

const riskColors = {
  High: "#ef4444",
  Critical: "#dc2626",
  Medium: "#f97316",
  Low: "#22c55e",
  Review: "#eab308",
  Informational: "#3b82f6",
};

/* =========================================================
   NORMALIZE RISK
========================================================= */

function normalizeRisk(risk) {
  const value = String(risk || "").trim().toLowerCase();

  if (value === "critical") return "Critical";
  if (value === "high" || value === "high attention") return "High";
  if (value === "medium" || value === "medium attention") {
    return "Medium";
  }
  if (value === "low") return "Low";
  if (
    value === "review" ||
    value === "review required" ||
    value === "review_required"
  ) {
    return "Review";
  }

  return "Informational";
}

/* =========================================================
   CALCULATE PORT EXPOSURE SCORE

   This is an analytical indicator only.
   It does NOT prove a vulnerability.
========================================================= */

function calculateExposureScore(port) {
  const portNumber = Number(port?.port);
  const state = String(port?.state || "").toLowerCase();
  const risk = normalizeRisk(port?.risk);

  if (state !== "open") {
    return 0;
  }

  const riskScores = {
    Critical: 100,
    High: 90,
    Medium: 65,
    Review: 45,
    Low: 25,
    Informational: 10,
  };

  if (riskScores[risk] !== undefined) {
    return riskScores[risk];
  }

  const commonPortScores = {
    21: 85,
    22: 45,
    23: 95,
    25: 50,
    53: 35,
    80: 35,
    110: 55,
    135: 60,
    139: 75,
    143: 50,
    443: 30,
    445: 90,
    3389: 80,
    5900: 85,
    8080: 45,
    8443: 40,
  };

  return commonPortScores[portNumber] ?? 30;
}

/* =========================================================
   BUILD RISK DISTRIBUTION

   Uses actual findings from FastAPI.
========================================================= */

function buildRiskData(findings = [], ports = []) {
  const counts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Review: 0,
    Informational: 0,
  };

  if (Array.isArray(findings) && findings.length > 0) {
    findings.forEach((finding) => {
      const severity = normalizeRisk(
        finding?.severity || finding?.risk
      );

      counts[severity] += 1;
    });
  } else if (Array.isArray(ports)) {
    ports.forEach((port) => {
      if (String(port?.state || "").toLowerCase() !== "open") {
        return;
      }

      const risk = normalizeRisk(port?.risk);
      counts[risk] += 1;
    });
  }

  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));
}

/* =========================================================
   BUILD PORT EXPOSURE DATA

   Uses real ports from FastAPI.
========================================================= */

function buildPortData(ports = []) {
  if (!Array.isArray(ports)) {
    return [];
  }

  return ports
    .filter(
      (port) =>
        String(port?.protocol || "").toUpperCase() === "TCP" &&
        String(port?.state || "").toLowerCase() === "open"
    )
    .map((port) => ({
      port: String(port?.port ?? "Unknown"),
      risk: calculateExposureScore(port),
      service: port?.service || "Unknown",
      state: port?.state || "unknown",
    }));
}

/* =========================================================
   CUSTOM RISK TOOLTIP
========================================================= */

function RiskTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="text-xs text-slate-500">
        Risk Level
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {item.name}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {item.value} finding
        {item.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

/* =========================================================
   CUSTOM PORT TOOLTIP
========================================================= */

function PortTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];
  const data = item.payload;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="text-xs text-slate-500">
        TCP Port
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        Port {data.port}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Service: {data.service}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Exposure score: {item.value}/100
      </p>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT

   Receives real FastAPI data:

   <SecurityAnalytics
      riskSummary={dashboardData.risk_summary}
      findings={dashboardData.findings}
      ports={dashboardData.ports}
   />
========================================================= */

function SecurityAnalytics({
  riskSummary = {},
  findings = [],
  ports = [],
}) {
  const safeFindings = Array.isArray(findings)
    ? findings
    : [];

  const safePorts = Array.isArray(ports)
    ? ports
    : [];

  /* -------------------------------------------------------
     Risk distribution
  ------------------------------------------------------- */

  let riskData = buildRiskData(
    safeFindings,
    safePorts
  );

  /*
    If backend provides risk_summary but there are no
    findings yet, use that data.
  */

  if (
    safeFindings.length === 0 &&
    Object.keys(riskSummary || {}).length > 0
  ) {
    const summaryMap = {
      Critical:
        Number(riskSummary?.critical || 0),

      High:
        Number(riskSummary?.high || 0),

      Medium:
        Number(riskSummary?.medium || 0),

      Low:
        Number(riskSummary?.low || 0),

      Review:
        Number(riskSummary?.review || 0),

      Informational:
        Number(riskSummary?.informational || 0),
    };

    riskData = Object.entries(summaryMap)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));
  }

  /* -------------------------------------------------------
     Port exposure
  ------------------------------------------------------- */

  const portData = buildPortData(safePorts);

  /* -------------------------------------------------------
     Total findings
  ------------------------------------------------------- */

  const totalFindings = riskData.reduce(
    (total, item) => total + Number(item.value || 0),
    0
  );

  /* -------------------------------------------------------
     Calculate overall risk score

     Analytical score only.
  ------------------------------------------------------- */

  const openPorts = safePorts.filter(
    (port) =>
      String(port?.state || "").toLowerCase() === "open"
  );

  const highCount = safeFindings.filter((finding) => {
    const severity = normalizeRisk(
      finding?.severity || finding?.risk
    );

    return (
      severity === "Critical" ||
      severity === "High"
    );
  }).length;

  const mediumCount = safeFindings.filter((finding) => {
    return (
      normalizeRisk(
        finding?.severity || finding?.risk
      ) === "Medium"
    );
  }).length;

  let riskScore = 0;

  riskScore += highCount * 15;
  riskScore += mediumCount * 8;
  riskScore += openPorts.length * 3;

  riskScore = Math.min(100, riskScore);

  /* -------------------------------------------------------
     Security posture
  ------------------------------------------------------- */

  let posture = "GOOD";
  let postureClass = "text-emerald-400";

  if (riskScore >= 70) {
    posture = "HIGH RISK";
    postureClass = "text-red-400";
  } else if (riskScore >= 40) {
    posture = "REVIEW REQUIRED";
    postureClass = "text-orange-400";
  } else if (riskScore >= 20) {
    posture = "MODERATE";
    postureClass = "text-yellow-400";
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">

      {/* =================================================
          RISK DISTRIBUTION
      ================================================== */}

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
          delay: 0.2,
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Risk Distribution
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Security findings by severity
              </p>
            </div>

          </div>

          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-500">
            Current Scan
          </span>

        </div>

        {/* Chart */}

        <div className="mt-6 h-[280px]">

          {riskData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={4}
                  stroke="none"
                >

                  {riskData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        riskColors[entry.name] ||
                        "#64748b"
                      }
                    />
                  ))}

                </Pie>

                <Tooltip
                  content={<RiskTooltip />}
                />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center">

              <div className="text-center">

                <ShieldCheck
                  size={42}
                  className="mx-auto text-emerald-400"
                />

                <p className="mt-3 text-sm font-medium text-white">
                  No findings detected
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Security findings will appear here after analysis.
                </p>

              </div>

            </div>

          )}

          {/* Center Text */}

          {riskData.length > 0 && (
            <div className="pointer-events-none relative -mt-[185px] flex flex-col items-center justify-center">

              <span className="text-3xl font-bold text-white">
                {totalFindings}
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Findings
              </span>

            </div>
          )}

        </div>

        {/* Legend */}

        <div className="grid grid-cols-2 gap-3">

          {riskData.map((item) => (

            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/30 px-3 py-2.5"
            >

              <div className="flex items-center gap-2">

                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      riskColors[item.name] ||
                      "#64748b",
                  }}
                />

                <span className="text-xs text-slate-400">
                  {item.name}
                </span>

              </div>

              <span className="text-xs font-semibold text-white">
                {item.value}
              </span>

            </div>

          ))}

        </div>

      </motion.section>


      {/* =================================================
          PORT EXPOSURE
      ================================================== */}

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
          delay: 0.3,
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
              <CircleAlert size={20} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Port Exposure
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Relative exposure score by TCP port
              </p>

            </div>

          </div>

          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-500">
            TCP
          </span>

        </div>


        {/* Bar Chart */}

        <div className="mt-8 h-[280px]">

          {portData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={portData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="port"
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(255,255,255,0.03)",
                  }}
                  content={<PortTooltip />}
                />

                <Bar
                  dataKey="risk"
                  radius={[6, 6, 0, 0]}
                  fill="#3b82f6"
                  animationDuration={1200}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center">

              <div className="text-center">

                <CircleAlert
                  size={42}
                  className="mx-auto text-slate-600"
                />

                <p className="mt-3 text-sm font-medium text-white">
                  No open TCP ports
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Port exposure will appear after the scan.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* Information */}

        <div className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">

          <Info
            size={17}
            className="mt-0.5 shrink-0 text-blue-400"
          />

          <p className="text-xs leading-relaxed text-slate-500">
            Exposure scores are analytical indicators used
            to prioritize review. An open port alone does not
            prove that a vulnerability exists.
          </p>

        </div>

      </motion.section>


      {/* =================================================
          SECURITY POSTURE
      ================================================== */}

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
          delay: 0.4,
        }}
        className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
      >

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <ShieldCheck size={22} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Security Posture
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Overall assessment from the current scan
              </p>

            </div>

          </div>


          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="text-xs text-slate-500">
                Assessment
              </p>

              <p
                className={`mt-1 text-lg font-bold ${postureClass}`}
              >
                {posture}
              </p>

            </div>

            <div className="h-12 w-px bg-white/10" />

            <div>

              <p className="text-xs text-slate-500">
                Risk Score
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {riskScore}/100
              </p>

            </div>

          </div>

        </div>

      </motion.section>

    </div>
  );
}

export default SecurityAnalytics;