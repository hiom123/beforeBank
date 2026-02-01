import { LoanType, RepaymentMethod, NewLoan, ExistingLoan, CalculationResult } from "@/types/loan";

// 연간 원리금 상환액 계산 (원리금균등분할)
function calculateAnnuityRepayment(
  principal: number,
  annualRate: number,
  totalMonths: number
): { annualPrincipal: number; annualInterest: number } {
  if (annualRate === 0) {
    const monthlyPrincipal = principal / totalMonths;
    return {
      annualPrincipal: monthlyPrincipal * 12,
      annualInterest: 0,
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // 첫해 기준 계산
  let remainingPrincipal = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 0; month < 12 && month < totalMonths; month++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    remainingPrincipal -= principalPayment;
  }

  return {
    annualPrincipal: totalPrincipal,
    annualInterest: totalInterest,
  };
}

// 원금균등분할 상환액 계산
function calculateEqualPrincipalRepayment(
  principal: number,
  annualRate: number,
  totalMonths: number
): { annualPrincipal: number; annualInterest: number } {
  const monthlyPrincipal = principal / totalMonths;
  const monthlyRate = annualRate / 100 / 12;

  let remainingPrincipal = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 0; month < 12 && month < totalMonths; month++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    totalInterest += interestPayment;
    totalPrincipal += monthlyPrincipal;
    remainingPrincipal -= monthlyPrincipal;
  }

  return {
    annualPrincipal: totalPrincipal,
    annualInterest: totalInterest,
  };
}

// DSR 원금 산정 기준 반환
export function getDsrBasis(loanType: LoanType, repaymentMethod: RepaymentMethod): string {
  if (loanType === "오피스텔담보대출") {
    if (repaymentMethod === "원리금균등분할" || repaymentMethod === "원금균등분할") {
      return "실제 분할상환";
    }
    return "8년 만기 적용";
  }
  
  if (loanType === "신용대출") {
    if (repaymentMethod === "원리금균등분할" || repaymentMethod === "원금균등분할") {
      return "실제 분할상환";
    }
    return "5년 만기 적용";
  }
  
  if (loanType === "비주택담보대출") {
    return "8년 만기 적용";
  }
  
  return "실제 상환조건";
}

// DSR용 연간 상환액 계산
function calculateDsrRepayment(
  loanType: LoanType,
  amount: number,
  rate: number,
  termMonths: number,
  repaymentMethod: RepaymentMethod,
  applyStressRate: boolean = false,
  stressRate: number = 0
): { annualPrincipal: number; annualInterest: number } {
  const effectiveRate = applyStressRate ? rate + stressRate : rate;
  
  // 비주택담보대출: 항상 8년 만기 적용
  if (loanType === "비주택담보대출") {
    const annualPrincipal = amount / 8;
    const annualInterest = amount * (effectiveRate / 100);
    return { annualPrincipal, annualInterest };
  }
  
  // 오피스텔담보대출
  if (loanType === "오피스텔담보대출") {
    if (repaymentMethod === "원리금균등분할") {
      return calculateAnnuityRepayment(amount, effectiveRate, termMonths);
    }
    if (repaymentMethod === "원금균등분할") {
      return calculateEqualPrincipalRepayment(amount, effectiveRate, termMonths);
    }
    // 일시상환 등: 8년 만기 적용
    const annualPrincipal = amount / 8;
    const annualInterest = amount * (effectiveRate / 100);
    return { annualPrincipal, annualInterest };
  }
  
  // 신용대출
  if (loanType === "신용대출") {
    if (repaymentMethod === "원리금균등분할") {
      return calculateAnnuityRepayment(amount, effectiveRate, termMonths);
    }
    if (repaymentMethod === "원금균등분할") {
      return calculateEqualPrincipalRepayment(amount, effectiveRate, termMonths);
    }
    // 비분할상환: 5년 만기 적용
    const annualPrincipal = amount / 5;
    const annualInterest = amount * (effectiveRate / 100);
    return { annualPrincipal, annualInterest };
  }
  
  // 기타 대출 (주택담보대출 등): 실제 조건 적용
  if (repaymentMethod === "원리금균등분할") {
    return calculateAnnuityRepayment(amount, effectiveRate, termMonths);
  }
  if (repaymentMethod === "원금균등분할") {
    return calculateEqualPrincipalRepayment(amount, effectiveRate, termMonths);
  }
  
  // 만기일시상환
  const annualInterest = amount * (effectiveRate / 100);
  return { annualPrincipal: 0, annualInterest };
}

export function calculateDsrDti(
  annualIncome: number,
  newLoan: NewLoan | null,
  existingLoans: ExistingLoan[],
  stressRate: number
): CalculationResult {
  let totalAnnualPrincipal = 0;
  let totalAnnualInterest = 0;
  let newLoanAnnualRepayment = 0;
  let existingLoansAnnualRepayment = 0;

  // 신규 대출 계산 (스트레스 금리 적용)
  if (newLoan && newLoan.amount > 0) {
    const newLoanResult = calculateDsrRepayment(
      newLoan.loanType,
      newLoan.amount,
      newLoan.interestRate,
      newLoan.termMonths,
      newLoan.repaymentMethod,
      true,
      stressRate
    );
    totalAnnualPrincipal += newLoanResult.annualPrincipal;
    totalAnnualInterest += newLoanResult.annualInterest;
    newLoanAnnualRepayment = newLoanResult.annualPrincipal + newLoanResult.annualInterest;
  }

  // 기존 대출 계산 (스트레스 금리 미적용)
  for (const loan of existingLoans) {
    if (loan.balance > 0) {
      const loanResult = calculateDsrRepayment(
        loan.loanType,
        loan.balance,
        loan.interestRate,
        loan.remainingMonths,
        loan.repaymentMethod,
        false,
        0
      );
      totalAnnualPrincipal += loanResult.annualPrincipal;
      totalAnnualInterest += loanResult.annualInterest;
      existingLoansAnnualRepayment += loanResult.annualPrincipal + loanResult.annualInterest;
    }
  }

  const totalAnnualRepayment = totalAnnualPrincipal + totalAnnualInterest;
  
  // DSR = 총 연간 원리금 상환액 / 연소득 * 100
  const dsr = annualIncome > 0 ? (totalAnnualRepayment / annualIncome) * 100 : 0;
  
  // DTI = 총 연간 이자 + 신규대출 원금 / 연소득 * 100 (간략화)
  const dti = annualIncome > 0 ? ((totalAnnualInterest + (newLoan ? newLoanAnnualRepayment : 0)) / annualIncome) * 100 : 0;

  let status: "safe" | "warning" | "danger";
  let message: string;

  if (dsr > 40) {
    status = "danger";
    message = "한도 초과 위험 - DSR 40% 초과";
  } else if (dsr > 35) {
    status = "warning";
    message = "주의 - DSR 한도 근접";
  } else {
    status = "safe";
    message = "DSR 40% 이내 / 대출진행 가능";
  }

  return {
    dsr: Math.round(dsr * 100) / 100,
    dti: Math.round(dti * 100) / 100,
    totalAnnualRepayment: Math.round(totalAnnualRepayment),
    totalAnnualInterest: Math.round(totalAnnualInterest),
    totalAnnualPrincipal: Math.round(totalAnnualPrincipal),
    newLoanAnnualRepayment: Math.round(newLoanAnnualRepayment),
    existingLoansAnnualRepayment: Math.round(existingLoansAnnualRepayment),
    status,
    message,
  };
}
