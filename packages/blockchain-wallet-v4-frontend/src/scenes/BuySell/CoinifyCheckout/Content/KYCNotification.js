import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import { kycHeaderHelper, kycNotificationBodyHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #DDDDDD;
`

const KYCNotification = (props) => {
  const header = kycHeaderHelper('processing')
  const body = kycNotificationBodyHelper('processing')

  return (
    <ISXContainer>
      <Text size='14px' color='brand-primary' weight={300} style={spacing('mb-10')}>
        { header.text }
      </Text>
      <Text size='14px' weight={300} style={spacing('mb-20')}>
        { body.text }
      </Text>
      <Button nature='empty-secondary'>
        <Text size='14px' color='brand-secondary'>
          <FormattedMessage id='coinify.kyc_notification.complete' defaultMessage='Complete Verification' />
        </Text>
      </Button>
    </ISXContainer>
  )
}

export default KYCNotification
