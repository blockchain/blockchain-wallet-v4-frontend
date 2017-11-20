import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    const { exchangeAccounts } = this.props
    const sourceCoin = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.coin : 'BTC'
    const targetCoin = exchangeAccounts && exchangeAccounts.target ? exchangeAccounts.target.coin : 'ETH'
    const sourceAmount = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.amount : 0
    this.onSubmit = this.onSubmit.bind(this)
    this.state = { sourceCoin, targetCoin, sourceAmount }
  }

  componentWillReceiveProps (nextProps) {
    const { nextExchangeAccounts } = nextProps.exchangeAccounts
    console.log(nextExchangeAccounts)

    if (nextExchangeAccounts) {
      if (!equals(this.props.exchangeAccounts, nextExchangeAccounts)) {
        this.setState({
          sourceCoin: nextExchangeAccounts.source.coin,
          targetCoin: nextExchangeAccounts.target.coin,
          sourceAddress: nextExchangeAccounts.source.coin === 'ETH' ? nextExchangeAccounts.source.address : nextExchangeAccounts.source.xpub,
          sourceAmount: nextExchangeAccounts.source.amount
        })
      }
    }
  }

  onSubmit () {
    // Make request to shapeShift to create order
    this.props.nextStep()
  }

  render () {
    const { exchangeAccounts, ...rest } = this.props

    console.log(exchangeAccounts)
    console.log(this.state.sourceAmount)

    return (
      <FirstStep
        sourceCoin={this.state.sourceCoin}
        targetCoin={this.state.targetCoin}
        sourceAmount={this.state.amount}
        {...rest} />
    )
  }
}

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts')
})

export default connect(mapStateToProps)(FirstStepContainer)
