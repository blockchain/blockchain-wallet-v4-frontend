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
    const {
      captcha,
      code,
      email,
      guid,
      message,
      newEmail,
      secretPhrase
    } = this.props
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
    let busy = data.cata({
      Success: () => {
        this.props.nextStep()
        return false
      },
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false
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

const mapStateToProps = state => ({
  guid: formValueSelector('reset2FA')(state, 'guid'),
  email: formValueSelector('reset2FA')(state, 'email'),
  newEmail: formValueSelector('reset2FA')(state, 'newEmail'),
  secretPhrase: formValueSelector('reset2FA')(state, 'secretPhrase'),
  message: formValueSelector('reset2FA')(state, 'message'),
  code: formValueSelector('reset2FA')(state, 'code'),
  captcha: selectors.core.data.misc.getCaptcha(state),
  data: selectors.auth.getReset2fa(state)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
