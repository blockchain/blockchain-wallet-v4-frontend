import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions } from 'redux-form'

import { actions } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      feeEditDisplayed: false,
      addressesSelectDisplayed: false
    }

    this.handleSelectFrom = this.handleSelectFrom.bind(this)
    this.handleClickAddressesSelect = this.handleClickAddressesSelect.bind(this)
    this.handleToggleAddressesSelect = this.handleToggleAddressesSelect.bind(this)
    this.handleToggleFeeEdit = this.handleToggleFeeEdit.bind(this)
    this.handleToggleQrCodeCapture = this.handleToggleQrCodeCapture.bind(this)

    this.handleQrCodeScan = this.handleQrCodeScan.bind(this)
    this.handleQrCodeError = this.handleQrCodeError.bind(this)
    this.handleQrCodeBack = this.handleQrCodeBack.bind(this)
  }

  handleSelectFrom (value) {
    this.props.paymentActions.getUnspents(value)
  }

  handleClickAddressesSelect () {
    this.setState({ addressesSelectDisplayed: false })
  }

  handleToggleAddressesSelect () {
    this.setState({ addressesSelectDisplayed: !this.state.addressesSelectDisplayed })
  }

  handleToggleFeeEdit () {
    this.setState({ feeEditDisplayed: !this.state.feeEditDisplayed })
  }

  handleToggleQrCodeCapture () {
    this.props.modalActions.showModalQRCodeCapture(this.handleQrCodeScan, this.handleQrCodeError, this.handleQrCodeBack)
  }

  handleQrCodeScan (data) {
    if (data) {
      this.props.alertActions.displaySuccess(data)
      this.props.reduxFormActions.change('sendBitcoin', 'to', data)
      this.props.modalActions.showModalSendBitcoin()
    }
  }

  handleQrCodeError (error) {
    this.props.alertActions.displayError(error)
  }

  handleQrCodeBack () {
    this.props.modalActions.showModalSendBitcoin()
  }

  render () {
    return (<FirstStep
      onSelectFrom={this.handleSelectFrom}
      addressesSelectDisplayed={this.state.addressesSelectDisplayed}
      feeEditDisplayed={this.state.feeEditDisplayed}
      handleClickAddressesSelect={this.handleClickAddressesSelect}
      handleToggleAddressesSelect={this.handleToggleAddressesSelect}
      handleToggleFeeEdit={this.handleToggleFeeEdit}
      handleToggleQrCodeCapture={this.handleToggleQrCodeCapture}
      {...this.props}
    />)
  }
}

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FirstStepContainer)
