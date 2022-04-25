import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft, IconCloseCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/auth/types'

import {
  BackArrow,
  ButtonLater,
  ButtonNext,
  CenteredMsgWrapper,
  CenteredTitle,
  HeadingIcon,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const ErrorAccountUpgrade = (props) => {
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
            <Icon label='close-circle' color='red600' size='lg'>
              <IconCloseCircle />
            </Icon>
          </HeadingIcon>
          <FormattedMessage
            id='scenes.login.upgrade.able_retry.header'
            defaultMessage='Something Didn´t Work'
          />
          <CenteredMsgWrapper color='grey900' variant='body-1'>
            <FormattedMessage
              id='scenes.login.upgrade.able_retry.text'
              defaultMessage='Don’t worry, you can still login with original credentials. You can retry the upgrade the next time you login.'
            />
          </CenteredMsgWrapper>
        </CenteredTitle>
        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.able_retry.button_1'
            defaultMessage='Retry Upgrade'
          />
        </ButtonNext>
        <ButtonLater
          data-e2e='LaterButton'
          color='blue600'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.able_retry.button_2'
            defaultMessage='I’ll Try Again Later'
          />
        </ButtonLater>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_WALLET_CREATION)
        }
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)
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

export default connect(null, mapDispatchToProps)(ErrorAccountUpgrade)
