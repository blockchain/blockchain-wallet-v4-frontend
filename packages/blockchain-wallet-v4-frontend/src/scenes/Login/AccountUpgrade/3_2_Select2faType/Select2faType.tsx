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
  ButtonLine,
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
          <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
          <CenteredMsgWrapper color='textBlack' lineHeight='20px' size='14px' weight={500}>
            <FormattedMessage
              id='scenes.login.upgrade.2fa.text'
              defaultMessage='Protect your accounts from unauthorized access by enabling 2FA. When you access your Blockchain account, enter your Google Auth code or insert a YubiKey.'
            />
          </CenteredMsgWrapper>
        </CenteredTitle>
        <PanelButtonWrapper>
          <Column>
            <Text size='16px' weight={500} lineHeight='24px' color='grey900'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_1.title'
                defaultMessage='Google Authenticator'
              />
            </Text>
            <Row>
              <IconWrapper>
                <Icon
                  name='close-circle'
                  size='32px'
                  color='blue600'
                  style={{ marginRight: '8px' }}
                />
              </IconWrapper>
              <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
                <FormattedMessage
                  id='scenes.login.upgrade.2fa.item_1.text'
                  defaultMessage='Generate a second step of verification when you sign in.'
                />
              </Text>
            </Row>
          </Column>
          <ButtonLine
            name='chevron-right'
            size='20px'
            color='grey600'
            style={{ marginRight: '16px' }}
          />
        </PanelButtonWrapper>
        <PanelButtonWrapper>
          <Column>
            <Text size='16px' weight={500} lineHeight='24px' color='grey900'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_2.title'
                defaultMessage='YubiKey'
              />
            </Text>
            <Row>
              <IconWrapper>
                <Icon name='hardware' size='32px' color='blue600' style={{ marginRight: '8px' }} />
              </IconWrapper>
              <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
                <FormattedMessage
                  id='scenes.login.upgrade.2fa.item_2.text'
                  defaultMessage='Secure your wallet with a physical key or device.'
                />
              </Text>
            </Row>
          </Column>
          <ButtonLine
            name='chevron-right'
            size='20px'
            color='grey600'
            style={{ marginRight: '16px' }}
          />
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
