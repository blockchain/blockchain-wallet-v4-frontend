import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepGoogleAuthenticator from './template.js'

class TwoStepGoogleAuthenticatorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.settingsActions.enableTwoStepGoogleAuthenticator(this.props.code)
  }

  render () {
    return <TwoStepGoogleAuthenticator {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  code: formValueSelector('twoStepGoogleAuthenticator')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  alertsActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepGoogleAuthenticator'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepGoogleAuthenticatorContainer)
