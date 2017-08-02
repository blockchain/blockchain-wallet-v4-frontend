import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'components/providers/ModalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleBack () {
    this.props.modalActions.sendQrCaptureError('dismissed')
  }

  handleScan (result) {
    if (result != null) this.props.modalActions.sendQrCaptureResult(result)
  }

  handleError (error) {
    this.props.modalActions.sendQrCaptureError(error)
  }

  render () {
    return (
      <QRCodeCapture
        {...this.props}
        onBack={this.handleBack}
        onScan={this.handleScan}
        onError={this.handleError}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

let enhance = compose(
  modalEnhancer('QRCodeCapture'),
  connect(void 0, mapDispatchToProps)
)

export default enhance(QRCodeCaptureContainer)
