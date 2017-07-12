import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { assoc, map } from 'ramda'

import { actions, selectors } from 'data'
import { renameKeys } from 'services/RamdaCookingBook'
import { SelectBox } from 'components/generic/Form'

class DropdownAddressesContainer extends React.Component {
  render () {
    const items = this.props.includeAll
      ? [{ text: 'All Wallets', value: '' }, ...this.props.addresses]
      : this.props.addresses
    const { addresses, ...rest } = this.props

    return <SelectBox items={items} {...rest} />
  }
}

DropdownAddressesContainer.propTypes = {
  includeAll: PropTypes.bool
}

DropdownAddressesContainer.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  const accounts = selectors.core.common.getAccountsBalances(state)
  const legacyAddresses = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  const addresses = [...map(renameKeys({title: 'text', address: 'value'}))([...accounts, ...legacyAddresses])]

  return {
    addresses: addresses
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DropdownAddressesContainer)
