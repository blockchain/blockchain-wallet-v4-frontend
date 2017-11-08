import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { SelectInput } from 'blockchain-info-components'
import { selectors } from 'data'

class SelectBoxDefaultAccounts extends React.Component {
  render () {
    const { accounts, ...rest } = this.props
    const elements = []
    elements.push({ group: '', items: accounts })
    return <SelectInput elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcUnit(state)
  const currency = selectors.core.settings.getCurrency(state)
  const rates = selectors.core.data.bitcoin.getRates(state)

  const transformAddresses = items => map(item => {
    const { title, amount, ...rest } = item
    const display = coinDisplayed
      ? Exchange.displayBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit })
      : Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: currency, rates })

    return { text: `${title} (${display})`, value: rest }
  }, items)

  const accounts = transformAddresses(selectors.core.common.getAccountsBalances(state))

  return {
    accounts,
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxDefaultAccounts)
