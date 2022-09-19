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

export const getUnderSanctionsMessage = (state) => {
  return selectors.components.interest.getUnderSanctionsMessage(state)
}

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.interest.getRates(state)
  const formErrors = selectors.form.getFormSyncErrors('interestDepositForm')(
    state
  ) as InterestFormErrorsType
  const interestEDDStatusR = selectors.components.interest.getInterestEDDStatus(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const stakingDepositLimits = selectors.components.interest.getStakingDepositLimits(state)
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
      interestRates: ExtractSuccess<typeof interestRatesR>,
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
        ethRates,
        feeCrypto,
        feeFiat,
        formErrors,
        interestAccount,
        interestEDDDepositLimits,
        interestEDDStatus,
        interestRates,
        payment,
        prefillAmount,
        rates,
        stakingDepositLimits
      }
    }
  )(
    ratesR,
    interestRatesR,
    ethRatesR,
    paymentR,
    walletCurrencyR,
    interestEDDDepositLimitsR,
    interestEDDStatusR
  )
}
