import React from 'react'
import { InjectedFormProps } from 'redux-form'

import { Form } from 'components/Form'
import { LoginSteps } from 'data/types'

import { Props } from '..'
import { RECOVER_FORM } from '../model'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RecoveryPhraseContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  StateProps
> {
  constructor(props) {
    super(props)
    this.state = {
      captchaToken: undefined,
      step: 1
    }
  }

  componentDidMount() {
    this.initCaptcha()
  }

  componentWillUnmount() {
    this.props.formActions.clearFields(RECOVER_FORM, false, false, 'mnemonic')
  }

  initCaptcha = (callback?) => {
    /* eslint-disable */
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise
        .execute(window.CAPTCHA_KEY, { action: 'RECOVER' })
        .then((captchaToken) => {
          console.log('Captcha success')
          this.setState({ captchaToken })
          callback && callback(captchaToken)
        })
        .catch((e) => {
          console.error('Captcha error: ', e)
        })
    })
    /* eslint-enable */
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { captchaToken } = this.state
    const { authActions, formValues, language } = this.props

    if (this.state.step === 1) {
      return this.setState({ step: 2 })
    }

    // sometimes captcha doesnt mount correctly (race condition?)
    // if it's undefined, try to re-init for token
    if (!captchaToken) {
      return this.initCaptcha(
        authActions.restore({
          captchaToken,
          email: formValues.email,
          language,
          mnemonic: formValues.mnemonic,
          password: formValues.recoverPassword
        })
      )
    }
    // we have a captcha token, continue recover process
    authActions.restore({
      captchaToken,
      email: formValues.email,
      language,
      mnemonic: formValues.mnemonic,
      password: formValues.recoverPassword
    })
  }

  previousStep = () => {
    this.setState({ step: 1 })
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(RECOVER_FORM, 'step', step)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.step === 1 && <FirstStep {...this.props} />}
        {this.state.step === 2 && <SecondStep previousStep={this.previousStep} {...this.props} />}
      </Form>
    )
  }
}

export type StateProps = {
  captchaToken?: string
  step: number
}

export default RecoveryPhraseContainer
