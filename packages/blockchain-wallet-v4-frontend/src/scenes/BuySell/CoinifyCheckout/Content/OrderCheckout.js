import { FormattedMessage } from 'react-intl'
import { getReasonExplanation } from 'services/CoinifyService'
import { Icon, Text } from 'blockchain-info-components'
import { rateHelper, submitButtonHelper, wantToHelper } from './Helpers'
import media from 'services/ResponsiveService'
import QuoteInput from './QuoteInput'
import React, { Fragment } from 'react'
import styled from 'styled-components'

const ExchangeCheckoutWrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 10px;
`
const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`
const RateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`
const QuoteInputWrapper = styled.div`
  margin-top: 5px;
`
const SubmitButtonWrapper = styled.div`
  margin-top: 35px;
`
const WantToText = styled(Text)`
  ${media.mobile`
    margin-bottom: 20px;
  `};
`

const OrderCheckout = ({
  account,
  busy,
  cannotTradeReason,
  canTrade,
  canTradeAfter,
  changeTab,
  checkoutBusy,
  checkoutError,
  defaultCurrency,
  limits,
  onOrderCheckoutSubmit,
  quoteR,
  rateQuoteR,
  reason,
  setMax,
  setMin,
  type,
  verified
}) => {
  const reasonExplanation =
    (cannotTradeReason || !verified) &&
    getReasonExplanation(cannotTradeReason, canTradeAfter, verified)

  return (
    <ExchangeCheckoutWrapper>
      <TopContainer>
        <Icon name='btc-circle-filled' color='btc' size='45px' />
        <RateContainer>
          <Text>
            <FormattedMessage id='bitcoin' defaultMessage='Bitcoin' />
          </Text>
          <Text size='14px'>1 BTC = {rateHelper(rateQuoteR)}</Text>
        </RateContainer>
      </TopContainer>
      {reason.indexOf('has_remaining') > -1 ? (
        <Fragment>
          <WantToText size='14px'>{wantToHelper(type)}</WantToText>
          <QuoteInputWrapper>
            <QuoteInput
              limits={limits}
              type={type}
              defaultCurrency={defaultCurrency}
              verified={verified}
            />
          </QuoteInputWrapper>
        </Fragment>
      ) : null}
      <SubmitButtonWrapper>
        {submitButtonHelper(
          checkoutError,
          limits,
          defaultCurrency,
          setMax,
          setMin,
          changeTab,
          canTrade,
          reasonExplanation,
          reason,
          onOrderCheckoutSubmit,
          verified,
          checkoutBusy,
          quoteR,
          type
        )}
      </SubmitButtonWrapper>
    </ExchangeCheckoutWrapper>
  )
}

export default OrderCheckout
