/**
 * @returns Linear domain with padding applied.
 */
export const padLinearDomain = ([x0, x1]: [number, number], k: number) => {
  const dx = ((x1 - x0) * k) / 2

  return [x0 - dx, x1 + dx]
}
