import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import React from 'react'
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
  const { time, handleClick } = props

  return (
    <Wrapper>
      <FilterContainer
        selected={time === '1day'}
        onClick={() => handleClick('1day')}
        data-e2e='priceChartDay'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.day'
          defaultMessage='Day'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === '1week'}
        onClick={() => handleClick('1week')}
        data-e2e='priceChartWeek'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.week'
          defaultMessage='Week'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === '1month'}
        onClick={() => handleClick('1month')}
        data-e2e='priceChartMonth'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.month'
          defaultMessage='Month'
        />
      </FilterContainer>
      <FilterContainer
        selected={time === '1year'}
        onClick={() => handleClick('1year')}
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

TimeFilters.propTypes = {
  time: PropTypes.oneOf(['all', '1day', '1week', '1month', '1year']).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default TimeFilters
