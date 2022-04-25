import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft, IconCheckCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Button, TextInput } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { ExchangeAuthOriginType, TwoFASetupSteps, UpgradeSteps } from 'data/types'

import {
  BackArrow,
  CenteredMsgWrapper,
  CenteredTitle,
  FootNote,
  HeadingIcon,
  InputWrapper,
  Label,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const UpgradeSuccess = (props) => {
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
                actualStep: 3,
                totalSteps: 3
              }}
            />
          </Text>
        </SubHeaderWrapper>
        <CenteredTitle color='black' variant='title-3'>
          <HeadingIcon>
            <Icon label='checkmark-circle-filled' color='green600' size='lg'>
              <IconCheckCircle />
            </Icon>
          </HeadingIcon>
          <FormattedMessage
            id='scenes.login.upgrade.2faSuccess.header'
            defaultMessage='You’re All Set!'
          />
          <CenteredMsgWrapper color='black' variant='paragraph-1'>
            <FormattedMessage
              id='scenes.login.upgrade.2faSuccess.text'
              defaultMessage='Look for a confirmation email. You can now log in to the Wallet and Exchange with:'
            />
          </CenteredMsgWrapper>
        </CenteredTitle>
        <InputWrapper>
          <Label color='grey400' variant='paragraph-2'>
            <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
          </Label>
          <TextInput disabled name='youremail' type='text' value='satoshi@blockchain.com' />
        </InputWrapper>

        <InputWrapper>
          <Label color='grey400' variant='paragraph-2'>
            <FormattedMessage
              id='scenes.securitysettings.advanced.walletpassword.settings.new'
              defaultMessage='New Password'
            />
          </Label>
          <TextInput disabled name='newpassword' type='text' value='••••••••••••••••••••••••' />
        </InputWrapper>

        <InputWrapper>
          <Label color='grey400' variant='paragraph-2'>
            <FormattedMessage
              id='scenes.login.upgrade.2faSuccess.new2fa'
              defaultMessage='New 2FA'
            />
          </Label>
          <TextInput
            disabled
            name='newpassword'
            type='text'
            value='|Google Authenticator/Yubikey|'
          />
        </InputWrapper>

        <FootNote color='grey900' variant='body-1'>
          <FormattedMessage
            id='scenes.login.upgrade.2faSuccess.footNote'
            defaultMessage='You can now delete your old Exchange 2FA method.'
          />
        </FootNote>

        <Button
          nature='primary'
          data-e2e='createWalletUpgradeAccount'
          fullwidth
          height='48px'
          onClick={() => props.profileActions.getExchangeLoginToken(ExchangeAuthOriginType.Upgrade)}
        >
          <FormattedMessage
            id='scenes.login.upgrade.2faSuccess.button'
            defaultMessage='Open Exchange'
          />
        </Button>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_VERIFY)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_SETUP)}
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(UpgradeSuccess)
