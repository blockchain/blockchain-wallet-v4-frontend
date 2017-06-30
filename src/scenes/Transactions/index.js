import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { selectors, actions } from 'data'
import Transactions from './template.js'
import { curry, reduce, assoc, keys, map } from 'ramda'

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

class TransactionsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
    this.addresses = [
      { text: 'All Wallets', value: '' },
      ...map(renameKeys({title: 'text', address: 'value'}))(this.props.balances)
    ]
    this.selectType = this.selectType.bind(this)
    this.types = [
      { text: 'All', value: '' },
      { text: 'Received', value: 'received' },
      { text: 'Sent', value: 'sent' },
      { text: 'Transferred', value: 'transferred' }
    ]
    this.selectSearch = this.selectSearch.bind(this)
  }

  selectAddress (value) {
    if (this.props.addressFilter !== value) {
      // only dispatch if the filter changed
      this.props.actions.setAddressFilter(value)
    }
  }

  selectType (value) {
    this.props.actions.setTypeFilter(value)
  }

  selectSearch (value) {
    this.props.actions.setSearchFilter(value)
  }

  render () {
    return (
      <Transactions
        addressFilter={this.props.addressFilter}
        selectAddress={this.selectAddress}
        addresses={this.addresses}

        typeFilter={this.props.typeFilter}
        selectType={this.selectType}
        types={this.types}

        searchFilter={this.props.searchFilter}
        selectSearch={this.selectSearch}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const legacyAddressesBalances = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  return {
    balances: [...accountsBalances, ...legacyAddressesBalances],
    addressFilter: selectors.core.transactions.getAddressFilter(state),
    typeFilter: selectors.core.transactions.getTypeFilter(state),
    searchFilter: selectors.core.transactions.getSearchFilter(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsContainer)
