import { connect } from 'react-redux'
import { getData } from './selectors'
import BalancesTable from './template'
import React from 'react'

type LinkStatePropsType = {
  currentTab: 'total' | 'wallet' | 'lockbox'
}

class BalancesTableContainer extends React.PureComponent<LinkStatePropsType> {
  render () {
    const { currentTab } = this.props
    return <BalancesTable currentTab={currentTab} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(BalancesTableContainer)
