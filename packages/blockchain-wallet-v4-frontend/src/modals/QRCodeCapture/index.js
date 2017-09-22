import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { isEmpty, isNil } from 'ramda'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleScan (result) {
    if (!isNil(result) && !isEmpty(result)) { this.props.modalActions.scanQRCodeCaptureSuccess(result) }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) { this.props.modalActions.scanQRCodeCaptureError(error) }
  }

  handleCancel () {
    this.props.modalActions.clickQRCodeCaptureCancel()
  }

  render () {
    return (
      <QRCodeCapture
        {...this.props}
        handleScan={this.handleScan}
        handleError={this.handleError}
        handleCancel={this.handleCancel}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('QRCodeCapture'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(QRCodeCaptureContainer)
