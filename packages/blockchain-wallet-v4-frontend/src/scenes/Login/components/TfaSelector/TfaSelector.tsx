import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconChevronRightV2 } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

import ButtonPanel from '../ButtonPanel'

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

const TfaSelector = ({ onChange }) => {
  return (
    <>
      <ButtonPanel onClick={() => onChange(AUTH_TYPE_SELECTION.GOOGLE)}>
        <Column>
          <Text color='grey900' variant='body-1'>
            <FormattedMessage
              id='scenes.login.upgrade.2fa.item_1.title'
              defaultMessage='Google Authenticator'
            />
          </Text>
          <Row>
            <IconWrapper>
              <StyledImage name='google-auth-logo' />
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
      </ButtonPanel>
      <ButtonPanel onClick={() => onChange(AUTH_TYPE_SELECTION.YUBIKEY)}>
        <Column>
          <Text color='grey900' variant='body-1'>
            <FormattedMessage id='scenes.login.upgrade.2fa.item_2.title' defaultMessage='YubiKey' />
          </Text>
          <Row>
            <IconWrapper>
              <StyledImage name='yubikey-logo' />
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
      </ButtonPanel>
    </>
  )
}

export default TfaSelector
