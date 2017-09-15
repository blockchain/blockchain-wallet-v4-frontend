import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepSetup from './template.js'

class TwoStepSetupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleGoogleAuthenticator = this.handleGoogleAuthenticator.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
    this.handleYubico = this.handleYubico.bind(this)
  }

  handleGoogleAuthenticator () {
    this.props.modalActions.showModal('TwoStepGoogleAuthenticator')
  }

  handleYubico () {
    this.props.modalActions.showModal('TwoStepYubico')
  }

  handleMobile () {
    const { smsNumber, smsVerified, alertActions, modalActions } = this.props

    if (!smsNumber) {
      modalActions.showModal('MobileNumberChange')
    } else if (!smsVerified) {
      modalActions.showModal('MobileNumberVerify', { mobileNumber: smsNumber })
    } else {
      alertActions.displaySuccess('Two Step Verification (Mobile) has been enabled.')
    }
  }

  render () {
    return (
      <TwoStepSetup
        {...this.props}
        handleGoogleAuthenticator={this.handleGoogleAuthenticator}
        handleMobile={this.handleMobile}
        handleYubico={this.handleYubico}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  enabled: false,
  smsNumber: selectors.core.settings.getSmsNumber(state),
  smsVerified: selectors.core.settings.getSmsVerified(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepSetup'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepSetupContainer)
