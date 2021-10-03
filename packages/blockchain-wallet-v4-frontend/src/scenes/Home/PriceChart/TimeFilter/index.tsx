import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { TimeRange } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Tabs from './Tabs'

const TimeFilter = ({ actions, time }: Props) => {
  useEffect(() => {
    actions.timeClicked(TimeRange.DAY)
  }, [])

  const handleClick = (time: TimeRange) => {
    actions.timeClicked(time)
  }

  return <Tabs currentTab={time} handleClick={handleClick} />
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(TimeFilter)
