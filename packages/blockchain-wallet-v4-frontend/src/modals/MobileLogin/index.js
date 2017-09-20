import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileLogin from './template.js'

class MobileLoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleCapture = this.handleCapture.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleCapture (result) {
    if (result) { this.props.modalActions.captureMobileLoginSuccess(result) }
  }

  handleError (error) {
    this.props.modalActions.captureMobileLoginError(error)
  }

  handleCancel () {
    this.props.modalActions.clickMobileLoginCancel()
  }

  render () {
    return (
      <MobileLogin
        {...this.props}
        handleCapture={this.handleCapture}
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
  modalEnhancer('MobileLogin'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(MobileLoginContainer)
