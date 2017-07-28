import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { map, isEmpty } from 'ramda'

import { actions, selectors } from 'data'
import { displayCoin, displayFiat } from 'services/ConversionService'
import { SelectBox } from 'components/generic/Form'

class SelectBoxAddressesContainer extends React.Component {
  render () {
    const { accounts, legacyAddresses, includeAll, ...rest } = this.props
    const allWallets = { text: 'All Wallets', value: '' }
    const elements = []
    elements.push({ group: '', items: includeAll ? [allWallets, ...accounts] : accounts })
    if (!isEmpty(legacyAddresses)) {
      elements.push({ group: 'Imported addresses', items: legacyAddresses })
    }

    return <SelectBox elements={elements} {...rest} />
  }
}

SelectBoxAddressesContainer.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxAddressesContainer.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  const network = 'bitcoin'
  const coinDisplayed = selectors.ui.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcCurrency(state)
  const currency = selectors.core.settings.getCurrency(state)

  const transformAddresses = items => map(item => {
    const { title, amount, ...rest } = item
    const amountDisplay = coinDisplayed ? displayCoin(network, amount, unit).getOrElse('N/A') : displayFiat(amount, currency).getOrElse('N/A')
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

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBoxAddressesContainer)
