import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import ThirdStep from './template'
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
    const { sessionToken } = captcha.getOrElse({})

    this.props.authActions.reset2fa(guid, email, newEmail, secretPhrase, message, code, sessionToken)
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
  captcha: selectors.core.data.misc.getCaptcha(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
