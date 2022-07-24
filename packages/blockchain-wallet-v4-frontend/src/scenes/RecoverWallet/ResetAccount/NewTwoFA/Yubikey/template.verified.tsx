import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'

import { Button, Text } from 'blockchain-info-components'

import { Props } from '.'

const YubikeyVerified = (props: Props) => {
  return (
    <>
      <Icon label='checkmark-circle-filled' color='green600' size='lg'>
        <IconCheckCircle />
      </Icon>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.yubikeyVerify.header'
          defaultMessage='Yubikey Verified'
        />
      </Text>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.yubikeyVerify.text'
          defaultMessage='Make sure your Yubikey is plugged in next time you log into your Blockchain account.'
        />
      </Text>

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
