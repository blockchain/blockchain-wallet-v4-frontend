import { equals, head, isNil, lift, path, prop } from 'ramda'

export const changeSource = (currentSource, newSource, currentTarget, btcBalances, ethBalances) => {
  const currentCoin = prop('coin', currentSource)
  const newCoin = prop('coin', newSource)
  if (!equals(currentCoin, newCoin)) {
    const newTarget = selectDefaultAccount(currentCoin, btcBalances, ethBalances)
    return { source: newSource, target: newTarget }
  }
  return { source: newSource, target: currentTarget }
}

export const changeTarget = (currentTarget, newTarget, currentSource, btcBalances, ethBalances) => {
  const currentCoin = prop('coin', currentTarget)
  const newCoin = prop('coin', newTarget)
  if (!equals(currentCoin, newCoin)) {
    const newSource = selectDefaultAccount(currentCoin, btcBalances, ethBalances)
    return { source: newSource, target: newTarget }
  }
  return { source: currentSource, target: newTarget }
}

export const changeCoin = (prevProps, nextProps) => {
  console.log('changeCoin', nextProps)
  const { btcBalances, ethBalances } = nextProps
  const prevSource = path(['accounts', 'source'], prevProps)
  const nextSource = path(['accounts', 'source'], nextProps)
  const prevSourceCoin = path(['accounts', 'source', 'coin'], prevProps)
  const nextSourceCoin = path(['accounts', 'source', 'coin'], nextProps)
  const prevTargetCoin = path(['accounts', 'target', 'coin'], prevProps)
  const nextTargetCoin = path(['accounts', 'target', 'coin'], nextProps)

  console.log('changeCoin', prevSourceCoin, nextSourceCoin)
  console.log('changeCoin', prevTargetCoin, nextTargetCoin)
  // If the source coin has changed, we select a new target coin
  if (!isNil(prevSourceCoin) && !equals(prevSourceCoin, nextSourceCoin) && equals(prevTargetCoin, nextTargetCoin)) {
    const nextTarget = selectDefaultAccount(prevSourceCoin, btcBalances, ethBalances)
    nextProps.formActions.change('exchange', 'target', nextTarget)
  }

  // If the target coin has changed, we select a new source coin
  if (!isNil(prevTargetCoin) && !equals(prevTargetCoin, nextTargetCoin) && equals(prevSourceCoin, nextSourceCoin)) {
    const nextTarget = selectDefaultAccount(prevTargetCoin, btcBalances, ethBalances)
    nextProps.formActions.change('exchange', 'source', nextTarget)
  }

  // Update unspent if needed (BTC)
  if (!equals(prevSource, nextSource) && !isNil(prevSourceCoin) && equals(nextSourceCoin, 'BTC')) {
    nextProps.dataBitcoinActions.fetchUnspent(prop('index', prevSource) || prop('address', prevSource))
  }
}

export const updateEffectiveBalance = (props) => {
  const coins = prop('btcFee', props)
  const updateBalance = (data) => {
    const feePerBytes = prop('btcFee', data)
    props.dataBitcoinActions.refreshEffectiveBalance(coins, feePerBytes)
  }
  props.data.map(x => updateBalance(x))
}

export const selectDefaultAccount = (coin, btcBalances, ethBalances) => {
  switch (coin) {
    case 'BTC': return head(btcBalances)
    case 'ETH': return head(ethBalances)
  }
}

// const updateSelection = (prevProps, nextProps, seed) => {
//   const prevData = prevProps.data.getOrElse({})
//   const nextData = nextProps.data.getOrElse({})
//   const prevCoins = prop('coins', prevData)
//   const nextCoins = prop('coins', nextData)
//   const prevFee = prop('fee', prevData)
//   const nextFee = prop('fee', nextData)
//   const prevAmount = prop('amount', prevData)
//   const nextAmount = prop('amount', nextData)
//   const prevTo = prop('to', prevData) || prop('to2', prevData)
//   const nextTo = prop('to', nextData) || prop('to2', nextData)
//   // const nextFrom = prop('from', prevData)
//   const nextUnit = prop('unit', nextData)
//   const nextChangeAddress = prop('changeAddress', nextData)
//   const nextReceiveAddress = prop('receiveAddress', nextData)

//   if (!equals(prevCoins, nextCoins) ||
//     !equals(prevAmount, nextAmount) ||
//     !equals(prevTo, nextTo) ||
//     !equals(prevFee, nextFee)) {
//     const satoshis = Exchange.convertBitcoinToBitcoin({ value: nextAmount, fromUnit: nextUnit, toUnit: 'SAT' }).value
//     const algorithm = 'singleRandomDraw'
//     nextProps.dataBitcoinActions.refreshSelection(nextFee, nextCoins, satoshis, nextReceiveAddress, nextChangeAddress, algorithm, seed)
//   }
// }
