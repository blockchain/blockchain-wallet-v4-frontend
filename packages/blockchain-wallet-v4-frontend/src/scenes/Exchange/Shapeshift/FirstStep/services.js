// import { equals, head, isNil, path, prop } from 'ramda'

// export const initializeForm = (prevProps, nextProps) => {
//   const prevData = prevProps.data.getOrElse({})
//   const prevInitialValues = prop('initialValues', prevData)
//   const prevSource = prop('source', prevData)

//   if (!isNil(prevInitialValues) && isNil(prevSource)) {
//     nextProps.formActions.initialize('exchange', prevInitialValues)
//   }
// }

// export const changeCoin = (prevProps, nextProps) => {
//   const prevData = prevProps.data.getOrElse({})
//   const nextData = nextProps.data.getOrElse({})
//   const btcBalances = prop('btcBalances', nextData)
//   const ethBalances = prop('ethBalances', nextData)
//   const prevSource = prop('source', prevData)
//   const prevSourceCoin = prop('coin', prevSource)
//   const nextSource = prop('source', nextData)
//   const nextSourceCoin = path(['source', 'coin'], nextData)
//   const prevTargetCoin = path(['target', 'coin'], prevData)
//   const nextTargetCoin = path(['target', 'coin'], nextData)

//   // If the source coin has changed, we select a new target coin
//   if (!isNil(prevSourceCoin) && !equals(prevSourceCoin, nextSourceCoin) && equals(prevTargetCoin, nextTargetCoin)) {
//     const nextTarget = selectDefaultAccount(prevSourceCoin, btcBalances, ethBalances)
//     nextProps.formActions.change('exchange', 'target', nextTarget)
//   }

//   // If the target coin has changed, we select a new source coin
//   if (!isNil(prevTargetCoin) && !equals(prevTargetCoin, nextTargetCoin) && equals(prevSourceCoin, nextSourceCoin)) {
//     const nextTarget = selectDefaultAccount(prevTargetCoin, btcBalances, ethBalances)
//     nextProps.formActions.change('exchange', 'source', nextTarget)
//   }

//   // Update unspent if needed (BTC)
//   if (!equals(prevSource, nextSource) && !isNil(prevSourceCoin) && equals(nextSourceCoin, 'BTC')) {
//     nextProps.dataBitcoinActions.fetchUnspent(prop('index', prevSource) || prop('address', prevSource))
//   }
// }

// export const swapCoin = (props) => {
//   const data = props.data.getOrElse({})
//   props.formActions.initialize('exchange', { source: prop('target', data), target: prop('source', data) })
// }

// export const updateEffectiveBalance = (prevProps, nextProps) => {
//   const prevData = prevProps.data.getOrElse({})
//   const nextData = nextProps.data.getOrElse({})
//   const prevCoins = prop('coins', prevData)
//   const nextCoins = prop('coins', nextData)
//   const prevFee = prop('fee', prevData)
//   const nextFee = prop('fee', nextData)

//   if (!equals(prevCoins, nextCoins) || !equals(prevFee, nextFee)) {
//     console.log('updateEffectiveBalanceeee')
//     nextProps.dataBitcoinActions.refreshEffectiveBalance(nextCoins, nextFee)
//   }
// }

// const selectDefaultAccount = (coin, btcBalances, ethBalances) => {
//   switch (coin) {
//     case 'BTC': return head(btcBalances)
//     case 'ETH': return head(ethBalances)
//   }
// }

// // const updateSelection = (prevProps, nextProps, seed) => {
// //   const prevData = prevProps.data.getOrElse({})
// //   const nextData = nextProps.data.getOrElse({})
// //   const prevCoins = prop('coins', prevData)
// //   const nextCoins = prop('coins', nextData)
// //   const prevFee = prop('fee', prevData)
// //   const nextFee = prop('fee', nextData)
// //   const prevAmount = prop('amount', prevData)
// //   const nextAmount = prop('amount', nextData)
// //   const prevTo = prop('to', prevData) || prop('to2', prevData)
// //   const nextTo = prop('to', nextData) || prop('to2', nextData)
// //   // const nextFrom = prop('from', prevData)
// //   const nextUnit = prop('unit', nextData)
// //   const nextChangeAddress = prop('changeAddress', nextData)
// //   const nextReceiveAddress = prop('receiveAddress', nextData)

// //   if (!equals(prevCoins, nextCoins) ||
// //     !equals(prevAmount, nextAmount) ||
// //     !equals(prevTo, nextTo) ||
// //     !equals(prevFee, nextFee)) {
// //     const satoshis = Exchange.convertBitcoinToBitcoin({ value: nextAmount, fromUnit: nextUnit, toUnit: 'SAT' }).value
// //     const algorithm = 'singleRandomDraw'
// //     nextProps.dataBitcoinActions.refreshSelection(nextFee, nextCoins, satoshis, nextReceiveAddress, nextChangeAddress, algorithm, seed)
// //   }
// // }
