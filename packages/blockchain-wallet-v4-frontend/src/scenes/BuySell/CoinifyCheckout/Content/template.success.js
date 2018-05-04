import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { Text } from 'blockchain-info-components'
import { OrderDetails, OrderSubmit } from './OrderReview'
import { Remote } from 'blockchain-wallet-v4/src'
import { flex } from 'services/StyleService'
import * as service from 'services/CoinifyService'
import Payment from '../../../../modals/CoinifyExchangeData/Payment'
import OrderHistory from '../../OrderHistory'
import { filter } from 'ramda'

const CheckoutWrapper = styled.div`
  width: 55%;
`
const OrderSubmitWrapper = CheckoutWrapper.extend`
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
const isPending = (t) => t.state === 'processing' || t.state === 'awaiting_transfer_in'
const isCompleted = (t) => t.state !== 'awaiting_transfer_in'

const Success = props => {
  const {
    changeBuySellTabStatus,
    fetchBuyQuote,
    fetchSellQuote,
    refreshQuote,
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
    initiateBuy,
    step,
    busy,
    ...rest } = props

  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })

  const defaultCurrency = currency || 'EUR'// profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const { trades, type } = rest

  const limits = service.getLimits(profile._limits, defaultCurrency)
  console.log('trades', trades)
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
                  onSubmit={initiateBuy}
                  busy={busy}
                  clearTradeError={clearTradeError}
                />
              </OrderSubmitWrapper>
            </div>
          </StepView>
        </Stepper>
      )
    }
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
