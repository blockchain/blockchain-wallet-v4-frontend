export const transformChartData = (
  data: [number, number][]
): {
  date: number
  value: number
}[] => data.map(([date, value]: [number, number]) => ({ date, value }))
