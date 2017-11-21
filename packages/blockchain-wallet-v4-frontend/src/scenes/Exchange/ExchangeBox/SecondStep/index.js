import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { toLower } from 'ramda'
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

    const sourceAddress = source.address || source.xpub
    const targetAddress = target.address || target.xpub
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
    const received = amount * quotedRate - txFee

    return (
      <SecondStep
        {...rest}
        sourceAddress={sourceAddress}
        targetAddress={targetAddress}
        sourceAmount={amount}
        sourceCoin={source.coin}
        targetCoin={target.coin}
        onSubmit={this.onSubmit}
        minerFee={minerFee}
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
