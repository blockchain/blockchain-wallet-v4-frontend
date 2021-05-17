import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'

import SecondStep from './template'

class SecondStepContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    const { captcha, code, email, guid, message, newEmail, secretPhrase } = this.props
    const { sessionToken } = captcha.getOrElse({})

    this.props.authActions.reset2fa(
      guid,
      email,
      newEmail,
      secretPhrase,
      message,
      code,
      sessionToken
    )
  }

  render() {
    const { data } = this.props
    const busy = data.cata({
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false,
      Success: () => {
        this.props.nextStep()
        return false
      }
    })

    return (
      <SecondStep
        {...this.props}
        fetchNewCaptcha={this.fetchNewCaptcha}
        onSubmit={this.onSubmit}
        busy={busy}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  captcha: '12',
  code: formValueSelector('reset2FA')(state, 'code'),
  data: selectors.auth.getReset2fa(state),
  email: formValueSelector('reset2FA')(state, 'email'),
  guid: formValueSelector('reset2FA')(state, 'guid'),
  message: formValueSelector('reset2FA')(state, 'message'),
  newEmail: formValueSelector('reset2FA')(state, 'newEmail'),
  secretPhrase: formValueSelector('reset2FA')(state, 'secretPhrase')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
