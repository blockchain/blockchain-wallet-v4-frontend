import React, { Fragment } from 'react'
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

const Wrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 10px;
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
  border-bottom: 1px solid ${props => props.theme['gray-1']};
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
          <Text size='14px'>
            <FormattedMessage
              id='scenes.buy_sell.kyc_notification.header'
              defaultMessage='Identity Verification'
            />
          </Text>
          <Text size='13px' color={prop('color', header)} weight={500}>
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
              <Text size='13px' color='brand-secondary'>
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
