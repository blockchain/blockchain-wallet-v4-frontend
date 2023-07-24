import { BigNumber } from 'bignumber.js'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentTypes, BuyQuoteType } from '@core/network/api/buySell/types'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { BuyQuoteStateType } from 'data/components/buySell/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

const getDepositTerms = (quote: BuyQuoteType) => quote.depositTerms

const makeCryptoDisplaySymbol = ({ coins, pair }: { coins: Coins; pair: string }) => {
  const cryptoCode = getCoinFromPair(pair)

  return coins[cryptoCode]?.coinfig?.displaySymbol || cryptoCode
}

/**
 * @return Price of one coin in fiat (e.g. how much is 1 BTC).
 */
const makeOneCoinPrice = ({ pair, quote }: { pair: string; quote: BuyQuoteType }) => {
  const fiatCode = getFiatFromPair(pair)
  const cryptoCode = getCoinFromPair(pair)

  const priceStandard = convertBaseToStandard(cryptoCode, quote.price)

  return fiatToString({
    unit: fiatCode,
    value: new BigNumber(1).dividedBy(new BigNumber(priceStandard)).toString()
  })
}

const makeFeeText = ({ pair, quote }: { pair: string; quote: BuyQuoteType }) => {
  const fiatCode = getFiatFromPair(pair)
  const { fee } = quote.feeDetails

  return fiatToString({
    unit: fiatCode,
    value: convertBaseToStandard('FIAT', fee)
  })
}

const makeFiatMinusExplicitFeeText = ({
  amountBase,
  pair,
  quote
}: {
  amountBase: string
  pair: string
  quote: BuyQuoteType
}) => {
  const fiatCode = getFiatFromPair(pair)
  const amountStandard = convertBaseToStandard('FIAT', amountBase)
  const feeStandard = convertBaseToStandard('FIAT', quote.feeDetails.fee)

  return fiatToString({
    unit: fiatCode,
    value: new BigNumber(amountStandard).minus(new BigNumber(feeStandard)).toString()
  })
}

/**
 * @returns Total fiat spent (both on crypto and fees).
 */
const makeTotalFiatText = ({ amountBase, pair }: { amountBase: string; pair: string }) => {
  const fiatCode = getFiatFromPair(pair)

  return fiatToString({
    unit: fiatCode,
    value: convertBaseToStandard('FIAT', amountBase)
  })
}

/**
 * @returns Total amount of crypto to be received.
 */
const makeTotalCryptoText = ({
  coins,
  pair,
  quote
}: {
  coins: Coins
  pair: string
  quote: BuyQuoteType
}) => {
  const { resultAmount } = quote

  const cryptoCode = getCoinFromPair(pair)
  const cryptoDisplaySymbol = makeCryptoDisplaySymbol({
    coins,
    pair
  })
  const cryptoAmountStandard = convertBaseToStandard(cryptoCode, resultAmount)

  return `${cryptoAmountStandard} ${cryptoDisplaySymbol}`
}

const makeIsTermsConsentRequired = (paymentMethod: BSPaymentTypes) =>
  [BSPaymentTypes.PAYMENT_CARD, BSPaymentTypes.USER_CARD].includes(paymentMethod)

export const make = (quoteState: BuyQuoteStateType, coins: Coins) => {
  const { amount, pairObject, paymentMethod, paymentMethodId, quote, refreshConfig } = quoteState
  const { pair } = pairObject

  return {
    cryptoDisplaySymbol: makeCryptoDisplaySymbol({ coins, pair }),
    depositTerms: getDepositTerms(quote),
    feeText: makeFeeText({ pair, quote }),
    fiatAmountBase: amount,
    fiatCode: getFiatFromPair(pair),
    fiatMinusExplicitFeeText: makeFiatMinusExplicitFeeText({
      amountBase: amount,
      pair,
      quote
    }),
    isTermsConsentRequired: makeIsTermsConsentRequired(paymentMethod),
    oneCoinPrice: makeOneCoinPrice({
      pair,
      quote
    }),
    paymentMethod,
    paymentMethodId,
    quoteState,
    refreshConfig,
    totalCryptoText: makeTotalCryptoText({
      coins,
      pair,
      quote
    }),
    totalFiatText: makeTotalFiatText({
      amountBase: amount,
      pair
    })
  }
}
