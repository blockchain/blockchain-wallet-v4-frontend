import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'

import { Button, Text } from 'blockchain-info-components'

import { BackArrowFormHeader, CenteredColumn } from '../../../model'
import { Props } from '.'

const YubikeyVerified = (props: Props) => {
  return (
    <>
      <BackArrowFormHeader handleBackArrowClick={() => props.changeAuthenticatorStep(1)} />
      <CenteredColumn>
        <Icon label='checkmark-circle-filled' color='green600' size='lg'>
          <IconCheckCircle />
        </Icon>
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
      <Button
        nature='primary'
        data-e2e='nextButton'
        fullwidth
        height='48px'
        // onClick={handleNext}
      >
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

export default YubikeyVerified
