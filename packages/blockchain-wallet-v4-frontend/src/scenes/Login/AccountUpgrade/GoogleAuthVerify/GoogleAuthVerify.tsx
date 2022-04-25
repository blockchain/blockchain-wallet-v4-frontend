import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { TextInput } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import {
  BackArrow,
  ButtonNext,
  CenteredTitle,
  InputWrapper,
  Label,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const GoogleAuthVerify = (props) => {
  const { formatMessage } = useIntl()
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
            id='scenes.login.upgrade.googleAuthVerify.header'
            defaultMessage='Verify Your Google Account'
          />
        </CenteredTitle>
        <CenteredTitle variant='paragraph-1' color='grey900'>
          <FormattedMessage
            id='scenes.login.upgrade.googleAuthVerify.text'
            defaultMessage='Enter the 6-digit code you see in your Google Auth App.'
          />
        </CenteredTitle>
        <InputWrapper>
          <Label variant='paragraph-2' color='grey800'>
            <FormattedMessage
              id='scenes.login.upgrade.googleAuthVerify.6digitcode'
              defaultMessage='6 digit code'
            />
          </Label>
          <TextInput
            name='6digitcode'
            type='text'
            placeholder={formatMessage({
              defaultMessage: 'Enter 6 digit code',
              id: 'scenes.login.upgrade.googleAuthVerify.6digitcode.placeholder'
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
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.GOOGLE_AUTH_SETUP)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_SUCCESS)}
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

export default connect(null, mapDispatchToProps)(GoogleAuthVerify)
