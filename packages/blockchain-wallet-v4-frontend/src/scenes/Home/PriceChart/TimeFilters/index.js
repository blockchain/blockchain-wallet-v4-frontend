import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import PropTypes from 'prop-types'
import React from 'react'
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
