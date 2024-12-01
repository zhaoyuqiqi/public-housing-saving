/** 等额本息 */
export function calculateLoanPayments(principal: number, annualRate: number, totalMonths: number) {
  let monthlyRate = annualRate / 12 / 100; // 月利率
  let monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  let remainingBalance = principal;
  let payments = [];

  for (let i = 0; i < totalMonths; i++) {
    let interestPayment = remainingBalance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    payments.push({
      month: i + 1,
      /** 月供 */
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      /** 本金 */
      principalPayment: Number(principalPayment.toFixed(2)),
      /** 利息 */
      interestPayment: Number(interestPayment.toFixed(2)),
      /** 剩余待还金额 */
      remainingBalance: Number(remainingBalance.toFixed(2))
    });
  }

  return payments;
}

/** 等额本金 */
export function calculateLoanPaymentsEqualPrincipal(principal: number, annualRate: number, totalMonths: number) {
  let monthlyRate = annualRate / 12 / 100; // 月利率
  let monthlyPrincipal = principal / totalMonths; // 每月应还本金
  let remainingBalance = principal;
  let payments = [];

  for (let i = 0; i < totalMonths; i++) {
    let interestPayment = remainingBalance * monthlyRate;
    let monthlyPayment = monthlyPrincipal + interestPayment;
    remainingBalance -= monthlyPrincipal;

    payments.push({
      month: i + 1,
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      principalPayment: Number(monthlyPrincipal.toFixed(2)),
      interestPayment: Number(interestPayment.toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2))
    });
  }

  return payments;
}