import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { assoc, map } from 'ramda'

import { actions, selectors } from 'data'
import { renameKeys } from 'services/RamdaCookingBook'
import FirstStep from './template.js'

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickCode = this.handleClickCode.bind(this)
    this.selectAddress = this.selectAddress.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
    this.props.modalActions.showModalRequestBitcoinStep2()
  }

  handleClickCode (event) {
    event.preventDefault()
    this.props.modalActions.showModalRequestBitcoinQRCode()
  }

  selectAddress (value) {
    if (this.props.addressFilter !== value) { this.props.transactionActions.setAddressFilter(value) }
  }

  render () {
    return <FirstStep
      show={this.props.show}
      nextAddress={this.props.nextAddress}
      handleClick={this.handleClick}
      handleClickCode={this.handleClickCode}
      addresses={this.props.addresses}
      selectAddress={this.selectAddress}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const legacyAddressesBalances = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  const allBalances = [...accountsBalances, ...legacyAddressesBalances]
  const addresses = [...map(renameKeys({title: 'text', address: 'value'}))(allBalances)]

  return {
    addresses: addresses
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestBitcoinContainer)
