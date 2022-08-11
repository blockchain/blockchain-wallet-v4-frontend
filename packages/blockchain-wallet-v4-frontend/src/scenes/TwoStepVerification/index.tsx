import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { InjectedFormProps } from 'redux-form'

import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Props as ResetProps } from '../..'
import Authenticator from './Authenticator'
import ChooseTwoFA from './ChoooseTwoFA'
import { FormWrapper, TwoFactorSetupSteps } from './model'
import SMS from './SMS'
import Yubikey from './Yubikey'

const TwoStepVerification: React.FC<InjectedFormProps<{}, ResetProps> & ResetProps> = (
  props: ResetProps
) => {
  const [recoveryStep, setRecoveryStep] = useState(TwoFactorSetupSteps.CHOOSE_TWOFA)

  const setFormStep = (step) => {
    setRecoveryStep(step)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // const { cachedEmail, formValues, language, signupActions } = props
    // signupActions.resetAccount({
    //   email: cachedEmail,
    //   language,
    //   password: formValues.resetAccountPassword
    // })
  }
  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        {recoveryStep === TwoFactorSetupSteps.CHOOSE_TWOFA && (
          <ChooseTwoFA {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === TwoFactorSetupSteps.AUTHENTICATOR_SETUP && (
          <Authenticator {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === TwoFactorSetupSteps.SMS_SETUP && (
          <SMS {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === TwoFactorSetupSteps.YUBIKEY_SETUP && (
          <Yubikey {...props} setFormStep={setFormStep} />
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

export default connector(TwoStepVerification)
