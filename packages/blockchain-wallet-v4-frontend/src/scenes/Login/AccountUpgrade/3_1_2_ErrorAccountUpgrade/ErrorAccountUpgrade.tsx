import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/auth/types'

import {
  BackArrow,
  ButtonLater,
  ButtonNext,
  CenteredTitle,
  ErrorMsgWrapper,
  StyledTemporaryButton,
  SubHeaderWrapper,
  TextToRightWrapper
} from '../AccountUpgrade.models'

const ErrorAccountUpgrade = (props) => {
  return (
    <>
      <Wrapper>
        <SubHeaderWrapper>
          <BackArrow onClick={() => null}>
            {!props.hideBackArrow && (
              <Icon
                data-e2e='signupBack'
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
              id='scenes.login.upgrade.3.1.1.steps'
              defaultMessage='Steps {actualStep} of {totalSteps}'
              values={{
                actualStep: 3,
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
          <Icon name='close-circle' color='red600' size='40px' />
          <FormattedMessage
            id='scenes.login.upgrade.3.1.2.header'
            defaultMessage='Something Didn´t Work'
          />
          <ErrorMsgWrapper color='textBlack' lineHeight='24px' size='16px' weight={500}>
            <FormattedMessage
              id='scenes.login.upgrade.3.1.2.text'
              defaultMessage='Don’t worry, you can still login with original credentials. You can retry the upgrade the next time you login.'
            />
          </ErrorMsgWrapper>
        </CenteredTitle>
        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.3.1.2.button_1'
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
            id='scenes.login.upgrade.3.1.2.button_2'
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
