import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { curry, reduce, assoc, keys, map } from 'ramda'

import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import QRCode from './QRCode'

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickStep1 = this.handleClickStep1.bind(this)
    this.handleClickQrCode = this.handleClickQrCode.bind(this)
    this.handleClickStep2 = this.handleClickStep2.bind(this)
    this.selectAddress = this.selectAddress.bind(this)
  }

  handleClickStep1 (event) {
    event.preventDefault()
    this.props.modalActions.showModalRequestBitcoinStep2()
  }

  handleClickStep2 (event) {
    this.props.modalActions.closeModal()
  }

  handleClickQrCode (event) {
    event.preventDefault()
    this.props.modalActions.showModalRequestBitcoinQRCode()
  }

  selectAddress (value) {
    if (this.props.addressFilter !== value) {
      this.props.transactionActions.setAddressFilter(value)
    }
  }

  render () {
    console.log(this.props)
    switch (this.props.type) {
      case 'requestBitcoinStep2':
        return <SecondStep
          show={this.props.show}
        />
      case 'requestBitcoinQRCode':
        return <QRCode
          show={this.props.show}
        />
      default:
        return <FirstStep
          show={this.props.show}
          addresses={this.props.addresses}
          selectAddress={this.selectAddress}
          handleClickStep1={this.handleClickStep1}
          handleClickQrCode={this.handleClickQrCode}
        />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.getAccountsBalances(state)
  const legacyAddressesBalances = map(assoc('group', 'Imported Addresses'), selectors.core.common.getAddressesBalances(state))
  const allBalances = [...accountsBalances, ...legacyAddressesBalances]
  const addresses = [...map(renameKeys({title: 'text', address: 'value'}))(allBalances)]
  return {
    show: selectors.modals.getShow(state),
    animation: selectors.modals.getAnimation(state),
    type: selectors.modals.getType(state),
    addresses: addresses
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestBitcoinContainer)
