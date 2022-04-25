import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Image } from 'blockchain-info-components'
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
  CenteredDescription,
  CenteredTitle,
  ClipboardWrapper,
  QrWrapper,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const GoogleAuthSetup = (props) => {
  return (
    <>
      <Wrapper>
        <SubHeaderWrapper>
          <BackArrow onClick={() => null}>
            {!props.hideBackArrow && (
              <Icon data-e2e='upgradeBack' label='back' size='md' color='blue600'>
                <IconArrowLeft />
              </Icon>
            )}
            <Text color='grey900' variant='paragraph-1'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
          <Text color='blue600' variant='micro'>
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
        <CenteredTitle color='black' variant='title-3'>
          <FormattedMessage
            id='scenes.login.upgrade.googleAuth.header'
            defaultMessage='Set Up 2FA'
          />
        </CenteredTitle>
        <CenteredDescription variant='paragraph-1' color='grey900'>
          <FormattedMessage
            id='scenes.login.upgrade.googleAuth.text'
            defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
          />
          <QrWrapper>Placeholder</QrWrapper>
          <ClipboardWrapper>
            {/* <CopyClipboard address={PLACEHOLDER} active={uiState.notificationActive} /> */}
          </ClipboardWrapper>
          <BadgesWrapper>
            <Image name='apple-app-store-badge' width='160px' />
            <Image name='google-play-badge' width='160px' />
          </BadgesWrapper>
        </CenteredDescription>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
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

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(GoogleAuthSetup)
