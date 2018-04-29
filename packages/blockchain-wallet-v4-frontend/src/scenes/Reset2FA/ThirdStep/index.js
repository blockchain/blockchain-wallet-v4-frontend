import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import ThirdStep from './template'
import { actions, selectors } from 'data'

class ThirdStepContainer extends React.PureComponent {
  static getDerivedStateFromProps (props) {
    if (props.reset2faError) return { busy: false }
  }

  constructor (props) {
    super(props)
    this.state = { busy: false }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.authActions.reset2faError(false)
    this.setState({ timestamp: new Date().getTime(), busy: true })
    const { guid, email, newEmail, secretPhrase, message, code, captcha } = this.props
    const { sessionToken } = captcha.getOrElse({})

    this.props.authActions.reset2fa(guid, email, newEmail, secretPhrase, message, code, sessionToken)
  }

  render () {
    const { busy } = this.state

    return <ThirdStep {...this.props} onSubmit={this.onSubmit} busy={busy} />
  }
}

const mapStateToProps = (state) => ({
  guid: formValueSelector('reset2FA')(state, 'guid'),
  email: formValueSelector('reset2FA')(state, 'email'),
  newEmail: formValueSelector('reset2FA')(state, 'newEmail'),
  secretPhrase: formValueSelector('reset2FA')(state, 'secretPhrase'),
  message: formValueSelector('reset2FA')(state, 'message'),
  code: formValueSelector('reset2FA')(state, 'code'),
  captcha: selectors.core.data.misc.getCaptcha(state),
  reset2faError: selectors.auth.getReset2faError(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
