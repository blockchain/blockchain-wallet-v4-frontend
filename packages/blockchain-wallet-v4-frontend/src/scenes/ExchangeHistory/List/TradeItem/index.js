import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { formatTrade, getData } from './selectors'
import TradeItem from './template'

const { RESULTS_MODAL } = model.components.exchangeHistory

class PagesContainer extends React.PureComponent {
  showDetails = () => {
    const {
      modalActions,
      useShapeShift,
      deposit,
      status,
      sourceCoin,
      targetCoin,
      depositAmount,
      withdrawalAmount
    } = this.props
    useShapeShift
      ? modalActions.showModal('ExchangeDetails', { depositAddress: deposit })
      : modalActions.showModal(RESULTS_MODAL, {
          status,
          sourceCoin,
          targetCoin,
          sourceAmount: depositAmount,
          targetAmount: withdrawalAmount
        })
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

const mapStateToProps = (state, ownProps) => ({
  ...formatTrade(ownProps.trade),
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesContainer)
