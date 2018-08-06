import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const ConfirmRecoveryStep = props => {
  const { handleSubmit } = props

  return (
    <div>
      <Text size='16px' weight={400}>
        <FormattedMessage
          id='modals.lockboxsetup.confirmrecovery.step3.title'
          defaultMessage='Do you want to save you public keys?'
        />
      </Text>
      <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='modals.lockboxsetup.confirmrecovery.step3.subtitle'
          defaultMessage='Storing your public key will allow you to view your Lockbox balances and receive funds without plugging in your Carbon.'
        />
      </Text>
      <Button
        style={{ marginTop: '25px' }}
        fullwidth
        type='submit'
        nature='primary'
      >
        <FormattedMessage
          id='modals.lockboxsetup.confirmrecovery.step3.yes'
          defaultMessage='Yes, I want to see my balance always'
        />
      </Button>
      <Button
        style={{ marginTop: '5px' }}
        fullwidth
        type='submit'
        nature='sent'
      >
        <FormattedMessage
          id='modals.lockboxsetup.confirmrecovery.step3.no'
          defaultMessage='No thank you'
        />
      </Button>
    </div>
  )
}

export default ConfirmRecoveryStep
