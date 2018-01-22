import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Color, Link } from 'blockchain-info-components'
import BitcoinTicker from './BitcoinTicker'
import EthereumTicker from './EthereumTicker'
import Chart from './Chart'

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
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`
const Filter = styled(Link)`
  margin: 0 10px;
  &:hover { color: ${Color('brand-secondary')}; }
`

export default props => {
  const { coin, timeframe, selectCoin, selectTimeframe, currency } = props

  return (
    <Wrapper>
      <Row>
        <BitcoinTicker selected={coin === 'BTC'} currency={currency} onClick={() => selectCoin('BTC')} />
        <EthereumTicker selected={coin === 'ETH'} currency={currency} onClick={() => selectCoin('ETH')} />
      </Row>
      <Row>
        <Chart currency={currency} coin={coin} timeframe={timeframe} />
      </Row>
      <Row>
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
      </Row>
    </Wrapper>
  )
}
