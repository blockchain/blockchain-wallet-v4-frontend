import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Text, Button } from 'blockchain-info-components'
import {
  kycHeaderHelper,
  kycNotificationBodyHelper,
  kycNotificationButtonHelper
} from 'services/CoinifyService'
import { spacing } from 'services/StyleService'
import { path } from 'ramda'
import media from 'services/ResponsiveService'

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
const LimitsNotice = styled.div`
  background-color: #ffe6b4;
  padding: 12px 15px;
  margin-bottom: 20px;
  ${media.mobile`
    margin: 10px 0px;
  `};
`

const KYCNotification = props => {
  const { kyc, onTrigger, symbol, limits, type, canTrade } = props

  const status = path(['state'], kyc)
  const header = kycHeaderHelper(status)
  const body = kycNotificationBodyHelper(status)

  let effBal = limits.effectiveMax / 1e8
  let sellMax = Math.min(effBal, limits.max)

  return (
    <Wrapper>
      {(status === 'pending' || status === 'reviewing') && canTrade ? (
        <LimitsNotice>
          <Text size='12px' weight={300}>
            {type === 'sell' ? (
              <Fragment>
                <FormattedMessage
                  id='scenes.buysell.coinifycheckout.content.kycnotification.limitsnotice.sell'
                  defaultMessage='While your identity gets verified, you can sell up to '
                />
                {sellMax} BTC.
              </Fragment>
            ) : (
              <Fragment>
                <FormattedMessage
                  id='scenes.buysell.coinifycheckout.content.kycnotification.limitsnotice.buy'
                  defaultMessage='While your identity gets verified, you can buy up to '
                />
                {symbol}
                {limits.max}.
              </Fragment>
            )}
          </Text>
        </LimitsNotice>
      ) : null}
      <ISXContainer>
        <Text
          size='13px'
          color='brand-primary'
          weight={400}
          style={spacing('mb-20')}
        >
          {path(['text'], header)}
        </Text>
        <Text size='13px' weight={300} style={spacing('mb-20')}>
          {path(['text'], body)}
        </Text>
        {status === 'pending' ||
        status === 'rejected' ||
        status === 'expired' ? (
          <Button onClick={() => onTrigger(kyc)} nature='empty-secondary'>
            <Text size='13px' color='brand-secondary'>
              {path(['text'], kycNotificationButtonHelper(status))}
            </Text>
          </Button>
        ) : null}
      </ISXContainer>
    </Wrapper>
  )
}

export default KYCNotification
