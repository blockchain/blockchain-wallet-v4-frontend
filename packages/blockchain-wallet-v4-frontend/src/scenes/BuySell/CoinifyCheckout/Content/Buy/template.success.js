import React from 'react'
import styled from 'styled-components'
import { contains, prop } from 'ramda'

import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'components/BuySell/Coinify/Payment'
import ISignThis from 'components/BuySell/Coinify/ISignThis'
import KYCNotification from '../KYCNotification'
import NextSubscription from '../NextSubscription'
import BankTransferDetails from 'components/BuySell/BankTransferDetails'
import media from 'services/ResponsiveService'

export const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 450px 300px;
  grid-gap: 5%;
  grid-auto-rows: 1fr;
  ${media.laptop`
    grid-template-columns: 50% 45%;
  `};
  ${media.mobile`
    display: flex;
    flex-direction: column;
  `};
`
const OrderSubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const BankTransferWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  margin: 0 auto;
  align-items: center;
`
const RightContainer = styled.div``

const CoinifyBuy = props => {
  const {
    value,
    fetchBuyQuote,
    refreshQuote,
    buyQuoteR,
    cannotTradeReason,
    canTradeAfter,
    clearTradeError,
    currency,
    checkoutBusy,
    checkoutError,
    setMax,
    setMin,
    paymentMedium,
    initiateBuy,
    step,
    busy,
    trade,
    handleKycAction,
    changeTab,
    coinifyNextCheckoutStep,
    canTrade,
    subscriptions,
    trades,
    kycState,
    kycVerified
  } = props

  const profile = Remote.of(prop('profile', value)).getOrElse({
    _limits: service.mockedLimits,
    _level: { currency: 'EUR' }
  })
  const buyCurrencies = ['EUR', 'DKK', 'GBP', 'USD']
  const defaultCurrency = contains(currency, buyCurrencies) ? currency : 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]
  const activeSubscriptions = subscriptions.filter(s => s.isActive)
  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (step === 'checkout') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              cannotTradeReason={cannotTradeReason}
              canTrade={canTrade}
              canTradeAfter={canTradeAfter}
              checkoutBusy={checkoutBusy}
              checkoutError={checkoutError}
              defaultCurrency={defaultCurrency}
              increaseLimit={handleKycAction}
              limits={limits.buy}
              onFetchQuote={fetchBuyQuote}
              quoteR={buyQuoteR}
              reason={'has_remaining'} // placeholder for now - coinify does not require a reason
              symbol={symbol}
              setMax={setMax}
              setMin={setMin}
              type={'buy'}
              verified={kycVerified}
            />
            <RightContainer>
              {activeSubscriptions.length > 0 ? (
                <NextSubscription
                  subscriptions={subscriptions}
                  trades={trades.filter(t => t.tradeSubscriptionId)}
                  manageOrder={() => changeTab('order_history')}
                />
              ) : null}
              {!kycVerified ? (
                <KYCNotification
                  limits={limits.buy}
                  symbol={symbol}
                  onTrigger={handleKycAction}
                  canTrade={canTrade}
                  kycState={kycState}
                />
              ) : null}
            </RightContainer>
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <Payment />
        </StepView>
        <StepView step={2}>
          <OrderDetails
            quoteR={buyQuoteR}
            onRefreshQuote={refreshQuote}
            type={'buy'}
            medium={paymentMedium}
          />
          <OrderSubmitWrapper>
            <OrderSubmit
              quoteR={buyQuoteR}
              onSubmit={initiateBuy}
              busy={busy}
              type={'buy'}
              clearTradeError={clearTradeError}
            />
          </OrderSubmitWrapper>
        </StepView>
      </Stepper>
    )
  } else if (step === 'isx') {
    return (
      <ISignThis
        iSignThisId={prop('iSignThisID', trade)}
        options={props.options}
      />
    )
  } else if (step === 'bankTransferDetails') {
    return (
      <BankTransferWrapper>
        <BankTransferDetails trade={trade} />
        <Button
          nature='primary'
          width='85%'
          onClick={() => {
            changeTab('order_history')
            coinifyNextCheckoutStep('checkout')
          }}
        >
          <FormattedMessage
            id='scenes.buysell.coinifycheckout.content.buy.close'
            defaultMessage='Close'
          />
        </Button>
      </BankTransferWrapper>
    )
  }
}

export default CoinifyBuy
