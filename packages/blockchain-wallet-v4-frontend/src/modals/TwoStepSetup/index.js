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
    this.handleDisable = this.handleDisable.bind(this)
  }

  handleGoogleAuthenticator () {
    this.props.modalActions.clickTwoStepSetupGoogleAuthenticator()
  }

  handleYubico () {
    this.props.modalActions.clickTwoStepSetupYubico()
  }

  handleMobile () {
    this.props.modalActions.clickTwoStepSetupMobile()
  }

  handleDisable () {
    this.props.modalActions.clickTwoStepSetupDisable()
  }

  render () {
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
  authType: selectors.core.settings.getAuthType(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepSetup'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepSetupContainer)
