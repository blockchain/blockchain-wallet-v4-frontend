import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Image, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
// import QRCodeWrapper from 'components/QRCode/Wrapper'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import {
  BackArrow,
  BadgesWrapper,
  ButtonNext,
  CenteredTitle,
  ClipboardWrapper,
  QrWrapper,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const PLACEHOLDER = 'SBAT5VDS7TAA56R3CEWXFAQ'

const GoogleAuthSetup = (props) => {
  const { data, uiState } = props

  return (
    <>
      <Wrapper>
        <SubHeaderWrapper>
          <BackArrow onClick={() => null}>
            {!props.hideBackArrow && (
              <Icon
                data-e2e='2faBack'
                name='arrow-back'
                size='24px'
                color='blue600'
                style={{ marginRight: '8px' }}
                role='button'
              />
            )}
            <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
          <Text color='blue600' size='10px' weight={500} lineHeight='16px'>
            <FormattedMessage
              id='scenes.login.upgrade.unable_retry.steps'
              defaultMessage='Steps {actualStep} of {totalSteps}'
              values={{
                actualStep: 2,
                totalSteps: 3
              }}
            />
          </Text>
        </SubHeaderWrapper>
        <CenteredTitle
          size='20px'
          weight={600}
          color='black'
          style={{ marginTop: '8px' }}
          lineHeight='1.5'
        >
          <FormattedMessage
            id='scenes.login.upgrade.googleAuth.header'
            defaultMessage='Set Up 2FA'
          />
        </CenteredTitle>
        <CenteredTitle size='14px' weight={500} lineHeight='20px' color='grey900'>
          <FormattedMessage
            id='scenes.login.upgrade.googleAuth.text'
            defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
          />
          <QrWrapper>Placeholder</QrWrapper>
          <ClipboardWrapper>
            {/* <CopyClipboard address={PLACEHOLDER} active={uiState.notificationActive} /> */}
          </ClipboardWrapper>
          <BadgesWrapper>
            <Image name='badge-ios-appstore' width='160px' />
            <Image name='badge-android-playstore' width='160px' />
          </BadgesWrapper>
        </CenteredTitle>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage id='scenes.login.upgrade.googleAuth.button' defaultMessage='Next' />
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

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(GoogleAuthSetup)
