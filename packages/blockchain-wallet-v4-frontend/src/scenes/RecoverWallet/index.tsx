import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { pathOr } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import {
  AlertsState,
  Analytics,
  ProductAuthOptions,
  RecoverFormType,
  RecoverSteps,
  ResetFormSteps
} from 'data/types'

import CheckInbox from './CheckInbox'
import CloudRecovery from './CloudRecovery'
import ForgotPasswordEmail from './ForgotPasswordEmail'
import { RECOVER_FORM } from './model'
import RecoveryOptions from './RecoveryOptions'
import RecoveryPhrase from './RecoveryPhrase'
import NewPassword from './ResetAccount/NewPassword'
import ResetWarning from './ResetAccount/ResetWarning'
import TwoFAConfirmation from './ResetAccount/TwoFAConfirmation'

const RecoverWalletContainer = (props: Props) => {
  const [showPhraseStep] = useState(pathOr(false, ['location', 'state', 'showPhraseStep'], props))

  useEffect(() => {
    if (showPhraseStep) {
      props.formActions.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_PHRASE)
    } else if (!props.accountRecoveryV2Flag) {
      props.formActions.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_OPTIONS)
    } else {
      props.formActions.change(RECOVER_FORM, 'step', RecoverSteps.FORGOT_PASSWORD_EMAIL)
    }
    return () => {
      props.formActions.destroy(RECOVER_FORM)
    }
  }, [])

  const setStep = (step: RecoverSteps | ResetFormSteps) => {
    props?.formActions.change(RECOVER_FORM, 'step', step)
  }

  const { step } = props.formValues || RecoverSteps.RECOVERY_OPTIONS

  const handleSubmit = (e) => {
    e.preventDefault()
    const { analyticsActions, formValues, language, signupActions } = props
    if (step === RecoverSteps.FORGOT_PASSWORD_EMAIL) {
      signupActions.triggerRecoverEmail(formValues?.recoveryEmail)
      setStep(RecoverSteps.CHECK_INBOX)
      analyticsActions.trackEvent({
        key: Analytics.ACCOUNT_RECOVERY_EMAIL_SENT,
        properties: {}
      })
      return
    }
    if (step === RecoverSteps.RECOVERY_PHRASE) {
      return signupActions.restore({
        email: formValues.email,
        language,
        mnemonic: formValues.mnemonic,
        password: formValues.recoverPassword
      })
    }
    if (step === RecoverSteps.TWO_FA_CONFIRMATION) {
      return signupActions.verifyTwoFaForRecovery({
        code: formValues?.twoFACode,
        email: formValues.recoveryEmail
      })
    }
    if (step === RecoverSteps.NEW_PASSWORD) {
      analyticsActions.trackEvent({
        key: Analytics.RECOVER_FUNDS_CLICKED,
        properties: {}
      })
      if (props.accountRecoveryV2Flag) {
        signupActions.resetAccountV2({
          email: formValues?.recoveryEmail,
          language,
          password: formValues.resetAccountPassword
        })
      } else {
        // legacy account recovery for FF
        signupActions.resetAccount({
          email: props.cachedEmail,
          language,
          password: formValues.resetAccountPassword
        })
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {(() => {
        switch (step) {
          case RecoverSteps.FORGOT_PASSWORD_EMAIL:
            return <ForgotPasswordEmail {...props} setStep={setStep} />
          case RecoverSteps.CHECK_INBOX:
            return <CheckInbox {...props} setStep={setStep} />
          case RecoverSteps.RECOVERY_OPTIONS:
            return <RecoveryOptions {...props} setStep={setStep} />
          case RecoverSteps.CLOUD_RECOVERY:
            return <CloudRecovery {...props} setStep={setStep} />
          case RecoverSteps.RECOVERY_PHRASE:
            return <RecoveryPhrase {...props} setStep={setStep} />
          case RecoverSteps.RESET_WARNING:
            return <ResetWarning {...props} setStep={setStep} />
          case RecoverSteps.TWO_FA_CONFIRMATION:
            return <TwoFAConfirmation {...props} setStep={setStep} />
          case RecoverSteps.NEW_PASSWORD:
            return <NewPassword {...props} setStep={setStep} />
          default:
            return <RecoveryOptions {...props} setStep={setStep} />
        }
      })()}
    </Form>
  )
}

const mapStateToProps = (state) => ({
  accountRecoveryData: selectors.signup.getAccountRecoveryMagicLinkData(state),
  accountRecoveryV2Flag: selectors.core.walletOptions.getAccountRecoveryV2(state).getOrElse(false),
  alerts: selectors.alerts.selectAlerts(state) as AlertsState,
  cachedEmail: selectors.cache.getEmail(state),
  cachedGuid: selectors.cache.getStoredGuid(state),
  emailFromMagicLink: selectors.auth.getMagicLinkData(state)?.wallet?.email as string,
  formMeta: getFormMeta(RECOVER_FORM)(state),
  formValues: selectors.form.getFormValues(RECOVER_FORM)(state) as RecoverFormType,
  hasCloudBackup: selectors.cache.getHasCloudBackup(state) as boolean,
  kycReset: selectors.signup.getKycResetStatus(state),
  language: selectors.preferences.getLanguage(state),
  lastGuid: selectors.cache.getLastGuid(state),
  loginFormValues: selectors.form.getFormValues('login')(state),
  nabuId: selectors.auth.getMagicLinkData(state)?.wallet?.nabu?.user_id,
  product: selectors.auth.getProduct(state) as ProductAuthOptions,
  registering: selectors.signup.getRegistering(state) as RemoteDataType<string, any>
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

type FormProps = {
  busy: boolean
  invalid: boolean
  pristine: boolean
  setStep: (step: RecoverSteps | ResetFormSteps) => void
  submitting: boolean
}

export type Props = InjectedFormProps<{}> &
  ConnectedProps<typeof connector> &
  FormProps & {
    changeAuthenticatorStep: (number) => void
  }

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose<React.ComponentType>(
  reduxForm({
    destroyOnUnmount: false,
    form: RECOVER_FORM
  }),
  connector
)

export default enhance(RecoverWalletContainer)
