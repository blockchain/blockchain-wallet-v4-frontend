import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'components/providers/modalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
  }

  handleBack () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <QRCodeCapture {...this.props} handleBack={this.handleBack} />
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
