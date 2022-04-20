import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import {
  BackArrow,
  ButtonNext,
  CenteredMsgWrapper,
  CenteredTitle,
  StyledTemporaryButton,
  SubHeaderWrapper
} from '../AccountUpgrade.models'

const YubiKeyVerified = (props) => {
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
          <Icon name='checkmark-circle-filled' color='green600' size='40px' />
          <FormattedMessage
            id='scenes.login.upgrade.yubikeyVerify.header'
            defaultMessage='Yubikey Verified'
          />
          <CenteredMsgWrapper color='textBlack' lineHeight='24px' size='16px' weight={500}>
            <FormattedMessage
              id='scenes.login.upgrade.yubikeyVerify.text'
              defaultMessage='Make sure your Yubikey is plugged in next time you log into your Blockchain account.'
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
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_SETUP)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(YubiKeyVerified)
