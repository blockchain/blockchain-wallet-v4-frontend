import React from 'react'
import styled from 'styled-components'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { OrderDetails, OrderSubmit } from './OrderReview'
import { Remote } from 'blockchain-wallet-v4/src'
import { flex } from 'services/StyleService'
import * as service from 'services/CoinifyService'
import Payment from '../../../../modals/CoinifyExchangeData/Payment'

const CheckoutWrapper = styled.div`
  width: 55%;
`
const OrderSubmitWrapper = CheckoutWrapper.extend`
  width: 35%;
  padding: 30px 30px 30px 10%;
`

const Success = props => {
  const {
    changeBuySellTabStatus,
    fetchBuyQuote,
    fetchSellQuote,
    refreshQuote,
    submitBuyQuote,
    submitSellQuote,
    handleTrade,
    buyQuoteR,
    sellQuoteR,
    base,
    errors,
    showModal,
    handleTradeDetailsClick,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
    paymentMedium,
    ...rest } = props

  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })

  const defaultCurrency = currency || 'EUR'// profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const { trades, type, busy } = rest

  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (type === 'buy' || !type) {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={buyQuoteR}
              rateQuoteR={rateQuoteR}
              onFetchQuote={fetchBuyQuote}
              limits={limits.buy}
              type={'buy'}
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
          <div style={flex('row')}>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={buyQuoteR}
                onRefreshQuote={refreshQuote}
                type={'buy'}
                medium={paymentMedium}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper style={{ ...flex('col') }}>
              <OrderSubmit
                quoteR={buyQuoteR}
                onSubmit={submitBuyQuote}
                busy={busy}
                clearTradeError={clearTradeError}
              />
            </OrderSubmitWrapper>
          </div>
        </StepView>
      </Stepper>
    )
  }
}

export default Success
