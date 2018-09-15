import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const AuthenticityError = props => {
  const { handleContinue } = props

  return (
    <div>
      <Text size='16px' weight={400}>
        <FormattedMessage
          id='modals.lockboxsetup.authenticityerrorstep.title'
          defaultMessage='Whoops!'
        />
      </Text>
      <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='modals.lockboxsetup.authenticityerrorstep.subtitle'
          defaultMessage='This device appears to be non-genuine. Please try the setup again or contact support if this issue persists.'
        />
      </Text>
      <Button
        style={{ marginTop: '25px' }}
        fullwidth
        type='submit'
        nature='primary'
        onClick={() => {
          handleContinue()
        }}
      >
        <FormattedMessage
          id='modals.lockboxsetup.authenticityerrorstep.continue'
          defaultMessage='Continue'
        />
      </Button>
    </div>
  )
}

export default AuthenticityError
