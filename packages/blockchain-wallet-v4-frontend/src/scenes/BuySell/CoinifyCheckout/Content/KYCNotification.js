import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import { kycHeaderHelper, kycNotificationBodyHelper, kycNotificationButtonHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #DDDDDD;
`

const KYCNotification = (props) => {
  const state = props.state
  const header = kycHeaderHelper(state)
  const body = kycNotificationBodyHelper(state)

  return (
    <ISXContainer>
      <Text size='14px' color='brand-primary' weight={300} style={spacing('mb-20')}>
        { header.text }
      </Text>
      <Text size='14px' weight={300} style={spacing('mb-20')}>
        { body.text }
      </Text>
      {
        state === 'pending' || state === 'rejected'
          ? <Button nature='empty-secondary'>
            <Text size='14px' color='brand-secondary'>
              { kycNotificationButtonHelper(state)['text'] }
            </Text>
          </Button>
          : null
      }
    </ISXContainer>
  )
}

export default KYCNotification
