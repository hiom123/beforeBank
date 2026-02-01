export type LoanType = 
  | "주택담보대출" 
  | "오피스텔담보대출" 
  | "신용대출" 
  | "비주택담보대출"
  | "기타";

export type RepaymentMethod = 
  | "원리금균등분할" 
  | "원금균등분할" 
  | "만기일시상환" 
  | "혼합상환";

export interface NewLoan {
  loanType: LoanType;
  amount: number;
  termMonths: number;
  interestRate: number;
  repaymentMethod: RepaymentMethod;
}

export interface ExistingLoan {
  id: string;
  loanType: LoanType;
  balance: number;
  interestRate: number;
  remainingMonths: number;
  repaymentMethod: RepaymentMethod;
}

export interface CustomerInfo {
  borrowerName: string;
  annualIncome: number;
}

export interface MarketSettings {
  stressRate: number;
}

export interface CalculationResult {
  dsr: number;
  dti: number;
  totalAnnualRepayment: number;
  totalAnnualInterest: number;
  totalAnnualPrincipal: number;
  newLoanAnnualRepayment: number;
  existingLoansAnnualRepayment: number;
  status: "safe" | "warning" | "danger";
  message: string;
}
