import React from 'react'
import styled from 'styled-components'
import { path, head } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'modals/CoinifyExchangeData/Payment'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'
import KYCNotification from '../KYCNotification'
const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 35%;
  grid-gap: 10%;
`
const OrderSubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  padding: 30px 30px 30px 10%;
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`
const RightContainer = styled.div``
const LeftContainer = styled.div``

const Buy = props => {
  const {
    value,
    fetchBuyQuote,
    refreshQuote,
    buyQuoteR,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
    paymentMedium,
    initiateBuy,
    step,
    busy,
    trade,
    handleKycAction
  } = props

  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })
  const kyc = value.kycs.length && head(value.kycs)
  const defaultCurrency = currency || 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency)
  // console.log(kyc, value)
  if (step !== 'isx') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <LeftContainer>
              <OrderCheckout
                quoteR={buyQuoteR}
                rateQuoteR={rateQuoteR}
                onFetchQuote={fetchBuyQuote}
                limits={limits.buy}
                reason={'has_remaining'} // placeholder for now - coinify does not require a reason
                defaultCurrency={defaultCurrency}
                symbol={symbol}
                checkoutBusy={checkoutBusy}
                setMax={setMax}
                increaseLimit={handleKycAction}
              />
            </LeftContainer>
            <RightContainer>
              {
                value.kycs.length
                  ? <KYCNotification kyc={kyc} onTrigger={(kyc) => handleKycAction(kyc)} />
                  : null
              }
            </RightContainer>
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <Payment />
        </StepView>
        <StepView step={2}>
          <FlexRow>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={buyQuoteR}
                onRefreshQuote={refreshQuote}
                type={'buy'}
                medium={paymentMedium}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper>
              <OrderSubmit
                quoteR={buyQuoteR}
                onSubmit={initiateBuy}
                busy={busy}
                clearTradeError={clearTradeError}
              />
            </OrderSubmitWrapper>
          </FlexRow>
        </StepView>
      </Stepper>
    )
  } else if (step === 'isx') {
    return (
      <ISignThis
        iSignThisId={path(['iSignThisID'], trade)}
        options={props.options}
      />
    )
  }
}

export default Buy
