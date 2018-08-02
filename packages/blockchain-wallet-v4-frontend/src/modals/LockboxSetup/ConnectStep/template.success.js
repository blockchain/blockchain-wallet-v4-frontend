import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Success = props => {
  return (
    <React.Fragment>
      <Text size='16px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.connectstep.connected'
          defaultMessage='Device connected successfully!'
        />
      </Text>
    </React.Fragment>
  )
}

export default Success
