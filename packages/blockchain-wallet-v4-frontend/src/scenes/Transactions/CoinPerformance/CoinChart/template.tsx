import React, { useCallback, useMemo } from 'react'
import useMeasure from 'react-use-measure'
import { localPoint } from '@visx/event'
import { EventType } from '@visx/event/lib/types'
import { LinearGradient } from '@visx/gradient'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape'
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip'
import { bisector, extent, max, min } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import ResizeObserver from 'resize-observer-polyfill'
import styled, { DefaultTheme } from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { CoinType, FiatType } from '@core/types'
import { Color } from 'blockchain-info-components'

type Data = [number, number]

const formatDate = timeFormat("%b %d, '%y")

const getYValue = (d: Data) => new Date(d[0])

const getXValue = (d: Data) => d[1]

const bisectDate = bisector<Data, Date>((d) => new Date(getYValue(d))).left

const strokeWidth = 2

type TooltipData = Data

const circleSize = 4

const tooltipBorderRadius = 4

const Wrapper = styled.div`
  position: relative;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Chart = ({ coin, currency, data }: { coin: CoinType; currency: FiatType; data: Data[] }) => {
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver })
  const color = Color(coin as keyof DefaultTheme) || '#000'

  const width = bounds.width || 100
  const height = bounds.height || 100

  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<TooltipData>()

  const tooltipStyles = useMemo(
    () => ({
      ...defaultStyles,
      background: Color('grey900'),
      borderRadius: tooltipBorderRadius,
      color: 'white',
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif '
    }),
    []
  )

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: extent(data, getYValue) as [Date, Date],
        range: [0, width]
      }),
    [width, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [min(data, getXValue) || 0, max(data, getXValue) || 0],
        nice: true,
        range: [height, 0]
      }),
    [height, data]
  )

  const handleTooltip = useCallback(
    (event: EventType) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0
      if (d1 && getYValue(d1)) {
        d =
          x0.valueOf() - getYValue(d0).valueOf() > getYValue(d1).valueOf() - x0.valueOf() ? d1 : d0
      }

      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(getYValue(d)),
        tooltipTop: yScale(getXValue(d))
      })
    },
    [showTooltip, yScale, xScale, data]
  )

  return (
    <Wrapper>
      <svg ref={ref} width='100%' height='100%' viewBox={`0 0 ${width} ${height}`}>
        <LinearGradient id={color} fromOpacity={0.5} toOpacity={0} from={color} to='white' />

        <AreaClosed<Data>
          data={data}
          fill={`url(#${color})`}
          yScale={yScale}
          x={(d) => xScale(getYValue(d)) ?? 0}
          y={(d) => yScale(getXValue(d)) ?? 0}
          strokeWidth={0}
        />

        <LinePath<Data>
          data={data}
          x={(d) => xScale(getYValue(d)) ?? 0}
          y={(d) => yScale(getXValue(d)) ?? 0}
          strokeWidth={strokeWidth}
          stroke={color}
        />

        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill='transparent'
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />

        {tooltipData ? (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: window.innerHeight }}
              stroke={color}
              opacity={0.2}
              strokeWidth={strokeWidth}
              pointerEvents='none'
              strokeDasharray='7,5'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={circleSize}
              fill={color}
              fillOpacity={0.1}
              stroke={color}
              strokeOpacity={0.1}
              strokeWidth={strokeWidth}
              pointerEvents='none'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={circleSize}
              fill={color}
              stroke='white'
              strokeWidth={strokeWidth}
              pointerEvents='none'
            />
          </g>
        ) : null}
      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          {formatDate(getYValue(tooltipData))}
          <br />
          <br />
          {fiatToString({
            unit: currency,
            value: getXValue(tooltipData)
          })}
        </TooltipWithBounds>
      ) : null}
    </Wrapper>
  )
}

export default Chart
