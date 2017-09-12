import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleBack () { this.props.close() }

  handleScan (result) { if (result) this.props.interactivityActions.qrCodeCaptureSuccess(result) }

  handleError (error) { this.props.interactivityActions.qrCodeCaptureError(error) }

  render () {
    return (
      <QRCodeCapture
        {...this.props}
        handleBack={this.handleBack}
        handleScan={this.handleScan}
        handleError={this.handleError}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  interactivityActions: bindActionCreators(actions.interactivity, dispatch)
})

const enhance = compose(
  modalEnhancer('QRCodeCapture'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(QRCodeCaptureContainer)
