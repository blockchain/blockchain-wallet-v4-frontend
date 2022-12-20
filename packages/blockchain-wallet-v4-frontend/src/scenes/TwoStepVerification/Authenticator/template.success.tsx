import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { IconCheckCircle, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'

import { BackArrowFormHeader, CenteredColumn } from '../model'
import { Props } from '.'

const AuthenticatorVerified = (props: Props) => {
  return (
    <>
      <CenteredColumn>
        <IconCheckCircle
          label='checkmark-circle-filled'
          color={PaletteColors['green-600']}
          size='large'
        />

        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.recovery.authenticator_verified.header'
            defaultMessage='Authenticator App Verified'
          />
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '24px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='components.alerts.twofa_authenticator_verify_success'
            defaultMessage='Your authenticator app is now your two-factor authentication method.'
          />
        </Text>
      </CenteredColumn>
      <LinkContainer to='/select-product'>
        <Button nature='primary' data-e2e='nextButton' fullwidth height='48px'>
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </LinkContainer>
    </>
  )
}

export default AuthenticatorVerified
