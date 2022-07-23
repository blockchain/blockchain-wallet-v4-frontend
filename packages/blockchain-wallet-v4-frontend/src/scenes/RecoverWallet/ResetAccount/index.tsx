import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { InjectedFormProps } from 'redux-form'

import { Remote } from '@core'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AccountRecoveryMagicLinkData, RecoverSteps } from 'data/types'

import { Props as ResetProps } from '..'
import { FormWrapper, ResetFormSteps } from '../model'
import NewPassword from './NewPassword'
import Authenticator from './NewTwoFA/Authenticator'
import ChooseTwoFA from './NewTwoFA/ChoooseTwoFA'
import SMS from './NewTwoFA/SMS'
import Yubikey from './NewTwoFA/Yubikey'
import ResetWarning from './ResetWarning'
import TwoFAConfirmation from './TwoFAConfirmation'

const ResetAccount: React.FC<InjectedFormProps<{}, ResetProps> & ResetProps> = (props) => {
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
        {recoveryStep === ResetFormSteps.TWO_FA_CONFIRMATION && (
          <TwoFAConfirmation {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === ResetFormSteps.NEW_PASSWORD && (
          <NewPassword {...props} isRegistering={isRegistering} setFormStep={setFormStep} />
        )}
        {recoveryStep === ResetFormSteps.CHOOSE_TWOFA && (
          <ChooseTwoFA {...props} setFormStep={setFormStep} />
        )}
        {recoveryStep === ResetFormSteps.AUTHENTICATOR_SETUP && <Authenticator {...props} />}
        {recoveryStep === ResetFormSteps.SMS_SETUP && <SMS {...props} />}
        {recoveryStep === ResetFormSteps.YUBIKEY_SETUP && <Yubikey {...props} />}
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

export default connector(ResetAccount)
