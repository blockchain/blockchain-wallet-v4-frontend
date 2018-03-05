import { equals, prop } from 'ramda'

export const changeSource = (currentSource, newSource, currentTarget, defaultAccounts) => {
  const currentCoin = prop('coin', currentSource)
  const newCoin = prop('coin', newSource)
  if (!equals(currentCoin, newCoin)) {
    const newTarget = prop(currentCoin, defaultAccounts)
    return { source: newSource, target: newTarget }
  }
  return { source: newSource, target: currentTarget }
}

export const changeTarget = (currentTarget, newTarget, currentSource, defaultAccounts) => {
  const currentCoin = prop('coin', currentTarget)
  const newCoin = prop('coin', newTarget)
  if (!equals(currentCoin, newCoin)) {
    const newSource = prop(currentCoin, defaultAccounts)
    return { source: newSource, target: newTarget }
  }
  return { source: currentSource, target: newTarget }
}

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
