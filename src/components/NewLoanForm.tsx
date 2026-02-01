import { motion } from "framer-motion";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { NewLoan, LoanType, RepaymentMethod } from "@/src/types/loan";
import { FileText, CircleDollarSign, Calendar, Percent, RefreshCw } from "lucide-react";

interface NewLoanFormProps {
  loan: NewLoan;
  onChange: (loan: NewLoan) => void;
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

const inputFields = [
  { key: "loanType", label: "대출 종류", icon: FileText, type: "select" },
  { key: "amount", label: "신청 금액 (원)", icon: CircleDollarSign, type: "currency" },
  { key: "termMonths", label: "약정 기간 (개월)", icon: Calendar, type: "number" },
  { key: "interestRate", label: "예상 금리 (%)", icon: Percent, type: "decimal" },
  { key: "repaymentMethod", label: "상환 방식", icon: RefreshCw, type: "select" },
];

export function NewLoanForm({ loan, onChange }: NewLoanFormProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, "")) || 0;
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/20">
          <CircleDollarSign className="w-4 h-4 text-accent" />
        </div>
        <h3 className="text-lg font-semibold gradient-text">신청 대출</h3>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
        >
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-3 h-3" />
            대출 종류
          </Label>
          <Select
            value={loan.loanType}
            onValueChange={(value) =>
              onChange({ ...loan, loanType: value as LoanType })
            }
          >
            <SelectTrigger className="bg-card/50 border-border/50">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {loanTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
        >
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CircleDollarSign className="w-3 h-3" />
            신청 금액 (원)
          </Label>
          <Input
            type="text"
            value={formatCurrency(loan.amount)}
            onChange={(e) =>
              onChange({ ...loan, amount: parseCurrency(e.target.value) })
            }
            placeholder="100,000,000"
            className="bg-card/50 border-border/50"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
        >
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            약정 기간 (개월)
          </Label>
          <Input
            type="number"
            value={loan.termMonths}
            onChange={(e) =>
              onChange({ ...loan, termMonths: parseInt(e.target.value) || 0 })
            }
            placeholder="360"
            className="bg-card/50 border-border/50"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
        >
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="w-3 h-3" />
            예상 금리 (%)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={loan.interestRate}
            onChange={(e) =>
              onChange({
                ...loan,
                interestRate: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="4.5"
            className="bg-card/50 border-border/50"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
        >
          <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <RefreshCw className="w-3 h-3" />
            상환 방식
          </Label>
          <Select
            value={loan.repaymentMethod}
            onValueChange={(value) =>
              onChange({ ...loan, repaymentMethod: value as RepaymentMethod })
            }
          >
            <SelectTrigger className="bg-card/50 border-border/50">
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {repaymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </motion.div>
  );
}