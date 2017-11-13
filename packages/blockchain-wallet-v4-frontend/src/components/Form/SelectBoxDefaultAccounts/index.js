import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { SelectInput } from 'blockchain-info-components'
import { selectors } from 'data'

class SelectBoxDefaultAccounts extends React.Component {
  render () {
    const { btcAccounts, ethAccount, ...rest } = this.props
    const elements = []
    elements.push({ group: '', items: btcAccounts })
    elements.push({ group: '', items: ethAccount })
    return <SelectInput elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcUnit(state)
  const currency = selectors.core.settings.getCurrency(state)
  const btcRates = selectors.core.data.bitcoin.getRates(state)
  const ethRates = selectors.core.data.ethereum.getRates(state)

  const transformAddresses = items => map(item => {
    const { title, amount, ...rest } = item
    const display = coinDisplayed
      ? Exchange.displayBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit })
      : Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: currency, rates: btcRates })

    return { text: `${title} (${display})`, value: rest }
  }, items)

  const transformEthBalance = balance => {
    const display = coinDisplayed
      ? Exchange.displayEtherToEther({value: balance, fromUnit: 'WEI', toUnit: 'ETH'})
      : Exchange.displayEtherToFiat({ value: balance, fromUnit: 'WEI', toCurrency: currency, rates: ethRates })

    return [{ text: `My Ether Wallet (${display})`, value: 0 }]
  }

  const btcAccounts = transformAddresses(selectors.core.common.getAccountsBalances(state))
  const ethAccount = transformEthBalance(selectors.core.data.ethereum.getBalance(state))

  return {
    btcAccounts,
    ethAccount,
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxDefaultAccounts)
