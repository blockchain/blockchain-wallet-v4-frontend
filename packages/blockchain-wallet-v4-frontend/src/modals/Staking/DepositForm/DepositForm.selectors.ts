import { lift, pathOr, propOr } from 'ramda'

import {
  EarnAfterTransactionType,
  EarnDepositErrorsType,
  ExtractSuccess,
  FiatType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { FORM_NAME } from './DepositForm.model'

export const getCurrency = (state) => {
  return selectors.core.settings.getCurrency(state)
}

export const getUnderSanctionsMessage = (state) => {
  return selectors.components.interest.getUnderSanctionsMessage(state)
}

export const getData = (state: RootState) => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.interest.getRates(state)
  const formErrors = selectors.form.getFormSyncErrors(FORM_NAME)(state) as EarnDepositErrorsType
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const earnDepositLimits = selectors.components.interest.getEarnDepositLimits(state)
  const ethRatesR = selectors.core.data.misc.getRatesSelector('ETH', state)
  const displayCoin = selectors.components.interest.getIsAmountDisplayedInCrypto(state)
  const paymentR = selectors.components.interest.getPayment(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state) as RemoteDataType<
    string,
    FiatType
  >
  const stakingLimitsR = selectors.components.interest.getStakingLimits(state)

  const afterTransaction = selectors.components.interest
    .getAfterTransaction(state)
    .getOrElse({} as EarnAfterTransactionType)

  const prefillAmount = afterTransaction?.show ? afterTransaction.amount : undefined

  return lift(
    (
      rates: ExtractSuccess<typeof ratesR>,
      interestRates: ExtractSuccess<typeof interestRatesR>,
      ethRates: ExtractSuccess<typeof ethRatesR>,
      payment: ExtractSuccess<typeof paymentR>,
      stakingLimits: ExtractSuccess<typeof stakingLimitsR>,
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>,
      earnEDDStatus
    ) => {
      const depositFee =
        coin === 'BCH' || coin === 'BTC'
          ? Number(pathOr('0', ['selection', 'fee'], payment))
          : Number(propOr('0', 'fee', payment))

      return {
        depositFee,
        displayCoin,
        earnDepositLimits,
        earnEDDStatus,
        ethRates,
        formErrors,
        interestRates,
        payment,
        prefillAmount,
        rates,
        stakingLimits,
        walletCurrency
      }
    }
  )(ratesR, interestRatesR, ethRatesR, paymentR, stakingLimitsR, walletCurrencyR, earnEDDStatusR)
}
