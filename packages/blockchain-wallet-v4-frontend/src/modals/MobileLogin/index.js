import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileLogin from './template.js'

class MobileLoginContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleScan (result) {
    if (result) { this.props.modalActions.scanMobileLoginSuccess(result) }
  }

  handleError (error) {
    this.props.modalActions.scanMobileLoginError(error)
  }

  handleCancel () {
    this.props.modalActions.clickMobileLoginCancel()
  }

  render () {
    return (
      <MobileLogin
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
  modalEnhancer('MobileLogin'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(MobileLoginContainer)
