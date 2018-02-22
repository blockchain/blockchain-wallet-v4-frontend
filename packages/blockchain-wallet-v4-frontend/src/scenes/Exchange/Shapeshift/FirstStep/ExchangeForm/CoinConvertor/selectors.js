import { path } from 'ramda'
import { selectors } from 'data'
// export const getData = (state, coinSource, coinTarget) => {
//   const btcUnitR = selectors.core.settings.getBtcUnit(state)
//   const ethUnitR = Remote.of('ETH')
//   const currencyR = selectors.core.settings.getCurrency(state)
//   const btcRatesR = selectors.core.data.bitcoin.getRates(state)
//   const ethRatesR = selectors.core.data.ethereum.getRates(state)

//   const transform = (btcUnit, ethUnit, currency, btcRates, ethRates) => {
//     const coinSourceUnit = equals(coinSource, 'BTC') ? btcUnit : ethUnit
//     const coinTargetUnit = equals(coinTarget, 'BTC') ? btcUnit : ethUnit
//     return { coinSourceUnit, coinTargetUnit, btcUnit, ethUnit, currency, btcRates, ethRates }
//   }

//   return lift(transform)(btcUnitR, ethUnitR, currencyR, btcRatesR, ethRatesR)
// }

export const getData = selectors.core.data.shapeShift.getShapeshiftQuotation
