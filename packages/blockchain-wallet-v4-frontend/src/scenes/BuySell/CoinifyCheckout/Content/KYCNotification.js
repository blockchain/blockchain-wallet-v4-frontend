import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button } from 'blockchain-info-components'
import { kycHeaderHelper, kycNotificationBodyHelper, kycNotificationButtonHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'
import { path } from 'ramda'

const ISXContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #DDDDDD;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const LimitsNotice = styled.div`
  background-color: #FFE6B4;
  padding: 12px 15px;
  margin-bottom: 20px;
`

const KYCNotification = (props) => {
  const { kyc, onTrigger, symbol, limits } = props

  const state = path(['state'], kyc)
  const header = kycHeaderHelper(state)
  const body = kycNotificationBodyHelper(state)

  return (
    <Wrapper>
      {
        state === 'pending'
          ? <LimitsNotice>
            <Text size='12px' weight={300}>
              <FormattedMessage id='kyc.limits_notice' defaultMessage='While your identity gets verified, you can buy and sell up {symbol}{limit} to using your credit/debit card.' values={{ symbol: symbol, limit: limits.max }} />
            </Text>
          </LimitsNotice>
          : null
      }
      <ISXContainer>
        <Text size='13px' color='brand-primary' weight={300} style={spacing('mb-20')}>
          { header.text }
        </Text>
        <Text size='13px' weight={300} style={spacing('mb-20')}>
          { body.text }
        </Text>
        {
          state === 'pending' || state === 'rejected'
            ? <Button onClick={() => onTrigger(kyc)} nature='empty-secondary'>
              <Text size='13px' color='brand-secondary'>
                { kycNotificationButtonHelper(state)['text'] }
              </Text>
            </Button>
            : null
        }
      </ISXContainer>
    </Wrapper>
  )
}

export default KYCNotification
