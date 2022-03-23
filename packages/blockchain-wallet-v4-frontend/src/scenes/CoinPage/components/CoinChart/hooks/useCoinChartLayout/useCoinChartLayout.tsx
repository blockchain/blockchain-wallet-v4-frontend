import { UseCoinChartLayout } from './types'

export const useCoinChartLayout: UseCoinChartLayout = ({
  bottomAxisHeight,
  gap,
  height,
  margin,
  width
}) => {
  const canvasWidth = width - margin.left - margin.right
  const canvasHeight = height - margin.top - margin.bottom - gap - bottomAxisHeight

  const bottomAxisTop = canvasHeight + margin.top + gap

  return {
    bottomAxis: {
      top: bottomAxisTop
    },
    canvas: {
      bottom: canvasHeight + margin.top,
      height: canvasHeight,
      left: margin.left,
      right: margin.right + canvasWidth,
      top: margin.top,
      width: canvasWidth
    }
  }
}
