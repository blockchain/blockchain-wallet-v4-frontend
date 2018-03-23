import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { selectors, actions } from 'adapter'
import { Text } from 'blockchain-info-components'
import { selectTimeStyle } from './services'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 300px;
`

const FilterContainer = styled(Text)`
  border-bottom: ${props => props.underline && `2px solid ${props.theme['brand-primary']}`};
`

const TimeFilters = props => {
  const { time, actions } = props
  const timeStyle = selectTimeStyle(time)

  return (
    <Wrapper>
      <FilterContainer size='14px' weight={300} {...timeStyle.all} onClick={() => actions.timeClicked('all')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.all' defaultMessage='All' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} {...timeStyle.year} onClick={() => actions.timeClicked('year')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.year' defaultMessage='Year' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} {...timeStyle.month} onClick={() => actions.timeClicked('month')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.month' defaultMessage='Month' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} {...timeStyle.week} onClick={() => actions.timeClicked('week')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.week' defaultMessage='Week' />
      </FilterContainer>
      <FilterContainer size='14px' weight={300} {...timeStyle.day} onClick={() => actions.timeClicked('day')}>
        <FormattedMessage id='scenes.priceindexseries.timefilters.day' defaultMessage='Day' />
      </FilterContainer>
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  time: selectors.components.priceChart.getTime(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TimeFilters)
