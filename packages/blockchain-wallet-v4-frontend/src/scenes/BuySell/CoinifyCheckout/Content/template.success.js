import React from 'react'
import styled from 'styled-components'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { OrderDetails, OrderSubmit } from './OrderReview'
import { Remote } from 'blockchain-wallet-v4/src'
import { flex } from 'services/StyleService'

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
    ...rest } = props

  const profile = Remote.of(props.value.profile).getOrElse({ account: { verification_status: {} }, limits: { buy: 0, sell: 0 } })

  const defaultCurrency = currency || profile._level.currency

  const { trades, type, busy } = rest
  // return (
  //   <div>
  //     <p>Coinify Success Template - user has profile</p>
  //     {
  //       props.rateQuote
  //         ? <p>Rate: 1 BTC = {props.rateQuote.quoteAmount} {props.rateQuote.quoteCurrency}</p>
  //         : <p>Rate Loading..</p>
  //     }
  //     <button onClick={() => props.showModal('CoinifyExchangeData', { step: 'order' })}>open modal at order step</button>
  //   </div>
  // )
  console.log('coinify success template', props)
  const limits = {
    buy: {
      min: 10,
      max: 300
    }
    // sell: {
    //   min: 10,
    //   max: profile.limits.sell,
    //   effectiveMax: payment && payment.effectiveBalance
    // }
  }
  console.log('rateQuoteR', rateQuoteR.map(q => console.log(q)))
  if (type === 'buy' || !type) {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={buyQuoteR}
              rateQuoteR={rateQuoteR}
              // account={accounts[0]}
              onFetchQuote={fetchBuyQuote}
              limits={limits.buy}
              type={'buy'}
              reason={'has_remaining'} // placeholder for now - coinify does not require a reason
              defaultCurrency={defaultCurrency}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={buyQuoteR}
                // account={accounts[0]}
                onRefreshQuote={refreshQuote}
                type={'buy'}
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
