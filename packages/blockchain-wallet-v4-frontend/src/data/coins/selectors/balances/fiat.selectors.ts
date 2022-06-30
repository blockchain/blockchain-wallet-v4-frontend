import BigNumber from 'bignumber.js'
import { add, curry, lift } from 'ramda'

import { Exchange, Remote } from '@core'
import { ExtractSuccess, RemoteDataType } from '@core/remote/types'
import { BSBalanceType, WalletFiatEnum, WalletFiatType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { DEFAULT_BS_BALANCE } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

// given a fiat currency, returns the total balance
const getFiatBalance = curry(
  (currency: WalletFiatType, state: RootState): RemoteDataType<string, number> => {
    const sbBalancesR = selectors.components.buySell.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.available || '0'
    return Remote.of(new BigNumber(convertBaseToStandard('FIAT', fiatBalance)).toNumber())
  }
)

// given a fiat currency, returns its withdrawable balance
const getFiatWithdrawableBalance = curry(
  (
    currency: WalletFiatType,
    state: RootState
  ): RemoteDataType<string, BSBalanceType['withdrawable']> => {
    const sbBalancesR = selectors.components.buySell.getBSBalances(state)
    const fiatBalance =
      sbBalancesR.getOrElse({
        [currency]: DEFAULT_BS_BALANCE
      })[currency]?.withdrawable || '0'
    return Remote.of(fiatBalance)
  }
)

const getFiatBalanceInfo = createDeepEqualSelector(
  [
    selectors.core.data.coins.getBtcTicker,
    selectors.core.settings.getCurrency,
    selectors.components.buySell.getBSBalances
  ],
  (btcRatesR, currencyR, sbBalancesR) => {
    const transform = (
      rates: ExtractSuccess<typeof btcRatesR>,
      currency,
      sbBalances: ExtractSuccess<typeof sbBalancesR>
    ) => {
      const keys = Object.keys(WalletFiatEnum).filter(
        (value) => typeof WalletFiatEnum[value] === 'number'
      )

      // @ts-ignore
      const balances = keys.map((value: WalletFiatType) => {
        const standard = convertBaseToStandard(
          'FIAT',
          // @ts-ignore
          sbBalances[value]?.available || '0'
        )

        if (value === currency) return Number(standard)

        return Exchange.convertFiatToFiat({
          fromCurrency: value,
          rates,
          toCurrency: currency,
          value: standard
        })
      })

      // @ts-ignore
      return balances.reduce(add, 0)
    }

    return lift(transform)(btcRatesR, currencyR, sbBalancesR)
  }
)

export { getFiatBalance, getFiatBalanceInfo, getFiatWithdrawableBalance }
