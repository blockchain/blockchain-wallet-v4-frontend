import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    const { exchangeAccounts } = this.props
    const amount = this.props.amount || 0
    const sourceCoin = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.coin : 'BTC'
    const targetCoin = exchangeAccounts && exchangeAccounts.target ? exchangeAccounts.target.coin : 'ETH'
    this.handleNext = this.handleNext.bind(this)
    this.state = { sourceCoin, targetCoin, amount }
  }

  componentWillReceiveProps (nextProps) {
    const nextExchangeAccounts = nextProps.exchangeAccounts
    const nextAmount = nextProps.amount

    if (nextExchangeAccounts) {
      if (!equals(this.props.exchangeAccounts, nextExchangeAccounts)) {
        this.setState({
          sourceCoin: nextExchangeAccounts.source.coin,
          targetCoin: nextExchangeAccounts.target.coin
        })
      }
    }

    if (nextAmount && !equals(this.props.amount, nextAmount)) {
      this.setState({
        amount: nextAmount
      })
    }
  }

  handleNext () {
    this.props.nextStep()
  }

  render () {
    const { exchangeAccounts, ...rest } = this.props

    return (
      <FirstStep
        sourceCoin={this.state.sourceCoin}
        targetCoin={this.state.targetCoin}
        sourceAmount={this.state.amount}
        handleNext={this.handleNext}
        {...rest} />
    )
  }
}

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts'),
  amount: formValueSelector('exchange')(state, 'amount')
})

export default connect(mapStateToProps)(FirstStepContainer)
