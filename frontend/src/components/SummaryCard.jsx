import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return count;
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-400",
  type = "number",
  trend,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -7,
        scale: 1.02,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition-shadow duration-300 hover:border-blue-500/20 hover:shadow-blue-500/10"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

      {/* Top line */}
      <div className="relative mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <motion.div
          whileHover={{ rotate: 8, scale: 1.12 }}
          className={`rounded-xl bg-white/5 p-3 ${iconColor}`}
        >
          <Icon size={21} />
        </motion.div>
      </div>

      {/* Value */}
      <div className="relative">
        <h3 className="text-3xl font-bold tracking-tight text-white">
          {type === "number" ? (
            <AnimatedNumber value={value} />
          ) : (
            value
          )}
        </h3>

        {/* Trend */}
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
              {trend}
            </span>
          </div>
        )}

        <p className="mt-2 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      {/* Bottom animated line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.8,
          delay: delay + 0.2,
        }}
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
      />
    </motion.div>
  );
}

export default SummaryCard;