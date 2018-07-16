import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import EthBalance from './template.success'

export class EthBalanceContainer extends PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh () {
    this.props.dataActions.fetchData()
  }

  render () {
    const {
      btcBalance,
      bchBalance,
      ethBalance,
      handleCoinDisplay,
      modalsActions
    } = this.props
    return (
      <EthBalance
        btcBalance={btcBalance}
        bchBalance={bchBalance}
        ethBalance={ethBalance}
        handleCoinDisplay={handleCoinDisplay}
        handleRefresh={this.handleRefresh}
        modalsActions={modalsActions}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(EthBalanceContainer)
