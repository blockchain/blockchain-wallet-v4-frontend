import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Failure = props => {
  return (
    <React.Fragment>
      <Text size='16px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.connectstep.error'
          defaultMessage='Unable to connect to your device. Please make sure your device is connected and the bitcoin app is open!'
        />
      </Text>
    </React.Fragment>
  )
}

export default Failure
