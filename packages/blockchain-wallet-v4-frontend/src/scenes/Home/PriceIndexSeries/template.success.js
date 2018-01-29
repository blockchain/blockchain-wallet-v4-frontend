import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Color, Link, Text } from 'blockchain-info-components'
import CoinTicker from './CoinTicker'
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
  text-decoration: ${props => props.underline && 'underline'};
`
const TitleFiltersRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`
const TimeFilters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default props => {
  const { coin, timeframe, selectCoin, selectTimeframe, currency } = props
  const allSelected = timeframe === 'all'
  const yearSelected = timeframe === 'year'
  const monthSelected = timeframe === 'month'
  const weekSelected = timeframe === 'week'
  const daySelected = timeframe === 'day'

  return (
    <Wrapper>
      <TitleFiltersRow>
        <Text uppercase color='brand-primary' weight={300} size='24px'><FormattedMessage id='scenes.home.chart.pricechart' defaultMessage='Price chart' /></Text>
        <TimeFilters>
          <Filter size='14px' weight={300} underline={allSelected} color={allSelected ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('all')}>
            <FormattedMessage id='scenes.home.chart.alltime' defaultMessage='All time' />
          </Filter>
          <Filter size='14px' weight={300} underline={yearSelected} color={yearSelected ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('year')}>
            <FormattedMessage id='scenes.home.chart.year' defaultMessage='Year' />
          </Filter>
          <Filter size='14px' weight={300} underline={monthSelected} color={monthSelected ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('month')}>
            <FormattedMessage id='scenes.home.chart.month' defaultMessage='Month' />
          </Filter>
          <Filter size='14px' weight={300} underline={weekSelected} color={weekSelected ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('week')}>
            <FormattedMessage id='scenes.home.chart.week' defaultMessage='Week' />
          </Filter>
          <Filter size='14px' weight={300} underline={daySelected} color={daySelected ? 'brand-secondary' : 'brand-primary'} onClick={() => selectTimeframe('day')}>
            <FormattedMessage id='scenes.home.chart.day' defaultMessage='Day' />
          </Filter>
        </TimeFilters>
      </TitleFiltersRow>
      <Row>
        <Chart currency={currency} coin={coin} timeframe={timeframe} />
      </Row>
      <Row>
        <CoinTicker coin='BTC' selected={coin === 'BTC'} currency={currency} onClick={() => selectCoin('BTC')} />
        <CoinTicker coin='ETH' selected={coin === 'ETH'} currency={currency} onClick={() => selectCoin('ETH')} />
      </Row>
    </Wrapper>
  )
}
