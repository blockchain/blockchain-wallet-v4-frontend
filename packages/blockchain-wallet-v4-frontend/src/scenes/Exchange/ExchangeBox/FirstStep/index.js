import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { equals, path } from 'ramda'

import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    const { exchangeAccounts } = this.props
    const amount = this.props.amount || 0
    const sourceCoin = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.coin : 'BTC'
    const targetCoin = exchangeAccounts && exchangeAccounts.target ? exchangeAccounts.target.coin : 'ETH'

    this.state = { sourceCoin, targetCoin, amount }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const nextExchangeAccounts = nextProps.exchangeAccounts
    const nextAmount = nextProps.amount

    if (nextExchangeAccounts) {
      if (!equals(this.props.exchangeAccounts, nextExchangeAccounts)) {
        this.setState({
          sourceCoin: path(['source', 'coin'], nextExchangeAccounts),
          targetCoin: path(['target', 'coin'], nextExchangeAccounts)
        })
      }
    }

    if (nextAmount && !equals(this.props.amount, nextAmount)) {
      this.setState({
        amount: nextAmount
      })
    }
  }

  handleSubmit () {
    this.props.nextStep()
  }

  render () {
    const { exchangeAccounts, ...rest } = this.props

    return (
      <FirstStep
        sourceCoin={this.state.sourceCoin}
        targetCoin={this.state.targetCoin}
        sourceAmount={this.state.amount}
        handleSubmit={this.handleSubmit}
        {...rest} />
    )
  }
}

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts'),
  amount: formValueSelector('exchange')(state, 'amount')
})

export default connect(mapStateToProps)(FirstStepContainer)
