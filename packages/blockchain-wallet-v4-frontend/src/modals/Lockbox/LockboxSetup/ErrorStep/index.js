import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

class ErrorStepContainer extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.lockboxsetup.duplicatedevice.title'
            defaultMessage='Whoops!'
          />
        </Text>
        <Text size='13px' weight={400} style={{ marginTop: '10px' }}>
          <FormattedMessage
            id='modals.lockboxsetup.duplicatedevice.subtitle'
            defaultMessage='This device has already been associated with your Blockchain Wallet. Please connect a new device and restart this process.'
          />
        </Text>
        <Button
          style={{ marginTop: '25px' }}
          fullwidth
          type='submit'
          nature='primary'
          onClick={this.props.onClose}
        >
          <FormattedMessage
            id='modals.lockboxsetup.duplicatedevice.continue'
            defaultMessage='OK'
          />
        </Button>
      </React.Fragment>
    )
  }
}

export default ErrorStepContainer
