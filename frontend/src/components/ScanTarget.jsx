import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Target,
  Radio,
  Network,
  Server,
  ShieldAlert,
} from "lucide-react";

const scanStages = [
  {
    name: "Network Discovery",
    description: "Checking target availability",
    icon: Radio,
  },
  {
    name: "Port Scanning",
    description: "Scanning TCP ports",
    icon: Network,
  },
  {
    name: "Service Detection",
    description: "Identifying network services",
    icon: Server,
  },
  {
    name: "Security Analysis",
    description: "Analyzing potential security risks",
    icon: ShieldAlert,
  },
];

function ScanTarget() {
  const [target, setTarget] = useState("10.59.47.15");
  const [status, setStatus] = useState("idle");
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status !== "scanning") {
      return;
    }

    setProgress(0);
    setCurrentStage(0);

    const progressTimer = setInterval(() => {
      setProgress((previous) => {
        if (previous >= 100) {
          clearInterval(progressTimer);
          return 100;
        }

        return previous + 1;
      });
    }, 50);

    const stageTimer = setInterval(() => {
      setCurrentStage((previous) => {
        if (previous >= scanStages.length - 1) {
          clearInterval(stageTimer);
          return previous;
        }

        return previous + 1;
      });
    }, 750);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setCurrentStage(scanStages.length - 1);
      setStatus("success");
    }, 5000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stageTimer);
      clearTimeout(completeTimer);
    };
  }, [status]);

  const handleScan = () => {
    if (!target.trim()) {
      setStatus("error");
      return;
    }

    setStatus("scanning");
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setCurrentStage(0);
  };

  const getStatusText = () => {
    if (status === "scanning") {
      return "Scanning";
    }

    if (status === "success") {
      return "Completed";
    }

    if (status === "error") {
      return "Error";
    }

    return "Ready";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.5,
      }}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      {/* Background Glow */}
      <motion.div
        animate={
          status === "scanning"
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.08, 0.18, 0.08],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: status === "scanning" ? Infinity : 0,
        }}
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="relative w-full">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <motion.div
              animate={
                status === "scanning"
                  ? {
                      rotate: [0, 360],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: status === "scanning" ? Infinity : 0,
                ease: "linear",
              }}
              className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-400"
            >
              <Target size={22} />
            </motion.div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Scan Target
              </h2>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                Configure an authorized security scan
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "scanning"
                  ? "animate-pulse bg-yellow-400"
                  : status === "success"
                  ? "bg-emerald-400"
                  : status === "error"
                  ? "bg-red-400"
                  : "bg-slate-500"
              }`}
            />

            <span className="text-xs text-slate-400">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* =================================================
            INPUT + BUTTON
        ================================================== */}

        <div className="flex w-full flex-col gap-3 md:flex-row">
          {/* Target Input */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setStatus("idle");
              }}
              placeholder="Enter target IP address"
              disabled={status === "scanning"}
              className="h-14 w-full rounded-xl border border-white/10 bg-slate-950/70 pl-12 pr-4 font-mono text-base text-white outline-none transition-all placeholder:font-sans placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Scan Button */}

          <motion.button
            type="button"
            onClick={handleScan}
            disabled={status === "scanning"}
            whileHover={
              status !== "scanning"
                ? {
                    scale: 1.02,
                  }
                : {}
            }
            whileTap={
              status !== "scanning"
                ? {
                    scale: 0.97,
                  }
                : {}
            }
            className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none md:min-w-[235px]"
          >
            {status === "scanning" ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                SCANNING...
              </>
            ) : (
              <>
                <ShieldCheck size={19} />

                START SECURITY SCAN
              </>
            )}
          </motion.button>
        </div>

        {/* =================================================
            SCANNING PANEL
        ================================================== */}

        <AnimatePresence>
          {status === "scanning" && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-2xl border border-blue-500/10 bg-slate-950/40 p-5">
                {/* Progress Header */}

                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Security Scan Running
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Target:{" "}
                      <span className="font-mono text-blue-400">
                        {target}
                      </span>
                    </p>
                  </div>

                  <span className="font-mono text-sm font-semibold text-blue-400">
                    {progress}%
                  </span>
                </div>

                {/* Progress Bar */}

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-blue-500"
                    initial={{
                      width: "0%",
                    }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                  />
                </div>

                {/* Current Stage */}

                <div className="mt-5">
                  {scanStages.map((stage, index) => {
                    const Icon = stage.icon;

                    const isCompleted =
                      index < currentStage;

                    const isActive =
                      index === currentStage;

                    return (
                      <motion.div
                        key={stage.name}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                        className="flex items-center gap-3 py-2"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-400"
                              : isActive
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-white/5 text-slate-600"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={18} />
                          ) : isActive ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Icon size={18} />
                          )}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              isActive
                                ? "font-medium text-white"
                                : isCompleted
                                ? "text-slate-300"
                                : "text-slate-600"
                            }`}
                          >
                            {stage.name}
                          </p>

                          <p className="text-xs text-slate-600">
                            {stage.description}
                          </p>
                        </div>

                        {isCompleted && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                            Done
                          </span>
                        )}

                        {isActive && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                            Running
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            STATUS MESSAGE
        ================================================== */}

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.25,
            }}
            className="mt-4"
          >
            {status === "success" && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={17} />
                  Scan completed successfully
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 transition hover:text-white"
                >
                  Run Another Scan
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <XCircle size={17} />
                Please enter a valid target IP
              </div>
            )}

            {status === "scanning" && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Security analysis in progress...
              </div>
            )}

            {status === "idle" && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck size={17} />
                Enter an authorized target to begin
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            SECURITY NOTICE
        ================================================== */}

        <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-blue-400">
              Authorized scanning only.
            </span>{" "}
            Scan systems you own or have explicit permission to assess.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default ScanTarget;