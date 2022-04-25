import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft, IconChevronRightV2 } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Image } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import {
  BackArrow,
  ButtonIcon,
  CenteredMsgWrapper,
  CenteredTitle,
  Column,
  IconWrapper,
  PanelButtonWrapper,
  Row,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const Select2faType = (props) => {
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
          <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
          <CenteredMsgWrapper color='grey900' variant='paragraph-1'>
            <FormattedMessage
              id='scenes.login.upgrade.2fa.text'
              defaultMessage='Protect your accounts from unauthorized access by enabling 2FA. When you access your Blockchain account, enter your Google Auth code or insert a YubiKey.'
            />
          </CenteredMsgWrapper>
        </CenteredTitle>
        <PanelButtonWrapper>
          <Column>
            <Text color='grey900' variant='body-1'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_1.title'
                defaultMessage='Google Authenticator'
              />
            </Text>
            <Row>
              <IconWrapper>
                <Image name='google-auth-logo' style={{ marginRight: '16px' }} />
              </IconWrapper>
              <Text color='grey600' variant='body-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.2fa.item_1.text'
                  defaultMessage='Generate a second step of verification when you sign in.'
                />
              </Text>
            </Row>
          </Column>
          <ButtonIcon label='chevronRight' size='md' color='grey600'>
            <IconChevronRightV2 />
          </ButtonIcon>
        </PanelButtonWrapper>
        <PanelButtonWrapper>
          <Column>
            <Text color='grey900' variant='body-1'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_2.title'
                defaultMessage='YubiKey'
              />
            </Text>
            <Row>
              <IconWrapper>
                <Image name='yubikey-logo' style={{ marginRight: '16px' }} />
              </IconWrapper>
              <Text color='grey600' variant='body-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.2fa.item_2.text'
                  defaultMessage='Secure your wallet with a physical key or device.'
                />
              </Text>
            </Row>
          </Column>
          <ButtonIcon label='chevronRight' size='md' color='grey600'>
            <IconChevronRightV2 />
          </ButtonIcon>
        </PanelButtonWrapper>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_ACCOUNT_UPGRADE)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_SETUP)
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

export default connect(null, mapDispatchToProps)(Select2faType)
