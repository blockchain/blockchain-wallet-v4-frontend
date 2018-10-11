import React from 'react'
import { connect } from 'react-redux'
import BalancesTable from './template'
import { getData } from './selectors'

class BalancesTableContainer extends React.PureComponent {
  render () {
    const { currentTab, showLockbox } = this.props
    return <BalancesTable currentTab={currentTab} showLockbox={showLockbox} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(BalancesTableContainer)
