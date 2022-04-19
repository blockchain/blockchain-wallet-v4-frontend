import { EdgeConstrains } from '../../types'

export type UseCoinChartLayoutArgs = {
  bottomAxisHeight: number
  gap: number
  height: number
  margin: EdgeConstrains
  width: number
}

export type UseCoinChartLayoutResult = {
  bottomAxis: {
    top: number
  }
  canvas: {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
  }
}

export type UseCoinChartLayout = (args: UseCoinChartLayoutArgs) => UseCoinChartLayoutResult
