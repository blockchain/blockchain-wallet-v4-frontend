import React, { useEffect, useState } from 'react'

import Form from 'components/Form/Form'
import { LoginSteps } from 'data/types'

import { Props } from '..'
import { RECOVER_FORM } from '../model'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

const RecoveryPhraseContainer = (props: Props) => {
  const [step, setStateStep] = useState(1)

  useEffect(() => {
    return () => {
      props.formActions.clearFields(RECOVER_FORM, false, false, 'mnemonic')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const { formValues, language, signupActions } = props

    if (step === 1) {
      return setStateStep(2)
    }

    // we have a captcha token, continue recover process
    signupActions.restore({
      email: formValues.email,
      language,
      mnemonic: formValues.mnemonic,
      password: formValues.recoverPassword
    })
  }

  const previousStep = () => {
    setStateStep(2)
  }

  const setStep = (step: LoginSteps) => {
    props.formActions.change(RECOVER_FORM, 'step', step)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {step === 1 && <FirstStep {...props} />}
      {step === 2 && <SecondStep previousStep={previousStep} {...props} />}
    </Form>
  )
}

export type StateProps = {
  step: number
}

export default RecoveryPhraseContainer
