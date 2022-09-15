import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '../../..'
import { TwoFactorSetupSteps } from '../model'
import AuthenticatorCode from './template.qrcode'
import AuthenticatorVerified from './template.success'
import AuthenticatorVerify from './template.verify'

const Authenticator = (props: Props) => {
  useEffect(() => {
    props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }, [])

  const [step, setStep] = useState(1)

  const changeAuthenticatorStep = (authStep: number) => {
    setStep(authStep)
  }
  return (
    <>
      {step === 1 && (
        <AuthenticatorCode {...props} changeAuthenticatorStep={changeAuthenticatorStep} />
      )}
      {props.authType === 0 && step === 2 && (
        <AuthenticatorVerify {...props} changeAuthenticatorStep={changeAuthenticatorStep} />
      )}
      {props.authType === 4 && <AuthenticatorVerified {...props} />}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  googleAuthSecretUrl: selectors.core.settings.getGoogleAuthSecretUrl(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    changeAuthenticatorStep: (number) => void
    setFormStep: (TwoFactorSetupSteps) => void
  }

export default connector(Authenticator)
