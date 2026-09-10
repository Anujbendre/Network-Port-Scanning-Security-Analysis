import {
  Monitor,
  Network,
  Server,
  ShieldAlert,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardData } from "../api";
import { motion } from "framer-motion";

import SummaryCard from "./SummaryCard";
import ScanTarget from "./ScanTarget";
import SecurityAnalytics from "./SecurityAnalytics";
import PortTable from "./PortTable";
import SecurityFindings from "./SecurityFindings";
import Recommendations from "./Recommendations";
import Reports from "./Reports";


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);


  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();

      console.log("Dashboard API data:", data);

      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard API error:", err);

      setError(
        "Unable to connect to security backend."
      );
    } finally {
      setLoading(false);
    }
  }


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-slate-950"
      >
        <div className="text-center">

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent"
          />

          <p className="text-sm font-medium text-slate-300">
            Loading security intelligence...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Connecting to FastAPI backend
          </p>

        </div>
      </motion.main>
    );
  }


  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error || !dashboardData) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-slate-950 p-6"
      >
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldAlert size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            Backend Connection Failed
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {error ||
              "No dashboard data was returned by the security backend."}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Retry Connection
          </button>

        </div>
      </motion.main>
    );
  }


  /* =======================================================
     SAFE API DATA
  ======================================================= */

  const target =
    dashboardData.target || "Unknown";

  const targetStatus =
    dashboardData.target_status || "UNKNOWN";

  const scanType =
    dashboardData.scan_type ||
    "TCP + Service Detection";

  const scanStatus =
    dashboardData.scan_status || "Unknown";

  const ports = Array.isArray(
    dashboardData.ports
  )
    ? dashboardData.ports
    : [];

  const findings = Array.isArray(
    dashboardData.findings
  )
    ? dashboardData.findings
    : [];

  const recommendations = Array.isArray(
    dashboardData.recommendations
  )
    ? dashboardData.recommendations
    : [];

  const riskSummary =
    dashboardData.risk_summary || {};


  /* =======================================================
     SUMMARY
  ======================================================= */

  const openPorts =
    Number(
      dashboardData.open_ports
    ) || ports.filter(
      (port) =>
        String(
          port?.state || ""
        ).toLowerCase() === "open"
    ).length;

  const servicesDetected =
    Number(
      dashboardData.services_detected
    ) || new Set(
      ports
        .map(
          (port) =>
            port?.service
        )
        .filter(Boolean)
    ).size;

  const securityFindings =
    Number(
      dashboardData.security_findings
    ) || findings.length;


  /* =======================================================
     UI
  ======================================================= */

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 md:p-8"
    >

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-500">
            Security Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Network Security Analysis
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor network exposure and analyze security risks.
          </p>

        </div>


        {/* System Status */}

        <div className="flex items-center gap-2 text-sm text-emerald-400">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          System Operational

        </div>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Target Status"
          value={targetStatus}
          subtitle={`${target} is reachable`}
          icon={Monitor}
          iconColor="text-emerald-400"
          type="text"
          delay={0.1}
        />


        <SummaryCard
          title="Open Ports"
          value={openPorts}
          subtitle="Detected during scan"
          icon={Network}
          iconColor="text-blue-400"
          trend="TCP"
          delay={0.2}
        />


        <SummaryCard
          title="Services Detected"
          value={servicesDetected}
          subtitle="Identified services"
          icon={Server}
          iconColor="text-purple-400"
          trend="DISCOVERED"
          delay={0.3}
        />


        <SummaryCard
          title="Security Findings"
          value={securityFindings}
          subtitle="Requires security review"
          icon={ShieldAlert}
          iconColor="text-orange-400"
          trend="REVIEW"
          delay={0.4}
        />

      </div>


      {/* =================================================
          SECURITY OVERVIEW
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
          delay: 0.2,
        }}
        className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
      >

        {/* Section Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Activity size={20} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Security Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current target information
              </p>

            </div>

          </div>


          <button
            type="button"
            className="flex w-fit items-center gap-1 text-xs text-blue-400 transition hover:text-blue-300"
          >
            Details
            <ArrowUpRight size={14} />
          </button>

        </div>


        {/* Information Grid */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <InfoItem
            label="Target IP"
            value={target}
            mono
          />

          <InfoItem
            label="Operating System"
            value="Windows"
          />

          <InfoItem
            label="Scan Type"
            value={scanType}
          />

          <InfoItem
            label="Scan Status"
            value={scanStatus}
            status
          />

        </div>

      </motion.section>


      {/* =================================================
          SCAN TARGET
      ================================================== */}

      <div className="mt-6 w-full">
        <ScanTarget />
      </div>


      {/* =================================================
          SECURITY ANALYTICS

          REAL API DATA
      ================================================== */}

      <SecurityAnalytics
        riskSummary={riskSummary}
        findings={findings}
        ports={ports}
      />


      {/* =================================================
          DISCOVERED PORTS

          REAL NMAP DATA
      ================================================== */}

      <PortTable
        ports={ports}
      />


      {/* =================================================
          SECURITY FINDINGS

          REAL BACKEND DATA
      ================================================== */}

      <SecurityFindings
        findings={findings}
      />


      {/* =================================================
          SECURITY RECOMMENDATIONS

          REAL BACKEND DATA
      ================================================== */}

      <Recommendations
        recommendations={recommendations}
      />


      {/* =================================================
          REPORTS
      ================================================== */}

      <Reports />

    </motion.main>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
  mono = false,
  status = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-colors hover:border-white/10"
    >

      <p className="text-xs text-slate-500">
        {label}
      </p>


      <div className="mt-2 flex items-center gap-2">

        {status && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        )}


        <p
          className={`text-sm font-medium text-slate-200 ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>

      </div>

    </motion.div>
  );
}


export default Dashboard;