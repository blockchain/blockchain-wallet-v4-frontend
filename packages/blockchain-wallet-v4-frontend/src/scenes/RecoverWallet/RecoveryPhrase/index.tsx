import React, { useEffect, useState } from 'react'

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

  const setRecoveryPhraseStep2 = () => {
    setStateStep(2)
  }

  return (
    <>
      {step === 1 && <FirstStep setRecoveryPhraseStep2={setRecoveryPhraseStep2} {...props} />}
      {step === 2 && <SecondStep setRecoveryPhraseStep2={setRecoveryPhraseStep2} {...props} />}
    </>
  )
}

export type StateProps = {
  step: number
}

export default RecoveryPhraseContainer
