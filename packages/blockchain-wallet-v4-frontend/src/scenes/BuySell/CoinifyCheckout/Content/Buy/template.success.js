import React from 'react'
import styled from 'styled-components'
import { path, head } from 'ramda'

import { Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import { Remote } from 'blockchain-wallet-v4/src'
import * as service from 'services/CoinifyService'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from '../OrderCheckout'
import { OrderDetails, OrderSubmit } from '../OrderReview'
import Payment from 'modals/CoinifyExchangeData/Payment'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'
import KYCNotification from '../KYCNotification'
const CheckoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 35%;
  grid-gap: 10%;
`
const BankTransferDetails = styled.div`
  display: flex;
  flex-direction: column;
`
const BankTransferDetailsTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
`
const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
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
    rateQuoteR,
    checkoutBusy,
    setMax,
    setMin,
    paymentMedium,
    initiateBuy,
    step,
    busy,
    trade,
    handleKycAction
  } = props

  const profile = Remote.of(props.value.profile).getOrElse({ _limits: service.mockedLimits, _level: { currency: 'EUR' } })
  const kyc = value.kycs.length && head(value.kycs)
  const defaultCurrency = currency || 'EUR' // profile._level.currency
  const symbol = service.currencySymbolMap[defaultCurrency]

  const limits = service.getLimits(profile._limits, defaultCurrency)

  if (step !== 'isx') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <LeftContainer>
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
                setMin={setMin}
                increaseLimit={handleKycAction}
              />
            </LeftContainer>
            <RightContainer>
              {
                value.kycs.length
                  ? <KYCNotification kyc={kyc} limits={limits.buy} symbol={symbol} onTrigger={(kyc) => handleKycAction(kyc)} />
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
    const holderAddress = trade.bankAccount.holderAddress
    const bankAddress = trade.bankAccount.bankAddress
    return (
      <CheckoutWrapper>
        <BankTransferDetails>
          <Text size='30px' weight={400}>
            <FormattedMessage id='coinify.banktransferdetails.header' defaultMessage='Bank Transfer Order Details' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='coinify.banktransferdetails.sendamount' defaultMessage="Please send {amount} {currency} to Coinify's bank account below within the next 48 hours." values={{ amount: trade.sendAmount / 100, curency: trade.inCurrency }} />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='coinify.banktransferdetails.directions' defaultMessage='Funds must come from your bank account, which needs to be in the same name as your government issued ID. Coinify will reject any transfers from third party accounts not in your name.' />
          </Text>
          <BankTransferDetailsTable>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.recipientname' defaultMessage='Recipient Name:' />
              </Text>
              <Text size='13px' weight={300}>
                { `${trade.bankAccount.holderName}` }
              </Text>
            </DetailsRow>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.recipientaddress' defaultMessage='Recipient Address:' />
              </Text>
              <Text size='13px' weight={300}>
                { `${holderAddress.street}, ${holderAddress.zipcode} ${holderAddress.city}, ${holderAddress.country}` }
              </Text>
            </DetailsRow>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.iban' defaultMessage='IBAN:' />
              </Text>
              <Text size='13px' weight={300}>
                { `${trade.bankAccount.number}` }
              </Text>
            </DetailsRow>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.bic' defaultMessage='BIC:' />
              </Text>
              <Text size='13px' weight={300}>
                { `${trade.bankAccount.bic}` }
              </Text>
            </DetailsRow>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.bankaddress' defaultMessage='Bank:' />
              </Text>
              <Text size='13px' weight={300}>
                { `${trade.bankAccount.bankName}, ${bankAddress.street}, ${bankAddress.zipcode} ${bankAddress.city}, ${bankAddress.country}` }
              </Text>
            </DetailsRow>
            <DetailsRow>
              <Text size='13px' weight={400}>
                <FormattedMessage id='coinify.banktransferdetails.ref' defaultMessage='Reference/Message:' />
              </Text>
              <Text size='13px' weight={300}>
                { `Order ID ${trade.bankAccount.referenceText}` }
              </Text>
              <Text size='12px' weight={300} color='error'>
                <FormattedMessage id='coinify.banktransferdetails.include' defaultMessage='*Must be included*' />
              </Text>
            </DetailsRow>
          </BankTransferDetailsTable>
        </BankTransferDetails>
      </CheckoutWrapper>
    )
  }
}

export default CoinifyBuy
