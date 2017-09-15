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
  }

  handleScan (result) { if (result) this.props.interactivityActions.mobileLoginSuccess(result) }

  handleError (error) { this.props.interactivityActions.mobileLoginError(error) }

  render () {
    return (
      <MobileLogin
        {...this.props}
        handleScan={this.handleScan}
        handleError={this.handleError}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  interactivityActions: bindActionCreators(actions.interactivity, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileLogin'),
  connect(void 0, mapDispatchToProps)
)

export default enhance(MobileLoginContainer)
