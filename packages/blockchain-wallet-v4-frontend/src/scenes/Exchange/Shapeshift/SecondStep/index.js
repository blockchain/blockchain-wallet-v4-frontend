import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
import { equals, prop, toLower } from 'ramda'

import settings from 'config'
import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    // Make request to shapeShift to create order
    const { exchangeAccounts, amount, sourceAddress, targetAddress } = this.props
    const { source, target } = exchangeAccounts
    const sourceCoin = source.coin
    const targetCoin = target.coin
    const pair = toLower(sourceCoin + '_' + targetCoin)

    this.props.exchangeActions.createOrder({
      depositAmount: this.props.amount,
      pair,
      returnAddress: sourceAddress,
      withdrawal: targetAddress
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.order, nextProps.order)) {
      const error = prop('error', nextProps.order)
      if (error) {
        this.props.alertActions.displayError(error)
        this.props.previousStep()
      }
    }
  }

  onSubmit () {
    // Submit exchange
  }

  render () {
    const { exchangeAccounts, amount, sourceAddress, targetAddress, ...rest } = this.props
    const { source, target } = exchangeAccounts
    const { success } = this.props.order
    if (success) {
      const { expiration, minerFee, quotedRate, withdrawalAmount } = success
      const timeLeft = expiration - new Date().getTime()
      const txFee = 0 // To be computed
      const sourceAmount = prop('value', Exchange.convertCoinToCoin({ value: amount, coin: source.coin, baseToStandard: false }))
      const minerFeeBase = prop('value', Exchange.convertCoinToCoin({ value: minerFee, coin: target.coin, baseToStandard: false }))
      const received = prop('value', Exchange.convertCoinToCoin({ value: withdrawalAmount, coin: target.coin, baseToStandard: false }))
      return (
        <SecondStep
          {...rest}
          isLoading={false}
          sourceAddress={sourceAddress}
          targetAddress={targetAddress}
          sourceAmount={sourceAmount}
          sourceCoin={source.coin}
          targetCoin={target.coin}
          onSubmit={this.onSubmit}
          minerFee={minerFeeBase}
          txFee={txFee}
          rate={quotedRate}
          received={received}
          timeLeft={timeLeft}
          source />
      )
    } else {
      return (
        <SecondStep
          isLoading
        />
      )
    }
  }
}

const extractAddress = (value, selectorFunction) =>
  value
    ? value.addr
      ? value.addr
      : selectorFunction(value.index)
    : undefined

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const exchangeAccounts = formValueSelector('exchange')(state, 'accounts')
  const { source, target } = exchangeAccounts

  return {
    exchangeAccounts,
    amount: formValueSelector('exchange')(state, 'amount'),
    order: selectors.core.data.shapeShift.getOrder(state),
    targetAddress: prop('addr', target) || extractAddress(exchangeAccounts.target, getReceive),
    sourceAddress: prop('addr', source) || extractAddress(exchangeAccounts.source, getReceive)

  }
}

const mapDispatchToProps = (dispatch) => ({
  exchangeActions: bindActionCreators(actions.components.exchange, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
