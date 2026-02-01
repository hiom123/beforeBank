import { motion, AnimatePresence } from "framer-motion";
import { PremiumGaugeChart } from "./PremiumGaugeChart";
import { ContributionChart } from "./ContributionChart";
import { Badge } from "@/components/ui/badge";
import { CalculationResult } from "@/types/loan.ts";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ResultDashboardProps {
  result: CalculationResult;
  borrowerName: string;
}

export function ResultDashboard({ result, borrowerName }: ResultDashboardProps) {
  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}억원`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`;
    }
    return `${value.toLocaleString("ko-KR")}원`;
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case "danger":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getStatusBadgeClass = () => {
    switch (result.status) {
      case "danger":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 glow-red";
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 glow-purple";
      default:
        return "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 glow-green";
    }
  };

  const summaryItems = [
    { label: "총 연간 상환액", value: result.totalAnnualRepayment, highlight: true },
    { label: "신규 대출 상환", value: result.newLoanAnnualRepayment },
    { label: "기존 대출 상환", value: result.existingLoansAnnualRepayment },
    { label: "연간 원금 상환액", value: result.totalAnnualPrincipal },
    { label: "연간 이자 상환액", value: result.totalAnnualInterest },
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.h3 
          className="text-lg font-semibold text-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="gradient-text">{borrowerName || "차주"}</span> DSR 분석 결과
        </motion.h3>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={result.status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Badge className={`${getStatusBadgeClass()} gap-1.5 px-4 py-1.5 text-sm font-medium`}>
              {getStatusIcon()}
              {result.message}
            </Badge>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 gap-4">
        <PremiumGaugeChart
          value={result.dsr}
          maxValue={60}
          title="DSR"
          status={result.status}
          subtitle="총부채원리금상환비율"
        />
        <PremiumGaugeChart
          value={result.dti}
          maxValue={60}
          title="DTI"
          status={result.dti > 40 ? "danger" : result.dti > 35 ? "warning" : "safe"}
          subtitle="총부채상환비율"
        />
      </div>

      {/* Contribution Chart */}
      <ContributionChart
        newLoanContribution={result.newLoanAnnualRepayment}
        existingLoansContribution={result.existingLoansAnnualRepayment}
        totalAnnualRepayment={result.totalAnnualRepayment}
      />

      {/* Summary */}
      <motion.div 
        className="glass rounded-xl p-4 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {summaryItems.map((item, index) => (
          <motion.div 
            key={item.label}
            className={`flex justify-between items-center py-2 ${
              index < summaryItems.length - 1 ? 'border-b border-border/30' : ''
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
          >
            <span className={`text-sm ${item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={item.value}
                className={`font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {formatCurrency(item.value)}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}