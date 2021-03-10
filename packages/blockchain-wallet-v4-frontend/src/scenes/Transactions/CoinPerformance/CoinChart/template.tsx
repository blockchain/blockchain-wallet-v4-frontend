import React, { useEffect, useState } from 'react'
import ReactHighcharts from 'react-highcharts'
import styled from 'styled-components'

import { calculateStart } from 'blockchain-wallet-v4/src/redux/data/misc/model'
import { calculateInterval } from 'services/charts'
import { media } from 'services/styles'

import { getConfig } from './model'

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  ${media.atLeastTablet`
    width: calc(100% - 100px);
  `}
  ${media.tablet`
    margin-left: 20px;
  `}
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
  const { coin, currency, data, time } = props
  const decimals = coin === 'XLM' ? 4 : 2
  const start = calculateStart(coin, time)
  const interval = calculateInterval(coin, time)
  let config = getConfig(coin, currency, data, decimals)

  const [chartObj, setChartObj] = useState({
    config,
    start,
    interval,
    decimals
  })

  useEffect(() => {
    config = getConfig(coin, currency, data, decimals)
    // @ts-ignore
    setChartObj({ config })
  }, [])

  return (
    <Wrapper>
      <ReactHighcharts config={chartObj.config} isPureConfig />
    </Wrapper>
  )
}

export default Chart
