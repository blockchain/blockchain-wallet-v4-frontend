import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRightV2, IconPhone } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { GreyCartridge, SuccessCartridge } from 'components/Cartridge'

import { Props as OwnProps } from '../../..'
import { ButtonPanel, CenteredColumn, ResetFormSteps } from '../../../model'

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  margin-top: 0.5rem;
  min-width: 95%;
  align-items: center;
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonIcon = styled(Icon)`
  align-items: center;
  margin-right: 1rem;
`

const StyledImage = styled(Image)`
  margin-right: 1rem;
`
const StyledGreyCartridge = styled(GreyCartridge)`
  padding: 4px 8px;
  width: 80px;
  margin-top: 8px;
  border-radius: 4px;
`
const StyledSuccessCartridge = styled(SuccessCartridge)`
  padding: 4px 8px;
  width: 80px;
  margin-top: 8px;
  border-radius: 4px;
`
const ChooseTwoFA = (props: Props) => {
  return (
    <>
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
        </Text>
        <Text
          size='14px'
          weight={500}
          color='grey900'
          lineHeight='1.5'
          style={{ textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.recovery.2fa.body'
            defaultMessage='Protect your account from unauthorized access by enabling 2FA and requiring a one-time password for every login attempt.'
          />
        </Text>
      </CenteredColumn>
      <ButtonPanel onClick={() => props.setFormStep(ResetFormSteps.AUTHENTICATOR_SETUP)}>
        <Row>
          <IconWrapper>
            <StyledImage name='google-authenticator' height='24px' />
          </IconWrapper>
          <Column>
            <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_1.title'
                defaultMessage='Google Authenticator'
              />
            </Text>

            <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_1.text'
                defaultMessage='Generate a second step of verification when you sign in.'
              />
            </Text>
            <StyledGreyCartridge>
              <Text size='12px' weight={600} color='grey900'>
                <FormattedMessage id='copy.most_popular' defaultMessage='Most Popular' />
              </Text>
            </StyledGreyCartridge>
          </Column>
        </Row>

        <ButtonIcon label='chevronRight' size='md' color='grey600'>
          <IconChevronRightV2 />
        </ButtonIcon>
      </ButtonPanel>
      <ButtonPanel onClick={() => props.setFormStep(ResetFormSteps.YUBIKEY_SETUP)}>
        <Row>
          <IconWrapper>
            <StyledImage name='yubikey-logo' />
          </IconWrapper>
          <Column>
            <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_2.title'
                defaultMessage='YubiKey'
              />
            </Text>
            <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_2.text'
                defaultMessage='Secure your wallet with a physical key or device.'
              />
            </Text>
            <StyledSuccessCartridge>
              <Text size='12px' weight={600} color='green600'>
                <FormattedMessage id='copy.most_secure' defaultMessage='Most Secure' />
              </Text>
            </StyledSuccessCartridge>
          </Column>
        </Row>
        <ButtonIcon label='chevronRight' size='md' color='grey600'>
          <IconChevronRightV2 />
        </ButtonIcon>
      </ButtonPanel>
      <ButtonPanel onClick={() => props.setFormStep(ResetFormSteps.SMS_SETUP)}>
        <Row>
          <Icon color='blue600' size='md' label='sms-2fa'>
            <IconPhone />
          </Icon>

          <Column>
            <Text
              color='grey900'
              size='16px'
              weight={600}
              lineHeight='1.5'
              style={{ marginLeft: '1rem' }}
            >
              <FormattedMessage id='scenes.login.upgrade.2fa.item_3.title' defaultMessage='SMS' />
            </Text>

            <Text
              color='grey600'
              size='14px'
              weight={500}
              lineHeight='1.5'
              style={{ marginLeft: '1rem' }}
            >
              <FormattedMessage
                id='scenes.login.upgrade.2fa.item_3.text'
                defaultMessage='Secure your wallet with SMS codes.'
              />
            </Text>
          </Column>
        </Row>
        <ButtonIcon label='chevronRight' size='md' color='grey600'>
          <IconChevronRightV2 />
        </ButtonIcon>
      </ButtonPanel>
    </>
  )
}

type Props = OwnProps & {
  setFormStep: (step) => void
}

export default ChooseTwoFA
