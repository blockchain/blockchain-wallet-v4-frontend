import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
import { prop, toLower } from 'ramda'

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
    console.log(this.props.exchangeAccounts)
    const { exchangeAccounts, amount, sourceAddress, targetAddress } = this.props
    const { source, target } = exchangeAccounts
    const sourceCoin = source.coin
    const targetCoin = target.coin
    const pair = toLower(sourceCoin + '_' + targetCoin)
    console.log(source, target)
    console.log(amount)
    console.log({
      depositAmount: amount,
      pair,
      returnAddress: sourceAddress,
      withdrawal: targetAddress
    })

    this.props.shapeShiftActions.createOrder({
      depositAmount: this.props.amount,
      pair,
      returnAddress: sourceAddress,
      withdrawal: targetAddress
    })
  }

  onSubmit () {
    // Submit exchange
  }

  render () {
    const { exchangeAccounts, amount, sourceAddress, targetAddress, ...rest } = this.props
    const { source, target } = exchangeAccounts
    const { minerFee, quotedRate } = this.props.order
    console.log(this.props.order)
    console.log('Miner fee is ', minerFee)
    console.log('Quoted rate is ', quotedRate)
    const txFee = 0 // To be computed
    const received = prop('value', Exchange.convertCoinToCoin({ value: amount * quotedRate - minerFee, coin: target.coin, baseToStandard: false }))
    const sourceAmount = prop('value', Exchange.convertCoinToCoin({ value: amount, coin: source.coin, baseToStandard: false }))
    const minerFeeBase = prop('value', Exchange.convertCoinToCoin({ value: minerFee, coin: target.coin, baseToStandard: false }))

    return (
      <SecondStep
        {...rest}
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
        source />
    )
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
  const f = selectors.core.wallet.getAccountLabel(state)
  const g = selectors.core.wallet.getLegacyAddressLabel(state)
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
  shapeShiftActions: bindActionCreators(actions.payment.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
