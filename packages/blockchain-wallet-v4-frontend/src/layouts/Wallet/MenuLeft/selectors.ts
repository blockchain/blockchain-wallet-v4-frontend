import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedCoinType,
  SupportedFiatType
} from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { lift, mapObjIndexed, values } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.simpleBuy.getSBPaymentMethods,
    selectors.auth.getFirstLogin,
    selectors.router.getPathname,
    selectors.core.kvStore.lockbox.getDevices,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getDomains,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (
    menuOpened: boolean,
    paymentMethodsR,
    firstLogin: boolean,
    pathname,
    lockboxDevicesR,
    countryCodeR,
    domainsR,
    supportedCoinsR
  ) => {
    const transform = (
      countryCode,
      domains: ExtractSuccess<typeof domainsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      lockboxDevices,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>
    ) => {
      const coinOrder = [
        supportedCoins.EUR,
        supportedCoins.GBP,
        supportedCoins.BTC,
        supportedCoins.ETH,
        supportedCoins.BCH,
        supportedCoins.XLM,
        supportedCoins.ALGO,
        supportedCoins.PAX,
        supportedCoins.USDT
      ]
      const coins = values(
        mapObjIndexed((coin: SupportedCoinType | SupportedFiatType) => {
          return {
            ...coin,
            method:
              coin.coinCode in CoinTypeEnum ||
              !!paymentMethods.methods.find(
                method => method.currency === coin.coinCode
              )
          }
        }, coinOrder)
      )

      return {
        coins,
        countryCode,
        domains,
        firstLogin,
        lockboxDevices,
        menuOpened,
        pathname,
        paymentMethods
      }
    }

    return lift(transform)(
      countryCodeR,
      domainsR,
      paymentMethodsR,
      lockboxDevicesR,
      supportedCoinsR
    )
  }
)
