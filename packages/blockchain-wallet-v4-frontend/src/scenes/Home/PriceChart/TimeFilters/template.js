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
  color: ${props => props.selected ? props.theme['brand-primary'] : props.theme['gray-3']};
  border-bottom: ${props => props.selected ? `2px solid ${props.theme['brand-primary']}` : 'none'};
  cursor: pointer;
`

const TimeFilters = props => {
  const { time, handleClick } = props

  return (
    <Wrapper>
      <FilterContainer size='14px' weight={300} selected={time === 'all'} onClick={() => handleClick('all')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.all' defaultMessage='All' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} selected={time === 'year'} onClick={() => handleClick('year')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.year' defaultMessage='Year' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} selected={time === 'month'} onClick={() => handleClick('month')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.month' defaultMessage='Month' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} selected={time === 'week'} onClick={() => handleClick('week')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.week' defaultMessage='Week' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} selected={time === 'day'} onClick={() => handleClick('day')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.day' defaultMessage='Day' />
      </FilterContainer>
    </Wrapper>
  )
}

TimeFilters.propTypes = {
  time: PropTypes.oneOf(['all', 'day', 'week', 'month', 'year']).isRequired,
  handleClick: PropTypes.func.isRequired
}

TimeFilters.defaultProps = {
  time: 'all'
}

export default TimeFilters
