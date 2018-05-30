import React from 'react'
import styled from 'styled-components'
import { head, path } from 'ramda'

import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import AddBankDetails from './AddBankDetails'
import AddCustomerDetails from './AddCustomerDetails'
import SelectAccounts from './SelectAccounts'
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
    setEffectiveMax,
    setMin,
    paymentMedium,
    initiateSell,
    step,
    busy,
    trade,
    value,
    onOrderCheckoutSubmit,
    checkoutError,
    handleKycAction
  } = props

  const profile = value.profile || { _limits: service.mockedLimits, _level: { currency: 'EUR' } }
  const kyc = value.kycs.length && head(value.kycs)
  const defaultCurrency = currency || 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency, path(['payment', 'effectiveBalance'], value))

  if (step !== 'isx') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <div>
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
                setEffectiveMax={setEffectiveMax}
                setMin={setMin}
                onOrderCheckoutSubmit={onOrderCheckoutSubmit}
                checkoutError={checkoutError}
                increaseLimit={handleKycAction}
              />
            </div>
            <div>
              {
                value.kycs.length
                  ? <KYCNotification kyc={kyc} limits={limits.sell} symbol={symbol} onTrigger={(kyc) => handleKycAction(kyc)} />
                  : null
              }
            </div>
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <SelectAccounts />
        </StepView>
        <StepView step={2}>
          <AddBankDetails quoteR={sellQuoteR} />
        </StepView>
        <StepView step={3}>
          <AddCustomerDetails />
        </StepView>
        <StepView step={4}>
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
