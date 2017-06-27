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
    this.changeAddress = this.changeAddress.bind(this)
    this.addresses = [
      { text: 'All Wallets', value: '' },
      ...map(renameKeys({title: 'text', address: 'value'}))(this.props.balances)
    ]
  }

  changeAddress (value) {
    this.props.tActions.setOnlyShow({onlyShow: value})
  }

  render () {
    return (
      <Transactions
        onlyShow={this.props.OnlyShow}
        changeAddress={this.changeAddress}
        addresses={this.addresses}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const legacyAddressesBalances = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  return {
    balances: [...accountsBalances, ...legacyAddressesBalances],
    onlyShow: selectors.core.transactions.getOnlyShow(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  tActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsContainer)
