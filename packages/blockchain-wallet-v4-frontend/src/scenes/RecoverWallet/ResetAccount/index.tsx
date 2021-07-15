import React from 'react'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Form } from 'components/Form'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import StepOne from './StepOne'
import StepTwo from './StepTwo'

class ResetAccount extends React.PureComponent<InjectedFormProps<{}, Props> & Props, StateProps> {
  constructor(props) {
    super(props)
    this.state = {
      step: 1
    }
  }

  setFormStep = () => {
    this.setState({ step: 2 })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // submit form to reset account
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.step === 1 && <StepOne {...this.props} setFormStep={this.setFormStep} />}
        {this.state.step === 2 && <StepTwo {...this.props} />}
      </Form>
    )
  }
}

export type StateProps = {
  step: number
}

export type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
}

export default ResetAccount
