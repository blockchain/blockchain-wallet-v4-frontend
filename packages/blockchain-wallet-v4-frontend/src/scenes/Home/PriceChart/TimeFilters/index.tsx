import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import TimeFilters from './template'

export const TimeFiltersContainer = ({ actions, time }: Props) => (
  <TimeFilters time={time} handleClick={time => actions.timeClicked(time)} />
)

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(TimeFiltersContainer)
