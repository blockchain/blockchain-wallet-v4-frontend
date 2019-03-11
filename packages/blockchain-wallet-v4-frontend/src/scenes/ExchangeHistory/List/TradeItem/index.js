import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { formatTrade } from './selectors'
import TradeItem from './template'

const { RESULTS_MODAL } = model.components.exchangeHistory
const { VIEW_ORDER_DETAILS } = model.analytics.SWAP_EVENTS

class PagesContainer extends React.PureComponent {
  showDetails = () => {
    const { modalActions, deposit, isShapeShiftTrade } = this.props
    isShapeShiftTrade
      ? modalActions.showModal('ExchangeDetails', { depositAddress: deposit })
      : modalActions.showModal(RESULTS_MODAL, this.props)
    this.props.analyticsActions.logEvent(VIEW_ORDER_DETAILS)
  }

  render () {
    const {
      status,
      date,
      sourceCoin,
      targetCoin,
      deposit,
      depositAmount,
      withdrawalAmount
    } = this.props

    return (
      <TradeItem
        status={status}
        date={date}
        sourceCoin={sourceCoin}
        targetCoin={targetCoin}
        deposit={deposit}
        depositAmount={depositAmount}
        withdrawalAmount={withdrawalAmount}
        handleClick={this.showDetails}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => formatTrade(ownProps.trade)

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesContainer)
