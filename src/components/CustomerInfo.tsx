import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CustomerInfo as CustomerInfoType } from "@/types/loan";
import { User, Wallet } from "lucide-react";

interface CustomerInfoProps {
  info: CustomerInfoType;
  onChange: (info: CustomerInfoType) => void;
}

export function CustomerInfo({ info, onChange }: CustomerInfoProps) {
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
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20">
          <User className="w-4 h-4 text-secondary" />
        </div>
        <h3 className="text-lg font-semibold gradient-text">고객 정보</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label htmlFor="borrowerName" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="w-3 h-3" />
            차주명
          </Label>
          <Input
            id="borrowerName"
            type="text"
            value={info.borrowerName}
            onChange={(e) =>
              onChange({ ...info, borrowerName: e.target.value })
            }
            placeholder="홍길동"
            className="bg-card/50 border-border/50 focus:glow-border-cyan transition-all"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30 border-gradient"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Label htmlFor="annualIncome" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="w-3 h-3" />
            연소득 (원)
          </Label>
          <Input
            id="annualIncome"
            type="text"
            value={formatCurrency(info.annualIncome)}
            onChange={(e) =>
              onChange({ ...info, annualIncome: parseCurrency(e.target.value) })
            }
            placeholder="50,000,000"
            className="bg-card/50 border-border/50 focus:glow-border-cyan transition-all"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
