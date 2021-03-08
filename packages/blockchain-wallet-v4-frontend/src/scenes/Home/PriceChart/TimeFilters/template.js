import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 100px;
  width: 100%;
`

const FilterContainer = styled(Text).attrs({
  size: '12px',
  weight: 400
})`
  color: ${props => (props.selected ? props.theme.white : props.theme.grey300)};
  border: ${props =>
    props.selected
      ? `1px solid ${props.theme.blue600}`
      : `1px solid ${props.theme.grey100}`};
  background: ${props =>
    props.selected ? props.theme.blue600 : props.theme.white};
  letter-spacing: 1px;
  border-radius: 6px;
  cursor: pointer;
  margin: 0 8px;
  padding: 4px 6px;
  transition: color 0.3s, border 0.3s, background 0.3s;
  &:hover {
    color: ${props => !props.selected && props.theme.blue600};
    border: ${props => `1px solid ${props.theme.blue600}`};
  }
`

const TimeFilters = props => {
  const { handleClick, time } = props

  return (
    <Wrapper>
      <FilterContainer
        selected={time === 'day'}
        onClick={() => handleClick('day')}
        data-e2e='priceChartDay'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.day'
          defaultMessage='Day'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === 'week'}
        onClick={() => handleClick('week')}
        data-e2e='priceChartWeek'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.week'
          defaultMessage='Week'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === 'month'}
        onClick={() => handleClick('month')}
        data-e2e='priceChartMonth'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.month'
          defaultMessage='Month'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === 'year'}
        onClick={() => handleClick('year')}
        data-e2e='priceChartYear'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.year'
          defaultMessage='Year'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === 'all'}
        onClick={() => handleClick('all')}
        data-e2e='priceChartAll'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.all'
          defaultMessage='All'
        />
      </FilterContainer>
    </Wrapper>
  )
}

export default TimeFilters
