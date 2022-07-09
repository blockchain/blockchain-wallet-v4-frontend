import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { InjectedFormProps } from 'redux-form'

import { Remote } from '@core'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { FormWrapper, ResetFormSteps } from '../model'
import NewPassword from './NewPassword'
import ResetWarning from './ResetWarning'

const ResetAccount: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [recoveryStep, setRecoveryStep] = useState(ResetFormSteps.RESET_WARNING)

  const setFormStep = (step) => {
    setRecoveryStep(step)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { cachedEmail, formValues, language, signupActions } = props
    signupActions.resetAccount({
      email: cachedEmail,
      language,
      password: formValues.resetAccountPassword
    })
  }

  const isRegistering = Remote.Loading.is(props.registering)
  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        {recoveryStep === ResetFormSteps.RESET_WARNING && (
          <ResetWarning {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === ResetFormSteps.NEW_PASSWORD && (
          <NewPassword {...props} isRegistering={isRegistering} />
        )}
      </Form>
    </FormWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  language: selectors.preferences.getLanguage(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
}

export default connector(ResetAccount)
