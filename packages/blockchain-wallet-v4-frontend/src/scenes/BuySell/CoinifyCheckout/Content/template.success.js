import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, path, contains } from 'ramda'

import { Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { OrderDetails, OrderSubmit } from './OrderReview'
import Payment from '../../../../modals/CoinifyExchangeData/Payment'
import ISignThis from '../../../../modals/CoinifyExchangeData/ISignThis'
import OrderHistory from '../../OrderHistory'

const CheckoutWrapper = styled.div`
  width: 55%;
`
const OrderSubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  padding: 30px 30px 30px 10%;
`
const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

const isPending = (t) => t.state === 'processing' || t.state === 'awaiting_transfer_in'
const isCompleted = (t) => contains(t.state, ['completed', 'rejected', 'cancelled', 'expired'])

const Success = props => {
  const {
    fetchBuyQuote,
    fetchSellQuote,
    refreshQuote,
    submitSellQuote,
    buyQuoteR,
    sellQuoteR,
    showModal,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
    paymentMedium,
    initiateBuy,
    initiateSell,
    step,
    busy,
    trade,
    ...rest } = props

  const { trades, type } = rest
  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })

  const defaultCurrency = currency || 'EUR'// profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (type === 'buy' || !type) {
    if (step !== 'isx') {
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
  } else if (type === 'sell') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={buyQuoteR}
              rateQuoteR={rateQuoteR}
              onFetchQuote={fetchBuyQuote}
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
                quoteR={buyQuoteR}
                onRefreshQuote={refreshQuote}
                type={'sell'}
                medium={paymentMedium}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper>
              <OrderSubmit
                quoteR={buyQuoteR}
                onSubmit={initiateSell}
                busy={busy}
                clearTradeError={clearTradeError}
              />
            </OrderSubmitWrapper>
          </FlexRow>
        </StepView>
      </Stepper>
    )
  } else if (trades) {
    return (
      <OrderHistoryWrapper>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.pending' defaultMessage='Pending Orders' />
          </Text>
          <OrderHistory trades={filter(isPending, trades)} conversion={100} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistory trades={filter(isCompleted, trades)} conversion={100} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  }
}

export default Success
