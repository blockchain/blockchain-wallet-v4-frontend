import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { curry, reduce, assoc, keys, map } from 'ramda'

import { actions, selectors } from 'data'
import RequestBitcoin from './RequestBitcoin.js'

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    this.selectAddress = this.selectAddress.bind(this)
    this.addresses = [...map(renameKeys({title: 'text', address: 'value'}))(this.props.balances)]
  }

  selectAddress (value) {
    if (this.props.addressFilter !== value) {
      // only dispatch if the filter changed
      this.props.actions.setAddressFilter(value)
    }
  }

  render () {
    return (
      <RequestBitcoin addresses={this.addresses} selectAddress={this.selectAddress} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const legacyAddressesBalances = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  return {
    balances: [...accountsBalances, ...legacyAddressesBalances]
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestBitcoinContainer)
