import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { ResetFormSteps } from 'data/types'

import { Props as OwnProps } from '../../..'
import SMSSetup from './template.setup'
import SMSVerified from './template.verified'

const SMS = (props: Props) => {
  const [step, setStep] = useState(1)

  const changeAuthenticatorStep = (authStep: number) => {
    setStep(authStep)
  }
  return (
    <>
      {step === 1 && <SMSSetup {...props} changeAuthenticatorStep={changeAuthenticatorStep} />}
      {step === 2 && <SMSVerified {...props} changeAuthenticatorStep={changeAuthenticatorStep} />}
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
    setFormStep: (ResetFormSteps) => void
  }

export default connector(SMS)
