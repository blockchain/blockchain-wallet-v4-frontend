import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import { StyledTemporaryButton } from '../AccountUpgrade.models'
import ScreenHeader from './Components/ScreenHeader/ScreenHeader'
import TfaSelector, { AUTH_TYPE_SELECTION } from './Components/TfaSelector'

const Select2faType = (props) => {
  const handleAuthSelection = (value) => {
    if (value === AUTH_TYPE_SELECTION.GOOGLE) {
      props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_SETUP)
    }
    if (value === AUTH_TYPE_SELECTION.YUBIKEY) {
      props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_SETUP)
    }
  }

  const steps = {
    actualStep: 2,
    totalSteps: 3
  }

  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_ACCOUNT_UPGRADE)
  }

  const handleNext = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_SETUP)
  }

  return (
    <>
      <Wrapper>
        <ScreenHeader
          icon={false}
          hasBackArrow
          handleBack={handlePrev}
          steps={steps}
          title={
            <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
          }
          description={
            <FormattedMessage
              id='scenes.login.upgrade.2fa.text'
              defaultMessage='Protect your accounts from unauthorized access by enabling 2FA. When you access your Blockchain account, enter your Google Auth code or insert a YubiKey.'
            />
          }
        />
        <TfaSelector onChange={handleAuthSelection} />
      </Wrapper>

      <StyledTemporaryButton onClick={handlePrev} type='button'>
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton onClick={handleNext} type='button'>
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(Select2faType)
