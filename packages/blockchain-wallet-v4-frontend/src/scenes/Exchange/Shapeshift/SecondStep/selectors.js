import BigNumber from 'bignumber.js'
import { lift, path, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = state => {
  return selectors.components.exchange.getSecondStep(state)
}
// export const getData = state => {
//   const secondStepR = selectors.components.exchange.getSecondStep(state)
//   const form = selectors.modules.form.getFormValues('exchange')(state)
//   const sourceCoin = path(['source', 'coin'], form)
//   const targetCoin = path(['target', 'coin'], form)

//   const transform = (secondStep) => {
//     const { order, fee } = secondStep
//     const sourceAmount = Exchange.convertCoinToCoin({ value: prop('depositAmount', order), coin: sourceCoin, baseToStandard: false }).value
//     const sourceFee = fee
//     const sourceTotal = new BigNumber(sourceAmount).plus(new BigNumber(sourceFee)).toString()
//     const exchangeRate = `1 ${sourceCoin} = ${prop('quotedRate', order)} ${targetCoin}`
//     const targetAmount = prop('withdrawalAmount', order)
//     const targetFee = prop('minerFee', order)
//     const expiration = prop('expiration', order)

//     return {
//       sourceCoin,
//       sourceAmount,
//       sourceFee,
//       sourceTotal,
//       exchangeRate,
//       targetCoin,
//       targetAmount,
//       targetFee,
//       expiration
//     }
//   }

//   return lift(transform)(secondStepR)
// }
