import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { isMobile } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = () => {
  return (
    <Wrapper>
      <Icon name='checkmark-circle-filled' color='success' size='32px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.accountrecovery.verified'
          defaultMessage='Account recovery started!'
        />
      </Text>

      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.verifyaccountrecovery.previous'
          defaultMessage='Return to the previous tab to continue recovering your Blockchain.com Account.'
        />
      </Text>
    </Wrapper>
  )
}

export default Success
