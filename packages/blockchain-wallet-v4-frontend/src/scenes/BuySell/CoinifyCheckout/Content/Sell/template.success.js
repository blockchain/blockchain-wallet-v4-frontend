import React from 'react'
import styled from 'styled-components'
import { contains, head, path } from 'ramda'

import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import AddBankDetails from './AddBankDetails'
import AddCustomerDetails from './AddCustomerDetails'
import SelectAccounts from './SelectAccounts'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'
import KYCNotification from '../KYCNotification'
import { ColLeft, ColRight, ColRightInner, Row } from 'components/BuySell/Signup'

const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 35%;
  grid-gap: 10%;
`

const Sell = props => {
  const {
    canTrade,
    fetchSellQuote,
    refreshQuote,
    sellQuoteR,
    clearTradeError,
    currency,
    rateQuoteR,
    checkoutBusy,
    setMax,
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
  const sellCurrencies = ['EUR', 'DKK', 'GBP']
  const defaultCurrency = contains(currency, sellCurrencies) ? currency : 'EUR' // profile._level.currency
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
                setMin={setMin}
                onOrderCheckoutSubmit={onOrderCheckoutSubmit}
                checkoutError={checkoutError}
                increaseLimit={handleKycAction}
              />
            </div>
            <div>
              {
                path(['kycs', 'length'], value)
                  ? <KYCNotification kyc={kyc} limits={limits.sell} symbol={symbol} onTrigger={(kyc) => handleKycAction(kyc)} type='sell' canTrade={canTrade} />
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
          <Row>
            <ColLeft>
              <OrderDetails
                quoteR={sellQuoteR}
                onRefreshQuote={refreshQuote}
                type={'sell'}
                medium={paymentMedium}
              />
            </ColLeft>
            <ColRight>
              <ColRightInner>
                <OrderSubmit
                  quoteR={sellQuoteR}
                  onSubmit={initiateSell}
                  busy={busy}
                  type='sell'
                  clearTradeError={clearTradeError}
                />
              </ColRightInner>
            </ColRight>
          </Row>
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
