import React from 'react'
import { InjectedFormProps } from 'redux-form'

import { Form } from 'components/Form'
import { LoginSteps } from 'data/types'

import { Props } from '..'
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
    this.props.formActions.clearFields('recover', false, false, 'mnemonic')
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change('recover', 'step', step)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { authActions, email, language, mnemonic, recoverPassword } = this.props
    if (this.state.step === 1) {
      this.setState({ step: 2 })
    } else {
      authActions.restore(mnemonic, email, recoverPassword, language, undefined)
    }
  }

  previousStep = () => {
    this.setState({ step: 1 })
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
