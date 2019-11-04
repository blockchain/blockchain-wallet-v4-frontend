import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import TimeFilters from './template'

export const TimeFiltersContainer = ({ actions, isSilverOrAbove, time }) => (
  <TimeFilters
    isSilverOrAbove={isSilverOrAbove}
    time={time}
    handleClick={time => actions.timeClicked(time)}
  />
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
