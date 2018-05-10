import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'modals/CoinifyExchangeData/Payment'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'

const CheckoutWrapper = styled.div`
  width: 55%;
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

const Sell = props => {
  const {
    fetchSellQuote,
    refreshQuote,
    sellQuoteR,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
    paymentMedium,
    initiateSell,
    step,
    busy,
    trade
  } = props

  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })

  const defaultCurrency = currency || 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (step !== 'isx') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={sellQuoteR}
              rateQuoteR={rateQuoteR}
              onFetchQuote={fetchSellQuote}
              limits={limits.sell}
              type={'sell'}
              reason={'has_remaining'} // placeholder for now - coinify does not require a reason
              defaultCurrency={defaultCurrency}
              symbol={symbol}
              checkoutBusy={checkoutBusy}
              setMax={setMax}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <Payment />
        </StepView>
        <StepView step={2}>
          <FlexRow>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={sellQuoteR}
                onRefreshQuote={refreshQuote}
                type={'sell'}
                medium={paymentMedium}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper>
              <OrderSubmit
                quoteR={sellQuoteR}
                onSubmit={initiateSell}
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

export default Sell
