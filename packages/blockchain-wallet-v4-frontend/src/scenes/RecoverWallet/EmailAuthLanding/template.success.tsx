import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconCheckCircle, SemanticColors } from '@blockchain-com/constellation'

import { Text } from 'blockchain-info-components'

const Success = () => {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <IconCheckCircle color={SemanticColors.success} size='large' />

      <Text
        size='20px'
        weight={600}
        color='black'
        style={{ marginTop: '8px', textAlign: 'center' }}
      >
        <FormattedMessage
          id='scenes.accountrecovery.verified'
          defaultMessage='Account recovery started!'
        />
      </Text>

      <Text
        color='grey900'
        style={{ marginTop: '8px', textAlign: 'center' }}
        size='16px'
        weight={500}
      >
        <FormattedMessage
          id='scenes.verifyaccountrecovery.previous'
          defaultMessage='Return to the previous tab to continue recovering your Blockchain.com Account.'
        />
      </Text>
    </Flex>
  )
}

export default Success
