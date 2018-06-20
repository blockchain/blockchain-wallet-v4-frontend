import React from 'react'
import styled from 'styled-components'
import { contains, path, prop } from 'ramda'

import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'modals/CoinifyExchangeData/Payment'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'
import KYCNotification from '../KYCNotification'
import NextSubscription from '../NextSubscription'
import BankTransferDetails from 'components/BuySell/BankTransferDetails'

const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 40%;
  grid-gap: 5%;
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
    value,
    fetchBuyQuote,
    refreshQuote,
    buyQuoteR,
    clearTradeError,
    currency,
    checkoutBusy,
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
    trades
  } = props

  const profile = Remote.of(prop('profile', value)).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })
  const kyc = prop('kyc', value)
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
            <LeftContainer>
              <OrderCheckout
                quoteR={buyQuoteR}
                onFetchQuote={fetchBuyQuote}
                limits={limits.buy}
                type={'buy'}
                reason={'has_remaining'} // placeholder for now - coinify does not require a reason
                defaultCurrency={defaultCurrency}
                symbol={symbol}
                checkoutBusy={checkoutBusy}
                setMax={setMax}
                setMin={setMin}
                increaseLimit={handleKycAction}
              />
            </LeftContainer>
            <RightContainer>
              {
                activeSubscriptions.length > 0
                  ? <NextSubscription subscriptions={subscriptions} trades={trades.filter(t => t.tradeSubscriptionId)} manageOrder={() => changeTab('order_history')} />
                  : null
              }
              {
                path(['state'], kyc)
                  ? <KYCNotification kyc={kyc} limits={limits.buy} symbol={symbol} onTrigger={(kyc) => handleKycAction(kyc)} canTrade={canTrade} />
                  : null
              }
            </RightContainer>
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <Payment />
        </StepView>
        <StepView step={2}>
          <CheckoutWrapper>
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
          </CheckoutWrapper>
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
  } else if (step === 'bankTransferDetails') {
    return (
      <CheckoutWrapper>
        <BankTransferDetails trade={trade} />
        <RightContainer>
          <Button nature='primary' width='85%' onClick={() => { changeTab('order_history'); coinifyNextCheckoutStep('checkout') }}>
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </RightContainer>
      </CheckoutWrapper>
    )
  }
}

export default CoinifyBuy
