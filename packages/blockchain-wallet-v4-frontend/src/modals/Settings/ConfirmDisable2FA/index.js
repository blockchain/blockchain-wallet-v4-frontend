import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ConfirmDisable2FA from './template.js'

class ConfirmDisable2FAContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue() {
    this.props.securityCenterActions.disableTwoStep()
  }

  render() {
    return (
      <ConfirmDisable2FA {...this.props} handleContinue={this.handleContinue} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('ConfirmDisable2FA'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(ConfirmDisable2FAContainer)
