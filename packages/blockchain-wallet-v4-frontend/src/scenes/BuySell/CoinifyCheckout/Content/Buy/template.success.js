import React from 'react'
import styled from 'styled-components'
import { contains, prop, equals, isEmpty } from 'ramda'

import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'modals/CoinifyExchangeData/Payment'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'
import KYCNotification from '../KYCNotification'
import NextSubscription from '../NextSubscription'
import BankTransferDetails from 'components/BuySell/BankTransferDetails'
import media from 'services/ResponsiveService'

const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 40%;
  grid-gap: 5%;
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
const RightContainer = styled.div``
const LeftContainer = styled.div``

const CoinifyBuy = props => {
  const {
    busy,
    buyQuoteR,
    canTrade,
    changeTab,
    checkoutBusy,
    clearTradeError,
    coinifyNextCheckoutStep,
    countryCode,
    currency,
    fetchBuyQuote,
    handleKycAction,
    initiateBuy,
    openRecurringConfirmModal,
    paymentMedium,
    refreshQuote,
    setMax,
    setMin,
    showRecurringBuy,
    showRecurringModal,
    step,
    subscription,
    subscriptions,
    subscriptionData,
    trade,
    trades,
    value
  } = props

  const profile = Remote.of(prop('profile', value)).getOrElse({
    _limits: service.mockedLimits,
    _level: { currency: 'EUR' }
  })
  const kyc = prop('kyc', value)
  const buyCurrencies = ['EUR', 'DKK', 'GBP', 'USD']
  const defaultCurrency = contains(currency, buyCurrencies) ? currency : 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]
  const activeSubscriptions = subscriptions.filter(s => s.isActive)

  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (equals(step, 'checkout')) {
    return (
      <CheckoutWrapper>
        <LeftContainer>
          <OrderCheckout
            checkoutBusy={checkoutBusy}
            coinifyNextCheckoutStep={coinifyNextCheckoutStep}
            countryCode={countryCode}
            defaultCurrency={defaultCurrency}
            increaseLimit={handleKycAction}
            limits={limits.buy}
            onFetchQuote={fetchBuyQuote}
            openRecurringConfirmModal={openRecurringConfirmModal}
            quoteR={buyQuoteR}
            reason={'has_remaining'}
            setMax={setMax}
            setMin={setMin}
            showRecurringBuy={showRecurringBuy}
            showRecurringModal={showRecurringModal}
            symbol={symbol}
            type={'buy'}
          />
        </LeftContainer>
        <RightContainer>
          {!isEmpty(activeSubscriptions) ? (
            <NextSubscription
              subscriptions={subscriptions}
              trades={trades.filter(prop('tradeSubscriptionId'))}
              manageOrder={() => changeTab('order_history')}
            />
          ) : null}
          {prop('state', kyc) ? (
            <KYCNotification
              kyc={kyc}
              limits={limits.buy}
              symbol={symbol}
              onTrigger={kyc => handleKycAction(kyc)}
              canTrade={canTrade}
            />
          ) : null}
        </RightContainer>
      </CheckoutWrapper>
    )
  } else if (equals(step, 'payment')) {
    return <Payment />
  } else if (equals(step, 'isx')) {
    return (
      <ISignThis
        iSignThisId={prop('iSignThisID', trade)}
        options={props.options}
      />
    )
  } else if (equals(step, 'summary')) {
    return (
      <CheckoutWrapper>
        <OrderDetails
          quoteR={buyQuoteR}
          onRefreshQuote={refreshQuote}
          type={'buy'}
          medium={paymentMedium}
          subscription={subscription}
          subscriptionData={subscriptionData}
        />
        <OrderSubmitWrapper>
          <OrderSubmit
            quoteR={buyQuoteR}
            onSubmit={initiateBuy}
            busy={busy}
            type={'buy'}
            clearTradeError={clearTradeError}
            coinifyNextCheckoutStep={coinifyNextCheckoutStep}
          />
        </OrderSubmitWrapper>
      </CheckoutWrapper>
    )
  } else if (equals(step, 'bankTranferDetails')) {
    return (
      <CheckoutWrapper>
        <BankTransferDetails trade={trade} />
        <RightContainer>
          <Button
            nature='primary'
            width='85%'
            onClick={() => {
              changeTab('order_history')
              coinifyNextCheckoutStep('checkout')
            }}
          >
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </RightContainer>
      </CheckoutWrapper>
    )
  }
}

export default CoinifyBuy
