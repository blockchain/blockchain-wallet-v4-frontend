import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import { actions } from 'data'
import { api } from 'services/ApiService'

class Reset2FAContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { timestamp: new Date().getTime() }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  success (data) {
    const { message } = data
    // TODO: Handle multilanguages
    switch (message) {
      case 'Request Submitted':
        this.props.alertActions.displaySuccess(message)
        break
      case 'Captcha Code Incorrect':
        this.props.alertActions.displayError(message)
        break
      case 'Invalid Email':
        this.props.alertActions.displayError(message)
        break
      case 'Two factor authentication not enabled.':
        this.props.alertActions.displayError(message)
        break
      default:
        this.props.alertActions.displayError('Unknown error')
    }
  }

  handleSubmit () {
    this.setState({ timestamp: new Date().getTime() })
    const { guid, email, newEmail, secretPhrase, message, captcha } = this.props
    const data = {
      method: 'reset-two-factor-form',
      guid: guid,
      email: email,
      contact_email: newEmail,
      secret_phrase: secretPhrase,
      message: message,
      kaptcha: captcha,
      ct: this.state.timestamp
    }
    api.reset2fa(data).then(
      data => this.success(data)
    )
  }

  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep {...rest} />
      case 2: return <SecondStep {...rest} />
      case 3: return <ThirdStep {...rest} handleSubmit={this.handleSubmit} timestamp={this.state.timestamp} />
      default: return <FirstStep {...rest} />
    }
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('reset2FA')
  return ({
    guid: selector(state, 'guid'),
    email: selector(state, 'email'),
    newEmail: selector(state, 'newEmail'),
    secretPhrase: selector(state, 'secretPhrase'),
    message: selector(state, 'message'),
    captcha: selector(state, 'captcha')
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

const enhance = compose(
  wizardProvider('reset2FA', 3),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(Reset2FAContainer)
