import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Info, Layers } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { ExistingLoan, LoanType, RepaymentMethod } from "@/src/types/loan";
import { getDsrBasis } from "@/src/utils/dsr-calculator";

interface ExistingLoansProps {
  loans: ExistingLoan[];
  onChange: (loans: ExistingLoan[]) => void;
}

const loanTypes: LoanType[] = [
  "주택담보대출",
  "오피스텔담보대출",
  "신용대출",
  "비주택담보대출",
  "기타",
];

const repaymentMethods: RepaymentMethod[] = [
  "원리금균등분할",
  "원금균등분할",
  "만기일시상환",
  "혼합상환",
];

export function ExistingLoans({ loans, onChange }: ExistingLoansProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  };

  const addLoan = () => {
    const newLoan: ExistingLoan = {
      id: crypto.randomUUID(),
      loanType: "주택담보대출",
      balance: 0,
      interestRate: 0,
      remainingMonths: 360,
      repaymentMethod: "원리금균등분할",
    };
    onChange([...loans, newLoan]);
  };

  const updateLoan = (id: string, updates: Partial<ExistingLoan>) => {
    onChange(
      loans.map((loan) => (loan.id === id ? { ...loan, ...updates } : loan))
    );
  };

  const removeLoan = (id: string) => {
    onChange(loans.filter((loan) => loan.id !== id));
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20">
            <Layers className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold gradient-text">기존 대출 현황</h3>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={addLoan} 
            size="sm" 
            className="gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 btn-glow"
          >
            <Plus className="h-4 w-4" />
            대출 추가
          </Button>
        </motion.div>
      </div>

      <AnimatePresence mode="popLayout">
        {loans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground py-8 text-center rounded-xl border border-dashed border-border/50 bg-muted/10"
          >
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            기존 대출이 없습니다. '대출 추가' 버튼을 클릭하여 추가하세요.
          </motion.div>
        ) : (
          <div className="space-y-3">
            {loans.map((loan, index) => (
              <motion.div
                key={loan.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-xl glass border border-border/50 space-y-4 hover:glow-border-purple transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    기존 대출 #{index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div 
                          className="flex items-center gap-1 text-xs text-muted-foreground cursor-help px-2 py-1 rounded-full bg-muted/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Info className="h-3 w-3" />
                          <span>DSR 산정기준</span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-card border-border">
                        <p>{getDsrBasis(loan.loanType, loan.repaymentMethod)}</p>
                      </TooltipContent>
                    </Tooltip>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLoan(loan.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">대출 종류</Label>
                    <Select
                      value={loan.loanType}
                      onValueChange={(value) =>
                        updateLoan(loan.id, { loanType: value as LoanType })
                      }
                    >
                      <SelectTrigger className="bg-muted/30 border-border/50 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {loanTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">잔액 (원)</Label>
                    <Input
                      type="text"
                      value={formatCurrency(loan.balance)}
                      onChange={(e) =>
                        updateLoan(loan.id, {
                          balance: parseCurrency(e.target.value),
                        })
                      }
                      className="bg-muted/30 border-border/50 h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">금리 (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={loan.interestRate}
                      onChange={(e) =>
                        updateLoan(loan.id, {
                          interestRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-muted/30 border-border/50 h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">잔여 기간 (개월)</Label>
                    <Input
                      type="number"
                      value={loan.remainingMonths}
                      onChange={(e) =>
                        updateLoan(loan.id, {
                          remainingMonths: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-muted/30 border-border/50 h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">상환 방식</Label>
                    <Select
                      value={loan.repaymentMethod}
                      onValueChange={(value) =>
                        updateLoan(loan.id, {
                          repaymentMethod: value as RepaymentMethod,
                        })
                      }
                    >
                      <SelectTrigger className="bg-muted/30 border-border/50 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {repaymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
