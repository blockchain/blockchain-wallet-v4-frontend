import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { isEmpty, isNil } from 'ramda'
import bip21 from 'bip21'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleScan (result) {
    if (!isNil(result) && !isEmpty(result)) {
      const { address, options } = bip21.decode(result)
      const { amount, message } = options
      this.props.alertActions.displayError('QRCode has been successfully read.')
      this.props.reduxFormActions.change('sendBitcoin', 'to', address)
      this.props.reduxFormActions.change('sendBitcoin', 'amount', amount)
      this.props.reduxFormActions.change('sendBitcoin', 'message', message)
      this.props.modalActions.closeModal()
    }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) {
      this.props.alertActions.displayError(error)
      this.props.modalActions.closeModal()
    }
  }

  render () {
    return <QRCodeCapture {...this.props} handleScan={this.handleScan} handleError={this.handleError} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  modalEnhancer('QRCodeCapture'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(QRCodeCaptureContainer)
