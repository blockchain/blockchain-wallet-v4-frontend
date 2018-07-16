import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { selectors, actions } from 'data'
import TimeFilters from './template'

export const TimeFiltersContainer = props => (
  <TimeFilters
    time={props.time}
    handleClick={(time) => props.actions.timeClicked(time)}
  />
)

TimeFiltersContainer.propTypes = {
  time: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  time: selectors.components.priceChart.getTime(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TimeFiltersContainer)
