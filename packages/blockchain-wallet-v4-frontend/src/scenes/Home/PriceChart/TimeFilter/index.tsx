import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import React, { useEffect } from 'react'
import Tabs from './Tabs'

const TimeFilter = ({ actions, time }: Props) => {
  useEffect(() => {
    actions.timeClicked('day')
  }, [])

  const handleClick = (time: string) => {
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
