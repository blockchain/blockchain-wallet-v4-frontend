import { Button, Text } from 'blockchain-info-components'
import { equals, prop } from 'ramda'
import { FormattedMessage } from 'react-intl'
import {
  kycHeaderHelper,
  kycNotificationBodyHelper
} from 'services/CoinifyService'
import { model } from 'data'
import { spacing } from 'services/StyleService'
import React, { Fragment } from 'react'
import styled from 'styled-components'

const { NONE } = model.profile.KYC_STATES

const Wrapper = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 10px;
  margin-bottom: 15px;
`
const KycContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  flex-direction: column;
  display: flex;
  div:first-child {
    margin-bottom: 5px;
  }
`
const Divider = styled.div`
  border-bottom: 1px solid ${props => props.theme.grey000};
  padding-top: 20px;
  margin-bottom: 20px;
`
const CompleteButton = styled(Button)`
  border-radius: 6px;
`
const VerificationText = styled(Text)`
  margin-top: 20px;
`

const KYCNotification = props => {
  const { onTrigger, kycState } = props

  const header = kycHeaderHelper(kycState)
  const body = kycNotificationBodyHelper(kycState)

  return (
    <Wrapper>
      <KycContainer>
        <Header>
          <Text size='16px' weight={600}>
            <FormattedMessage
              id='scenes.buy_sell.kyc_notification.header'
              defaultMessage='Identity Verification'
            />
          </Text>
          <Text size='14px' color={prop('color', header)} weight={500}>
            {prop('text', header)}
          </Text>
        </Header>
        <Divider />
        <Text size='13px' weight={400} style={spacing('mb-20')}>
          {prop('text', body)}
        </Text>
        {equals(NONE, kycState) ? (
          <Fragment>
            <CompleteButton onClick={onTrigger} nature='empty-secondary'>
              <Text size='14px' color='blue600'>
                <FormattedMessage
                  id='scenes.buy_sell.kyc_notification.complete'
                  defaultMessage='Complete Verification'
                />
              </Text>
            </CompleteButton>
            <VerificationText size='12px' weight={400}>
              <FormattedMessage
                id='scenes.buy_sell.kyc_notification.note'
                defaultMessage='*Please note, users who have verified their identity with Coinify before November 2018 will need to verify their identity with us again. We apologize for the inconvenience.'
              />
            </VerificationText>
          </Fragment>
        ) : null}
      </KycContainer>
    </Wrapper>
  )
}

export default KYCNotification
