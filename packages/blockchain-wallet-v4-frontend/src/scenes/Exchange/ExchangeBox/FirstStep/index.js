import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  render () {
    const { exchangeAccounts, ...rest } = this.props
    const sourceCoin = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.coin : 'BTC'
    const targetCoin = exchangeAccounts && exchangeAccounts.target ? exchangeAccounts.target.coin : 'ETH'

    console.log(exchangeAccounts)
    console.log(sourceCoin)

    return (
      <FirstStep sourceCoin={sourceCoin} targetCoin={targetCoin} {...rest} />
    )
  }
}

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts')
})

export default connect(mapStateToProps)(FirstStepContainer)
