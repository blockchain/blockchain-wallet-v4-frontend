import { lift, pathOr, propOr } from 'ramda'

import { Exchange } from '@core'
import {
  ExtractSuccess,
  FiatType,
  InterestAfterTransactionType,
  InterestFormErrorsType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

export const getCurrency = (state) => {
  return selectors.core.settings.getCurrency(state)
}

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.interest.getRates(state)
  const formErrors = selectors.form.getFormSyncErrors('interestDepositForm')(
    state
  ) as InterestFormErrorsType
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestEDDStatusR = selectors.components.interest.getInterestEDDStatus(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const depositLimits = selectors.components.interest.getDepositLimits(state)
  const displayCoin = selectors.components.interest.getIsAmountDisplayedInCrypto(state)
  const ethRatesR = selectors.core.data.misc.getRatesSelector('ETH', state)
  const paymentR = selectors.components.interest.getPayment(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state) as RemoteDataType<
    string,
    FiatType
  >
  const interestEDDDepositLimitsR = selectors.components.interest.getInterestEDDDepositLimits(state)
  const interestAccount = selectors.components.interest
    .getInterestAccount(state)
    .getOrElse({ accountRef: '' })

  const afterTransaction = selectors.components.interest
    .getAfterTransaction(state)
    .getOrElse({} as InterestAfterTransactionType)

  const prefillAmount = afterTransaction?.show ? afterTransaction.amount : undefined

  return lift(
    (
      rates: ExtractSuccess<typeof ratesR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      interestRate: ExtractSuccess<typeof interestRateR>,
      ethRates: ExtractSuccess<typeof ethRatesR>,
      payment: ExtractSuccess<typeof paymentR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>,
      interestEDDDepositLimits,
      interestEDDStatus
    ) => {
      const { coinfig } = window.coins[coin]
      const depositFee =
        coin === 'BCH' || coin === 'BTC'
          ? Number(pathOr('0', ['selection', 'fee'], payment))
          : Number(propOr('0', 'fee', payment))

      const feeCrypto = coinfig.type.erc20Address
        ? convertBaseToStandard('ETH', depositFee)
        : convertBaseToStandard(coin, depositFee)

      const feeFiat = Exchange.convertCoinToFiat({
        coin,
        currency: walletCurrency,
        isStandard: true,
        rates: coinfig.type.erc20Address ? ethRates : rates,
        value: feeCrypto
      })

      return {
        coin,
        depositLimits,
        displayCoin,
        ethRates,
        feeCrypto,
        feeFiat,
        formErrors,
        interestAccount,
        interestEDDDepositLimits,
        interestEDDStatus,
        interestLimits,
        interestRate,
        payment,
        prefillAmount,
        rates
      }
    }
  )(
    ratesR,
    interestLimitsR,
    interestRateR,
    ethRatesR,
    paymentR,
    walletCurrencyR,
    interestEDDDepositLimitsR,
    interestEDDStatusR
  )
}
