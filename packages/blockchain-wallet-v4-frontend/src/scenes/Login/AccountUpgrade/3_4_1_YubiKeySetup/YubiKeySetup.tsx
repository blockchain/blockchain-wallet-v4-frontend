import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Image, Text, TextInput } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/auth/types'

import {
  BackArrow,
  BadgesWrapper,
  ButtonNext,
  CenteredTitle,
  ClipboardWrapper,
  InputWrapper,
  Label,
  QrWrapper,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const YubiKeySetup = (props) => {
  const { formatMessage } = useIntl()
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
            id='scenes.login.upgrade.yubikey.header'
            defaultMessage='Verify with Your Yubikey'
          />
        </CenteredTitle>
        <CenteredTitle size='14px' weight={500} lineHeight='20px' color='grey900'>
          <FormattedMessage
            id='scenes.login.upgrade.yubikey.text'
            defaultMessage='Insert the Yubikey into your computer´s USB port. Pair your Yubikey by tapping your key.'
          />
        </CenteredTitle>

        <InputWrapper>
          <TextInput
            name='6digitcode'
            type='text'
            placeholder={formatMessage({
              defaultMessage: 'Tap Yubikey to enter code',
              id: 'scenes.login.upgrade.googleAuthVerify.input.placeholder'
            })}
          />
        </InputWrapper>

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
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_SUCCESS)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_VERIFIED)
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

export default connect(null, mapDispatchToProps)(YubiKeySetup)
