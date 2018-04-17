import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import CoinTicker from './CoinTicker'
import Chart from './Chart'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  height: 370px;
  box-sizing: border-box;
  & > * { margin-bottom: 10px; }
  border: 1px solid ${props => props.theme['gray-1']};
  svg {
    font-weight: 300;
    font-family: 'Montserrat' !important;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`
const FilterText = styled(Text)`
  border-bottom: ${props => props.underline && `2px solid ${props.theme['brand-primary']}`};
  text-transform: uppercase;
  margin-right: 15px;
  cursor: pointer;
`
const TitleFiltersRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
        <Text uppercase color='brand-primary' weight={300} size='24px'><FormattedMessage id='scenes.home.chart.pricechart' defaultMessage='Price Charts' /></Text>
        <TimeFilters>
          <FilterText size='14px' weight={300} underline={allSelected} color={allSelected ? 'brand-primary' : 'gray-3'} onClick={() => selectTimeframe('all')}>
            <FormattedMessage id='scenes.home.chart.all' defaultMessage='All' />
          </FilterText>
          <FilterText size='14px' weight={300} underline={yearSelected} color={yearSelected ? 'brand-primary' : 'gray-3'} onClick={() => selectTimeframe('year')}>
            <FormattedMessage id='scenes.home.chart.year' defaultMessage='Year' />
          </FilterText>
          <FilterText size='14px' weight={300} underline={monthSelected} color={monthSelected ? 'brand-primary' : 'gray-3'} onClick={() => selectTimeframe('month')}>
            <FormattedMessage id='scenes.home.chart.month' defaultMessage='Month' />
          </FilterText>
          <FilterText size='14px' weight={300} underline={weekSelected} color={weekSelected ? 'brand-primary' : 'gray-3'} onClick={() => selectTimeframe('week')}>
            <FormattedMessage id='scenes.home.chart.week' defaultMessage='Week' />
          </FilterText>
          <FilterText size='14px' weight={300} underline={daySelected} color={daySelected ? 'brand-primary' : 'gray-3'} onClick={() => selectTimeframe('day')}>
            <FormattedMessage id='scenes.home.chart.day' defaultMessage='Day' />
          </FilterText>
        </TimeFilters>
      </TitleFiltersRow>
      <Row>
        <Chart currency={currency} coin={coin} timeframe={timeframe} />
      </Row>
      <Row>
        <CoinTicker coin='BTC' selected={coin === 'BTC'} currency={currency} onClick={() => selectCoin('BTC')} />
        <CoinTicker coin='ETH' selected={coin === 'ETH'} currency={currency} onClick={() => selectCoin('ETH')} />
        <CoinTicker coin='BCH' selected={coin === 'BCH'} currency={currency} onClick={() => selectCoin('BCH')} />
      </Row>
    </Wrapper>
  )
}
