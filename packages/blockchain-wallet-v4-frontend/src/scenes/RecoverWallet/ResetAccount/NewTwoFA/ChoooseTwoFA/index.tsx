import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRightV2, IconPhone } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'

import { Props as OwnProps } from '../../..'
import { ButtonPanel } from '../../../model'

export const AUTH_TYPE_SELECTION = {
  GOOGLE: 'google',
  YUBIKEY: 'yubikey'
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
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

const ChooseTwoFA = (props: OwnProps) => {
  return (
    <>
      <ButtonPanel>
        <Column>
          <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.upgrade.2fa.item_1.title'
              defaultMessage='Google Authenticator'
            />
          </Text>
          <Row>
            <IconWrapper>
              <StyledImage name='google-authenticator' height='24px' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
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
      </ButtonPanel>
      <ButtonPanel>
        <Column>
          <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='scenes.login.upgrade.2fa.item_2.title' defaultMessage='YubiKey' />
          </Text>
          <Row>
            <IconWrapper>
              <StyledImage name='yubikey-logo' />
            </IconWrapper>
            <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
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
      </ButtonPanel>
      <ButtonPanel>
        <Column>
          <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='scenes.login.upgrade.2fa.item_3.title' defaultMessage='SMS' />
          </Text>
          <Row>
            <Icon color='blue600' size='md' label='sms-2fa'>
              <IconPhone />
            </Icon>

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
          </Row>
        </Column>
        <ButtonIcon label='chevronRight' size='md' color='grey600'>
          <IconChevronRightV2 />
        </ButtonIcon>
      </ButtonPanel>
    </>
  )
}

export default ChooseTwoFA
