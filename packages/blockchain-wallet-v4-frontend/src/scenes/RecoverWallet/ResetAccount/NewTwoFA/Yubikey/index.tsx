import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { Props as OwnProps } from '../../..'
import YubikeySetup from './template.setup'
// import AuthenticatorVerify from './template.verified'

const Yubikey = (props) => {
  const [step, setStep] = useState(1)

  const changeAuthenticatorStep = (authStep: number) => {
    setStep(authStep)
  }
  return (
    <>
      {step === 1 && <YubikeySetup {...props} changeAuthenticatorStep={changeAuthenticatorStep} />}
      {/* {step === 2 && (
        <AuthenticatorVerify {...props} changeAuthenticatorStep={changeAuthenticatorStep} />
      )} */}
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
  }

export default connector(Yubikey)
