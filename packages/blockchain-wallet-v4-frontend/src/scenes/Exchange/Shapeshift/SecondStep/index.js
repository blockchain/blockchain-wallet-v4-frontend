import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'

import { prop, toLower } from 'ramda'
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
    const { source, target } = this.props.exchangeAccounts
    const sourceCoin = source.coin
    const targetCoin = target.coin
    const pair = toLower(sourceCoin + '_' + targetCoin)
    console.log(source, target)

    const sourceAddress = source.addr || source.xpub
    const targetAddress = target.addr || target.xpub
    console.log(this.props.amount)
    console.log({
      depositAmount: this.props.amount,
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
    const { exchangeAccounts, amount, ...rest } = this.props
    const { source, target } = exchangeAccounts
    const sourceAddress = source.address || source.xpub
    const targetAddress = target.address || target.xpub
    const { minerFee, quotedRate } = this.props.order
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

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts'),
  amount: formValueSelector('exchange')(state, 'amount'),
  order: selectors.core.data.shapeShift.getOrder(state)
})

const mapDispatchToProps = (dispatch) => ({
  shapeShiftActions: bindActionCreators(actions.payment.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
