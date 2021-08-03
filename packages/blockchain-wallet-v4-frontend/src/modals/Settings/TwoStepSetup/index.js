import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import TwoStepSetup from './template.js'

class TwoStepSetupContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleGoogleAuthenticator = this.handleGoogleAuthenticator.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
    this.handleYubico = this.handleYubico.bind(this)
    this.handleDisable = this.handleDisable.bind(this)
  }

  handleGoogleAuthenticator() {
    this.props.settingsActions.showGoogleAuthenticatorSecretUrl()
  }

  handleYubico() {
    this.props.modalActions.showModal('TWO_STEP_YUBICO_MODAL')
  }

  handleMobile() {
    const { smsNumber, smsVerified } = this.props

    if (!smsNumber) {
      this.props.modalActions.showModal('MOBILE_NUMBER_ADD_MODAL')
    } else if (!smsVerified) {
      this.props.modalActions.showModal('MOBILE_NUMBER_VERIFY_MODAL', {
        mobileNumber: smsNumber
      })
    } else {
      this.props.settingsActions.enableTwoStepMobile()
    }
  }

  handleDisable() {
    this.props.settingsActions.disableTwoStep()
  }

  render() {
    return (
      <TwoStepSetup
        {...this.props}
        handleGoogleAuthenticator={this.handleGoogleAuthenticator}
        handleMobile={this.handleMobile}
        handleYubico={this.handleYubico}
        handleDisable={this.handleDisable}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  authType: selectors.core.settings.getAuthType(state),
  smsNumber: selectors.core.settings.getSmsNumber(state),
  smsVerified: selectors.core.settings.getSmsVerified(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('TWO_STEP_SETUP_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepSetupContainer)
