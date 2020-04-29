import { calculateInterval, calculateStart } from 'services/ChartService'
import { getConfig } from './model'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import ReactHighcharts from 'react-highcharts'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-left: 50px;
  width: 100%;
  ${media.mobile`
    margin-left: 0px;
  `}

  * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
  }
  svg {
    .highcharts-background {
      fill: ${props => props.theme.white} !important;
    }
  }
  .highcharts-tooltip span {
    padding: 0 2px 2px 2px;
    > span:first-child {
      font-weight: 400;
    }
  }
  .highcharts-container,
  .highcharts-root {
    overflow: visible !important;
  }
`

const Chart = props => {
  const { coin, time, data, currency } = props
  const decimals = coin === 'XLM' ? 4 : 2
  const start = calculateStart(coin, time)
  const interval = calculateInterval(coin, time)
  let config = getConfig(coin, currency, data, decimals, interval, start)

  const [chartObj, setChartObj] = useState({
    config,
    start,
    interval,
    decimals
  })

  useEffect(() => {
    config = getConfig(coin, currency, data, decimals, interval, start)
    setChartObj({ config })
  }, [])

  return (
    <Wrapper>
      <ReactHighcharts config={chartObj.config} isPureConfig />
    </Wrapper>
  )
}

Chart.propTypes = {
  currencySymbol: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default Chart
