import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 300px;
`

const FilterContainer = styled(Text)`
  color: ${props =>
    props.selected ? props.theme['brand-primary'] : props.theme['gray-3']};
  border-bottom: ${props =>
    props.selected
      ? `2px solid ${props.theme['brand-primary']}`
      : '2px solid transparent'};
  cursor: pointer;
`

const TimeFilters = props => {
  const { time, handleClick } = props

  return (
    <Wrapper>
      <FilterContainer
        size='14px'
        weight={300}
        selected={time === 'all'}
        onClick={() => handleClick('all')}
        data-e2e='priceChartAll'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.all'
          defaultMessage='All'
        />
      </FilterContainer>
      <FilterContainer
        size='14px'
        weight={300}
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
        size='14px'
        weight={300}
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
        size='14px'
        weight={300}
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
        size='14px'
        weight={300}
        selected={time === '1day'}
        onClick={() => handleClick('1day')}
        data-e2e='priceChartDay'
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.day'
          defaultMessage='Day'
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
