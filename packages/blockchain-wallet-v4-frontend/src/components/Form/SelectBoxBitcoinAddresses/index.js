import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, isEmpty } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { SelectInput } from 'blockchain-info-components'
import { selectors } from 'data'

class SelectBoxBitcoinAddresses extends React.Component {
  render () {
    const { accounts, legacyAddresses, includeAll, ...rest } = this.props
    const allWallets = { text: 'All Wallets', value: '' }
    const elements = []
    elements.push({ group: '', items: includeAll ? [allWallets, ...accounts] : accounts })
    if (!isEmpty(legacyAddresses)) {
      elements.push({ group: 'Imported addresses', items: legacyAddresses })
    }
    return <SelectInput elements={elements} {...rest} />
  }
}

SelectBoxBitcoinAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBitcoinAddresses.defaultProps = {
  includeAll: true
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
  const legacyAddresses = transformAddresses(selectors.core.common.getAddressesBalances(state))

  return {
    accounts,
    legacyAddresses,
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxBitcoinAddresses)
