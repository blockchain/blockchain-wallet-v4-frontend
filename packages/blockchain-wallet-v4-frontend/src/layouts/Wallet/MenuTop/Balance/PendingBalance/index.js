import React from 'react'
import Template from './template'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { gt } from 'ramda'

class Balance extends React.PureComponent {
  render () {
    const { sfoxPendingBalance } = this.props
    const totalPendingBalance = sfoxPendingBalance.getOrElse(0)
    return gt(totalPendingBalance, 0) && <Template />
  }
}

const mapStateToProps = state => ({
  sfoxPendingBalance: getData(state)
})

export default connect(mapStateToProps)(Balance)
