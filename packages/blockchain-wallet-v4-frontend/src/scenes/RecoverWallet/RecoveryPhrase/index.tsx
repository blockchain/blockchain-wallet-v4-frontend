import React from 'react'
import { InjectedFormProps } from 'redux-form'

import Form from 'components/Form/Form'
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
      step: 1
    }
  }

  componentWillUnmount() {
    this.props.formActions.clearFields(RECOVER_FORM, false, false, 'mnemonic')
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { formValues, language, signupActions } = this.props

    if (this.state.step === 1) {
      return this.setState({ step: 2 })
    }

    // we have a captcha token, continue recover process
    signupActions.restore({
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
  step: number
}

export default RecoveryPhraseContainer
