import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import modalEnhancer from 'providers/ModalEnhancer'

import { actions } from 'data'
import QrCode from './template.js'

class QrCodeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
  }

  handleBack () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <QrCode {...this.props} handleBack={this.handleBack} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('QRCode'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(QrCodeContainer)
