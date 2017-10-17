import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import wizardProvider from 'providers/WizardProvider'
import ThirdStep from './ThirdStep'
import { actions, selectors } from 'data'

class ThirdStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (event) {
    event.preventDefault()
    this.setState({ timestamp: new Date().getTime() })
    const { guid, email, newEmail, secretPhrase, message, code, captcha } = this.props
    const { sessionToken } = captcha

    this.props.reset2fa(guid, email, newEmail, secretPhrase, message, code, sessionToken)
  }

  render () {
    return <ThirdStep {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('reset2FA')(state, 'guid'),
  email: formValueSelector('reset2FA')(state, 'email'),
  newEmail: formValueSelector('reset2FA')(state, 'newEmail'),
  secretPhrase: formValueSelector('reset2FA')(state, 'secretPhrase'),
  message: formValueSelector('reset2FA')(state, 'message'),
  code: formValueSelector('reset2FA')(state, 'code'),
  captcha: selectors.core.captcha.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch)
})

const enhance = compose(
  wizardProvider('reset2FA', 3),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ThirdStepContainer)
