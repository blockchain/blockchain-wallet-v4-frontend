import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import BtcBalance from './template.success'

export class BtcBalanceContainer extends PureComponent {
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
      btcAccountsLength,
      handleCoinDisplay,
      modalsActions,
      partner
    } = this.props
    return (
      <BtcBalance
        btcAccountsLength={btcAccountsLength}
        btcBalance={btcBalance}
        bchBalance={bchBalance}
        ethBalance={ethBalance}
        handleCoinDisplay={handleCoinDisplay}
        handleRefresh={this.handleRefresh}
        modalsActions={modalsActions}
        partner={partner}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BtcBalanceContainer)
