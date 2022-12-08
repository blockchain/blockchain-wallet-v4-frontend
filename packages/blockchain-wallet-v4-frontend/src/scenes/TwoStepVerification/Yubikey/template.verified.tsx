import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { IconCheckCircle, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'

import { CenteredColumn } from '../model'
import { Props } from '.'

const YubikeyVerified = () => {
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
            id='scenes.login.upgrade.yubikeyVerify.header'
            defaultMessage='Yubikey Verified'
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
            id='scenes.login.upgrade.yubikeyVerify.text'
            defaultMessage='Make sure your Yubikey is plugged in next time you log into your Blockchain account.'
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

export default YubikeyVerified
