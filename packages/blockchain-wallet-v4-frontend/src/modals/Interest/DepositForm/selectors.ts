import { lift, pathOr, propOr } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import {
  Erc20CoinsEnum,
  ExtractSuccess,
  FiatType,
  InterestAfterTransactionType,
  InterestFormErrorsType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

export const getCurrency = state => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.interest.getRates(state)
  const formErrors = selectors.form.getFormSyncErrors('interestDepositForm')(
    state
  ) as InterestFormErrorsType
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const depositLimits = selectors.components.interest.getDepositLimits(state)
  const displayCoin = selectors.components.interest.getCoinDisplay(state)
  const ethRatesR = selectors.core.data.misc.getRatesSelector('ETH', state)
  const paymentR = selectors.components.interest.getPayment(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(
    state
  ) as RemoteDataType<string, FiatType>

  const afterTransaction = selectors.components.interest
    .getAfterTransaction(state)
    .getOrElse({} as InterestAfterTransactionType)
  const isFromBuySell = selectors.components.interest.getIsFromBuySell(state)

  const prefillAmount = afterTransaction?.show
    ? afterTransaction.amount
    : undefined

  return lift(
    (
      rates: ExtractSuccess<typeof ratesR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRate: ExtractSuccess<typeof interestRateR>,
      ethRates: ExtractSuccess<typeof ethRatesR>,
      payment: ExtractSuccess<typeof paymentR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>
    ) => {
      const depositFee =
        coin in Erc20CoinsEnum
          ? Number(propOr('0', 'fee', payment))
          : Number(pathOr('0', ['selection', 'fee'], payment))

      const feeCrypto =
        coin in Erc20CoinsEnum
          ? convertBaseToStandard('ETH', depositFee)
          : convertBaseToStandard(coin, depositFee)

      const feeFiat = Exchange.convertCoinToFiat(
        feeCrypto,
        coin in Erc20CoinsEnum ? 'ETH' : coin,
        walletCurrency,
        coin in Erc20CoinsEnum ? ethRates : rates
      )

      return {
        coin,
        feeCrypto,
        feeFiat,
        formErrors,
        depositLimits,
        displayCoin,
        interestLimits,
        interestRate,
        ethRates,
        payment,
        rates,
        supportedCoins,
        prefillAmount,
        isFromBuySell
      }
    }
  )(
    ratesR,
    interestLimitsR,
    interestRateR,
    ethRatesR,
    paymentR,
    supportedCoinsR,
    walletCurrencyR
  )
}
