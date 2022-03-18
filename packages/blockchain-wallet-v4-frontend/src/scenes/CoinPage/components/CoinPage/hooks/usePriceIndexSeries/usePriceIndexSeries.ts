import { useMemo } from 'react'

type UsePriceIndexSeriesData =
  | {
      price: number
      timestamp: number
    }[]
  | undefined

export const usePriceIndexSeries = (
  data: UsePriceIndexSeriesData
): { date: number; price: number }[] => {
  return useMemo(
    () =>
      data?.map(({ price, timestamp }) => ({
        date: timestamp * 1000,
        price
      })) ?? [],
    [data]
  )
}
