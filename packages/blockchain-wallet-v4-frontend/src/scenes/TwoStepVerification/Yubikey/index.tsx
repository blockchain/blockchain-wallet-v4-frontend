import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { Props as OwnProps } from '../../..'
import { TwoFactorSetupSteps } from '../model'
import YubikeySetup from './template.setup'
import YubikeyVerified from './template.verified'

const Yubikey = (props: Props) => {
  const [step, setStep] = useState(1)

  const changeAuthenticatorStep = (authStep: number) => {
    setStep(authStep)
  }
  return (
    <>
      {props.authType === 0 && (
        <YubikeySetup {...props} changeAuthenticatorStep={changeAuthenticatorStep} />
      )}
      {(props.authType === 1 || props.authType === 2) && (
        <YubikeyVerified {...props} changeAuthenticatorStep={changeAuthenticatorStep} />
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    changeAuthenticatorStep: (number) => void
    setFormStep: (TwoFactorSetupSteps) => void
  }

export default connector(Yubikey)
