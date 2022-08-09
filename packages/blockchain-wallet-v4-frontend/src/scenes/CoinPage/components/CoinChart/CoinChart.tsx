import React, { useCallback, useMemo } from 'react'
import { AxisBottom } from '@visx/axis'
import { curveBasis } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { Bar, Circle } from '@visx/shape'
import { Numeric } from 'd3-array'

import {
  AnimatedLinePath,
  useLinearScale,
  useTimeScale,
  useTooltipHandlers,
  VerticalDashedLine
} from 'components/Chart'

import { useCoinChartLayout, useShowTooltip } from './hooks'
import { CoinChartProps, CoinData, EdgeConstrains } from './types'

const defaultMargin: EdgeConstrains = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16
}

export const CoinChart = <DATA extends CoinData = CoinData>({
  data,
  numTicks,
  primaryColor,
  textColor,
  height,
  width,
  x,
  xFormatter,
  y,
  margin = defaultMargin,
  tooltip
}: CoinChartProps<DATA>) => {
  const getX = useCallback((dataItem: DATA): Date => new Date(dataItem[x].valueOf()), [x])
  const getY = useCallback((dataItem: DATA): Numeric => dataItem[y], [y])

  const layout = useCoinChartLayout({
    bottomAxisHeight: 32,
    gap: 12,
    height,
    margin,
    width
  })

  const lastDataPoint: DATA = useMemo(() => data[data.length - 1], [data])
  const xScale = useTimeScale({ data, getX, range: [layout.canvas.left, layout.canvas.right] })
  const yScale = useLinearScale({ data, getY, range: [layout.canvas.bottom, layout.canvas.top] })

  const {
    cursorLeft,
    cursorTop,
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft,
    tooltipOpen,
    tooltipTop
  } = useShowTooltip({
    data,
    getX,
    getY,
    xScale,
    yScale
  })

  const { onMouseLeave, ...tooltipHandlers } = useTooltipHandlers({
    hide: hideTooltip,
    show: showTooltip
  })

  return (
    <div style={{ height, position: 'relative', width }}>
      <svg width={width} height={height} onMouseLeave={onMouseLeave}>
        <LinearGradient
          id='coin_chart_linear_gradient'
          from={primaryColor}
          to={primaryColor}
          rotate='-90'
          fromOpacity={0.1}
        />

        <LinearGradient
          id='coin_chart_line_background_linear_gradient'
          from='rgba(12, 108, 242, 0.08)'
          to='rgba(12, 108, 242, 0)'
        />

        <AnimatedLinePath
          curve={curveBasis}
          data={data}
          x={(dataItem) => xScale(getX(dataItem))}
          y={(dataItem) => yScale(getY(dataItem))}
          stroke='url(#coin_chart_linear_gradient)'
          strokeWidth={4}
          {...tooltipHandlers}
        />

        {!tooltipOpen && (
          <Group
            left={xScale(getX(lastDataPoint))}
            top={yScale(getY(lastDataPoint))}
            {...tooltipHandlers}
          >
            <Circle fill={primaryColor} r={4} />
            <Circle fill={primaryColor} r={8} opacity={0.1} />
            <Circle fill={primaryColor} r={16} opacity={0.1} />
          </Group>
        )}

        <AxisBottom
          scale={xScale}
          hideAxisLine
          hideTicks
          hideZero
          numTicks={numTicks}
          tickFormat={(xValue) => xFormatter?.(xValue as DATA[keyof DATA]) ?? xValue.toString()}
          top={layout.bottomAxis.top}
          tickLabelProps={() => ({
            fill: textColor,
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 22,
            textAnchor: 'middle',
            verticalAnchor: 'middle'
          })}
        />

        <Bar
          y={layout.canvas.top}
          x={layout.canvas.left}
          width={layout.canvas.width}
          height={layout.canvas.height}
          fill='transparent'
          cursor='crosshair'
          rx={14}
          {...tooltipHandlers}
        />

        {tooltipOpen && (
          <>
            <VerticalDashedLine
              top={layout.canvas.top}
              left={tooltipLeft}
              bottom={layout.canvas.bottom}
              color={primaryColor}
            />

            <Group top={tooltipTop} left={tooltipLeft}>
              <Circle fill={primaryColor} r={4} />
            </Group>
          </>
        )}
      </svg>

      {!!tooltipData &&
        tooltip &&
        tooltip({
          cursorLeft,
          cursorTop,
          getX,
          getY,
          tooltipData,
          tooltipLeft,
          tooltipTop
        })}
    </div>
  )
}

export type CoinChartComponent = typeof CoinChart
