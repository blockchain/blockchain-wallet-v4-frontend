import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formatTrade } from './selectors'
import React from 'react'
import TradeItem from './template'

const { RESULTS_MODAL } = model.components.exchangeHistory

class PagesContainer extends React.PureComponent {
  showDetails = () => {
    const { modalActions } = this.props

    modalActions.showModal(RESULTS_MODAL, this.props)
  }

  render () {
    const {
      coinModels,
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
        coinModels={coinModels}
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PagesContainer)
