import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'

import { Color, Link } from 'blockchain-info-components'
import BitcoinTicker from './BitcoinTicker'
import EthereumTicker from './EthereumTicker'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  & > * { margin-bottom: 10px; }
`
const Ticker = styled.div`
  display: flex;
  justify-content: space-around;
  & > * { margin: 0 10px; }
`
const Highchart = styled.div`
  width: 100%;
`
const Filters = styled.div`
  display: flex;
  justify-content: center;
`
const Filter = styled(Link)`
  margin: 0 10px;
  &:hover { color: ${Color('brand-secondary')}; }
`

const Chart = (props) => {
  const { start, interval, currency, data, ...rest } = props
  const { config, coin, timeframe, selectBitcoin, selectEthereum, selectTimeframe } = rest

  return (
    <Wrapper>
      <Ticker>
        <BitcoinTicker selected={coin === 'BTC'} onClick={selectBitcoin} />
        <EthereumTicker selected={coin === 'ETH'} onClick={selectEthereum} />
      </Ticker>
      <Highchart>
        <ReactHighcharts config={config} />
      </Highchart>
      <Filters>
        <Filter size='14px' weight={300} color={timeframe === 'all' ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('all')}>
          <FormattedMessage id='scenes.home.chart.alltime' defaultMessage='All time' />
        </Filter>
        <Filter size='14px' weight={300} color={timeframe === 'year' ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('year')}>
          <FormattedMessage id='scenes.home.chart.year' defaultMessage='Year' />
        </Filter>
        <Filter size='14px' weight={300} color={timeframe === 'month' ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('month')}>
          <FormattedMessage id='scenes.home.chart.month' defaultMessage='Month' />
        </Filter>
        <Filter size='14px' weight={300} color={timeframe === 'week' ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('week')}>
          <FormattedMessage id='scenes.home.chart.week' defaultMessage='Week' />
        </Filter>
        <Filter size='14px' weight={300} color={timeframe === 'day' ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('day')}>
          <FormattedMessage id='scenes.home.chart.day' defaultMessage='Day' />
        </Filter>
      </Filters>
    </Wrapper>
  )
}

export default Chart
