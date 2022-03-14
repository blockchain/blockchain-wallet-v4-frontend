import React, { useCallback, useMemo } from 'react'
import useMeasure from 'react-use-measure'
import { AxisBottom } from '@visx/axis'
import { curveBasis } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { Circle, LinePath } from '@visx/shape'
import { extent, max, min, Numeric } from 'd3-array'

import { CoinChartProps, CoinData } from './types'

export const CoinChart = <DATA extends CoinData = CoinData>({
  data,
  numTicks,
  primaryColor,
  textColor,
  x,
  xFormatter,
  y
}: CoinChartProps<DATA>) => {
  const [ref, { height, width }] = useMeasure()
  const getX = useCallback((dataItem: DATA): Numeric => dataItem[x], [x])
  const getY = useCallback((dataItem: DATA): Numeric => dataItem[y]!, [y])

  const padding = {
    bottom: 16,
    left: 32,
    right: 32,
    top: 16
  }

  const lastDataPoint: DATA = useMemo(() => data[data.length - 1], [data, getY])

  const maxY = useMemo(() => max(data, getY) as number, [data, getY])
  const minY = useMemo(() => min(data, getY) as number, [data, getY])

  const xScale = useMemo(() => {
    const xDomain = extent(data, getX) as [Date, Date]

    return scaleTime<number>({
      domain: xDomain,
      nice: true
    })
  }, [data, getX])

  const yScale = useMemo(() => {
    const yDomain = [minY, maxY]

    return scaleLinear<number>({
      domain: yDomain,
      nice: true
    })
  }, [data, minY, maxY])

  const innerWidth = width - (padding.left + padding.right)
  const innerHeight = height - (padding.top + padding.bottom)

  xScale.range([0, innerWidth])
  yScale.range([innerHeight - 64, 0])

  return (
    <svg ref={ref} width='100%' height='100%' viewBox={`0 0 ${width} ${height}`}>
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

      <Group left={padding.left} top={padding.top} width={innerWidth} height={innerHeight}>
        <LinePath
          curve={curveBasis}
          data={data}
          x={(dataItem) => xScale(getX(dataItem))}
          y={(dataItem) => yScale(getY(dataItem))}
          stroke='url(#coin_chart_linear_gradient)'
          strokeWidth={4}
        />

        {/* <AreaClosed
          curve={curveCardinal}
          data={data}
          x={(dataItem) => xScale(getX(dataItem))}
          y={(dataItem) => yScale(getY(dataItem))}
          yScale={yScale}
          strokeWidth={0}
          fill='url(#coin_chart_line_background_linear_gradient)'
        /> */}

        <Group left={xScale(getX(lastDataPoint))} top={yScale(getY(lastDataPoint))}>
          <Circle fill={primaryColor} r={4} />
          <Circle fill={primaryColor} r={8} opacity={0.1} />
          <Circle fill={primaryColor} r={16} opacity={0.1} />
        </Group>

        <AxisBottom
          scale={xScale}
          hideAxisLine
          hideTicks
          hideZero
          orientation='bottom'
          numTicks={numTicks}
          tickFormat={(xValue) => xFormatter?.(xValue as DATA[keyof DATA]) ?? xValue.toString()}
          top={height - 44}
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
      </Group>
    </svg>
  )
}

export type CoinChartComponent = typeof CoinChart
