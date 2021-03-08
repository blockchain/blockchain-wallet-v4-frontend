import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import TimeFilters from './template'

export const TimeFiltersContainer = ({ actions, time }) => (
  <TimeFilters time={time} handleClick={time => actions.timeClicked(time)} />
)

TimeFiltersContainer.propTypes = {
  time: PropTypes.string.isRequired
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeFiltersContainer)
