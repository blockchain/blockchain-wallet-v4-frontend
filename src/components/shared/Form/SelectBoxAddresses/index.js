import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { assoc, map } from 'ramda'

import { actions, selectors } from 'data'
import { renameKeys } from 'services/RamdaCookingBook'
import { SelectBox } from 'components/generic/Form'

class SelectBoxAddressesContainer extends React.Component {
  render () {
    const { accounts, legacyAddresses, includeAll, ...rest } = this.props
    const allWallets = { text: 'All Wallets', value: '' }
    const elements = [
      { group: '', items: includeAll ? [allWallets, ...accounts] : accounts },
      { group: 'Imported addresses', items: legacyAddresses }
    ]

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
  const rawAccounts = selectors.core.common.getAccountsBalances(state)
  const accounts = [...map(renameKeys({title: 'text', address: 'value'}))([...rawAccounts])]
  const rawLegacyAddresses = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  const legacyAddresses = [...map(renameKeys({title: 'text', address: 'value'}))([...rawLegacyAddresses])]

  return {
    accounts,
    legacyAddresses
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBoxAddressesContainer)
