import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Text, Button } from 'blockchain-info-components'
import {
  kycHeaderHelper,
  kycNotificationBodyHelper
} from 'services/CoinifyService'
import { spacing } from 'services/StyleService'
import { prop, equals } from 'ramda'
import { model } from 'data'

const { NONE } = model.profile.KYC_STATES

const ISXContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  border: 1px solid #dddddd;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const KYCNotification = props => {
  const { onTrigger, kycState } = props

  const header = kycHeaderHelper(kycState)
  const body = kycNotificationBodyHelper(kycState)

  return (
    <Wrapper>
      <ISXContainer>
        <Text
          size='13px'
          color={prop('color', header)}
          weight={400}
          style={spacing('mb-20')}
        >
          {prop('text', header)}
        </Text>
        <Text size='13px' weight={300} style={spacing('mb-20')}>
          {prop('text', body)}
        </Text>
        {equals(NONE, kycState) ? (
          <Button onClick={onTrigger} nature='empty-secondary'>
            <Text size='13px' color='brand-secondary'>
              <FormattedMessage
                id='scenes.buy_sell.kyc_notification.complete'
                defaultMessage='Complete Verification'
              />
            </Text>
          </Button>
        ) : null}
      </ISXContainer>
    </Wrapper>
  )
}

export default KYCNotification
