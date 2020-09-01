import * as balanceSelectors from 'components/Balances/wallet/selectors'
import {
  CoinType,
  CoinTypeEnum,
  ExtractSuccess,
  FiatType,
  RatesType
} from 'core/types'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { getData as getAlgoAddressData } from 'components/Form/SelectBoxAlgoAddresses/selectors'
import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'
import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'
import {
  getErc20Data as getErc20AddressData,
  getEthData as getEthAddressData
} from 'components/Form/SelectBoxEthAddresses/selectors'
import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'
import { lift } from 'ramda'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state, ownProps: OwnProps) => {
  const { coin } = ownProps
  let addressDataR
  let balanceDataR
  let coinRatesR

  switch (coin) {
    case 'BTC':
      addressDataR = getBtcAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getBtcBalance(state)
      coinRatesR = selectors.core.data.btc.getRates(state)
      break
    case 'BCH':
      addressDataR = getBchAddressData(state, {
        coin: 'BCH',
        excludeLockbox: true,
        includeCustodial: true
      })
      balanceDataR = balanceSelectors.getBchBalance(state)
      coinRatesR = selectors.core.data.bch.getRates(state)
      break
    case 'ETH':
      addressDataR = getEthAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getEthBalance(state)
      coinRatesR = selectors.core.data.eth.getRates(state)
      break
    case 'PAX':
      addressDataR = getErc20AddressData(state, {
        coin: 'PAX',
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getPaxBalance(state)
      coinRatesR = selectors.core.data.eth.getErc20Rates(state, 'pax')
      break
    case 'USDT':
      addressDataR = getErc20AddressData(state, {
        coin: 'USDT',
        includeCustodial: true,
        includeInterest: true
      })
      balanceDataR = balanceSelectors.getUsdtBalance(state)
      coinRatesR = selectors.core.data.eth.getErc20Rates(state, 'usdt')
      break
    case 'XLM':
      addressDataR = getXlmAddressData(state, {
        excludeLockbox: true,
        includeCustodial: true
      })
      balanceDataR = balanceSelectors.getXlmBalance(state)
      coinRatesR = selectors.core.data.xlm.getRates(state)
      break
    case 'ALGO':
      addressDataR = getAlgoAddressData(state, {
        includeCustodial: true
      })
      balanceDataR = balanceSelectors.getAlgoBalance(state)
      coinRatesR = selectors.core.data.algo.getRates(state)
      break
    case 'EUR':
    case 'GBP':
    case 'USD':
      addressDataR = Remote.Success({ data: [] })
      balanceDataR = balanceSelectors.getFiatBalance(coin, state)
      coinRatesR = selectors.core.data.btc.getRates(state)
      break
    default:
      addressDataR = Remote.Success({ data: [] })
      balanceDataR = Remote.Success(0)
      coinRatesR = selectors.core.data.eth.getErc20Rates(state, 'pax')
  }
  const price24HrR = selectors.core.data.misc.getPrice24H(
    coin as CoinType,
    state
  )
  const currencyR = selectors.core.settings.getCurrency(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)

  const transform = (
    addressData,
    balanceData,
    coinRates: RatesType,
    currency: FiatType,
    price24H: ExtractSuccess<typeof price24HrR>,
    sbBalances: ExtractSuccess<typeof sbBalancesR>
  ) => {
    let value
    let currentValue

    if (coin in CoinTypeEnum) {
      value = Exchange.convertCoinToCoin({
        value: balanceData,
        coin: coin as CoinType,
        baseToStandard: true
      }).value
      currentValue = Exchange.convertCoinToFiat(
        value,
        coin,
        currency,
        coinRates
      )
    }

    let yesterdayPrice = price24H.price
    const yesterdayValue = Exchange.convertCoinToFiat(value, coin, currency, {
      ...coinRates,
      [currency]: {
        last: yesterdayPrice
      }
    })

    const changePercentage = price24H.change

    const changeFiat = currentValue - yesterdayValue

    return {
      currency,
      addressData,
      balanceData,
      currencySymbol: Exchange.getSymbol(currency),
      price24H,
      priceChangeFiat: changeFiat,
      priceChangePercentage: Number(changePercentage),
      sbBalance: sbBalances[coin]
    }
  }

  // @ts-ignore
  return lift(transform)(
    addressDataR,
    balanceDataR,
    coinRatesR,
    currencyR,
    price24HrR,
    sbBalancesR
  )
}
