import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketSettings } from "@/components/MarketSettings";
import { CustomerInfo } from "@/components/CustomerInfo";
import { NewLoanForm } from "@/components/NewLoanForm";
import { ExistingLoans } from "@/components/ExistingLoans";
import { ResultDashboard } from "@/components/ResultDashboard";
import { calculateDsrDti } from "@/utils/dsr-calculator.ts";
import type {
  MarketSettings as MarketSettingsType,
  CustomerInfo as CustomerInfoType,
  NewLoan,
  ExistingLoan,
} from "@/types/loan";
import { Calculator, Sparkles, BookOpen } from "lucide-react";

const Index = () => {
  const [marketSettings, setMarketSettings] = useState<MarketSettingsType>({
    stressRate: 1.5,
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
    borrowerName: "",
    annualIncome: 50000000,
  });

  const [newLoan, setNewLoan] = useState<NewLoan>({
    loanType: "주택담보대출",
    amount: 100000000,
    termMonths: 360,
    interestRate: 4.5,
    repaymentMethod: "원리금균등분할",
  });

  const [existingLoans, setExistingLoans] = useState<ExistingLoan[]>([]);

  const result = useMemo(() => {
    return calculateDsrDti(
      customerInfo.annualIncome,
      newLoan,
      existingLoans,
      marketSettings.stressRate
    );
  }, [customerInfo.annualIncome, newLoan, existingLoans, marketSettings.stressRate]);

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header 
        className="relative border-b border-border/50 glass-strong"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary glow-cyan"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="gradient-text">DSR / DTI</span>
                <span className="text-foreground"> 약식 계산기</span>
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                금융 전문가를 위한 대출 심사 지원 도구
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container relative py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Settings & Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass border-border/50 shadow-xl overflow-hidden">
                <CardContent className="pt-6 space-y-6">
                  <MarketSettings
                    settings={marketSettings}
                    onChange={setMarketSettings}
                  />
                  <Separator className="bg-border/50" />
                  <CustomerInfo info={customerInfo} onChange={setCustomerInfo} />
                </CardContent>
              </Card>
            </motion.div>

            {/* New Loan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="glass border-border/50 shadow-xl overflow-hidden">
                <CardContent className="pt-6">
                  <NewLoanForm loan={newLoan} onChange={setNewLoan} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Existing Loans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="glass border-border/50 shadow-xl overflow-hidden">
                <CardContent className="pt-6">
                  <ExistingLoans loans={existingLoans} onChange={setExistingLoans} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-strong border-border/50 shadow-2xl overflow-hidden">
                  <CardHeader className="pb-2 border-b border-border/30">
                    <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="gradient-text">분석 결과</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ResultDashboard
                      result={result}
                      borrowerName={customerInfo.borrowerName}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card className="glass border-border/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">DSR 규제 기준</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        총부채원리금상환비율(DSR) 40% 이내
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        스트레스 금리: 신규 대출에만 적용
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        오피스텔/비주택: 8년 만기 적용
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        신용대출 비분할: 5년 만기 적용
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 glass mt-auto">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground text-center">
            본 계산기는 약식 산출용이며, 정확한 심사 결과는 금융기관의 공식 심사를 통해 확인하시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;