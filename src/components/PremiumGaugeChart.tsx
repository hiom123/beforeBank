import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumGaugeChartProps {
  value: number;
  maxValue?: number;
  title: string;
  status: "safe" | "warning" | "danger";
  subtitle?: string;
}

export function PremiumGaugeChart({ 
  value, 
  maxValue = 60, 
  title, 
  status,
  subtitle 
}: PremiumGaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((value / maxValue) * 100, 100);
  const angle = (percentage / 100) * 180;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getGradient = () => {
    switch (status) {
      case "danger":
        return "url(#gradientDanger)";
      case "warning":
        return "url(#gradientWarning)";
      default:
        return "url(#gradientSafe)";
    }
  };

  const getGlowClass = () => {
    switch (status) {
      case "danger":
        return "glow-red pulse-danger";
      case "warning":
        return "glow-purple";
      default:
        return "glow-green";
    }
  };

  const getTextClass = () => {
    switch (status) {
      case "danger":
        return "gradient-text-danger";
      case "warning":
        return "text-warning";
      default:
        return "gradient-text-success";
    }
  };

  // SVG arc path calculation
  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(100, 100, radius, endAngle);
    const end = polarToCartesian(100, 100, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  return (
    <motion.div 
      className={`relative flex flex-col items-center p-4 rounded-2xl glass ${getGlowClass()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative w-48 h-28">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <defs>
            <linearGradient id="gradientSafe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(150 80% 50%)" />
              <stop offset="100%" stopColor="hsl(190 95% 55%)" />
            </linearGradient>
            <linearGradient id="gradientWarning" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 92% 55%)" />
              <stop offset="100%" stopColor="hsl(25 95% 55%)" />
            </linearGradient>
            <linearGradient id="gradientDanger" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(25 95% 55%)" />
              <stop offset="100%" stopColor="hsl(0 80% 55%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background track */}
          <path
            d={createArc(0, 180, 70)}
            fill="none"
            stroke="hsl(var(--gauge-track))"
            strokeWidth="14"
            strokeLinecap="round"
          />
          
          {/* Animated progress arc */}
          <motion.path
            d={createArc(0, 180, 70)}
            fill="none"
            stroke={getGradient()}
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ 
              strokeDasharray: "1",
              strokeDashoffset: "0",
            }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = (tick / 100) * 180;
            const innerPoint = polarToCartesian(100, 100, 55, tickAngle);
            const outerPoint = polarToCartesian(100, 100, 62, tickAngle);
            return (
              <line
                key={tick}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.5"
              />
            );
          })}

          {/* Labels */}
          <text x="30" y="110" fill="hsl(var(--muted-foreground))" fontSize="10" opacity="0.7">0%</text>
          <text x="160" y="110" fill="hsl(var(--muted-foreground))" fontSize="10" opacity="0.7">{maxValue}%</text>
        </svg>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <AnimatePresence mode="wait">
            <motion.span 
              key={animatedValue}
              className={`text-3xl font-bold ${getTextClass()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {animatedValue.toFixed(1)}%
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-base font-semibold text-foreground">{title}</span>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
