import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Badge } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import { Wrapper } from 'components/Public'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import ScreenHeader from '../../components/ScreenHeader'
import {
  BadgesWrapper,
  ButtonNext,
  CenteredContent,
  ClipboardWrapper,
  StyledQRWrapper,
  StyledTemporaryButton
} from '../AccountUpgrade.models'
import { getData } from './selectors'

const GoogleAuthSetup = (props) => {
  const steps = {
    actualStep: 2,
    totalSteps: 3
  }

  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)
  }

  const handleNext = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_VERIFY)
  }

  useEffect(() => {
    props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }, [])

  return (
    <>
      <Wrapper>
        <ScreenHeader
          handleBack={handlePrev}
          steps={steps}
          description={
            <FormattedMessage
              id='scenes.login.upgrade.googleAuth.text'
              defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
            />
          }
          title={
            <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
          }
        />
        <CenteredContent>
          <StyledQRWrapper>
            <QRCodeWrapper size={150} value={props.data.googleAuthSecretUrl || ''} />
          </StyledQRWrapper>
          <ClipboardWrapper>
            <CopyClipboard address={props.data.secret || ''} />
          </ClipboardWrapper>
          <BadgesWrapper>
            <Badge type='applestore' />
            <Badge type='googleplay' />
          </BadgesWrapper>
        </CenteredContent>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={handleNext}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_VERIFY)
        }
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapStateToProps = (state) => ({
  authCode: formValueSelector('securityGoogleAuthenticator')(state, 'authCode'),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(GoogleAuthSetup)
