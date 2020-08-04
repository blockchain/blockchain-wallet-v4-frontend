import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  Erc20CoinsEnum,
  ExtractSuccess,
  FiatType,
  InterestFormErrorsType,
  RemoteDataType
} from 'core/types'
import { Exchange } from 'core'
import { lift, pathOr, propOr } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

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
        walletCurrency
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
