import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, isEmpty } from 'ramda'

import { selectors } from 'data'
import { displayCoin, displayFiat } from 'services/ConversionService'
import { SelectInput } from 'blockchain-info-components'

class SelectBoxAddresses extends React.Component {
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

SelectBoxAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  const network = 'bitcoin'
  const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcCurrency(state)
  const currency = selectors.core.settings.getCurrency(state)
  const rates = selectors.core.rates.getRates(state)

  const transformAddresses = items => map(item => {
    const { title, amount, ...rest } = item
    const amountDisplay = coinDisplayed ? displayCoin(network, amount, unit).getOrElse('N/A') : displayFiat(network, amount, currency, rates).getOrElse('N/A')
    return { text: `${title} (${amountDisplay})`, value: rest }
  }, items)

  const accounts = transformAddresses(selectors.core.common.getAccountsBalances(state))
  const legacyAddresses = transformAddresses(selectors.core.common.getAddressesBalances(state))

  return {
    accounts,
    legacyAddresses,
    network,
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxAddresses)
