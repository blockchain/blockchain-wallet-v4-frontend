import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import QRCodeCapture from './template.js'

class QRCodeContainer extends React.PureComponent {
  render () {
    return <QRCodeCapture {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('QRCode'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(QRCodeContainer)
