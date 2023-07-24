const PERCENTAGE_100 = 100

export const calcBasicInterest = (principal: number, rate: number): number =>
  principal * (1 + rate / PERCENTAGE_100)
