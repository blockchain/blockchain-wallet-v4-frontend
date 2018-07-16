import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import BchBalance from './template.success'

export class BchBalanceContainer extends PureComponent {
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
      bchAccountsLength,
      handleCoinDisplay,
      modalsActions
    } = this.props
    return (
      <BchBalance
        bchAccountsLength={bchAccountsLength}
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

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.core.data.bch, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BchBalanceContainer)
