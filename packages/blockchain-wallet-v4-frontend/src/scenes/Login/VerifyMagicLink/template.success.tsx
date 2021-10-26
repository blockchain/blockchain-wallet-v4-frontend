import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const SuccessWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = () => {
  return (
    <SuccessWrapper>
      <Icon color='success' name='checkmark-circle-filled' size='40px' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.login.device_verified'
          defaultMessage='Your device is verified!'
        />
      </Text>

      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.login.device_verified.copy'
          defaultMessage='Return to previous browser to continue logging in.'
        />
      </Text>
    </SuccessWrapper>
  )
}

export default Success
