import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import QRCodeStep from './QRCodeStep'

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
    switch (this.props.type) {
      case 'requestBitcoinStep2':
        return <SecondStep show={this.props.show} />
      case 'requestBitcoinQRCode':
        return <QRCodeStep show={this.props.show} />
      default:
        return <FirstStep show={this.props.show} nextAddress={this.props.nextAddress} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    show: selectors.modals.getShow(state),
    type: selectors.modals.getType(state),
    nextAddress: '1BxGpZ4JDmfncucQkKi4gB77hXcq7aFhve'
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestBitcoinContainer)
