import { equals, isNil, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

export const updateUnspent = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevFrom = prop('from', prevData)
  const nextFrom = prop('from', nextData)

  if (!isNil(prevFrom) && !isNil(nextFrom) && !equals(prevFrom, nextFrom)) {
    nextProps.dataBitcoinActions.fetchUnspent(nextFrom.index || nextFrom.address)
  }
}

export const updateEffectiveBalance = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevCoins = prop('coins', prevData)
  const nextCoins = prop('coins', nextData)
  const prevFee = prop('fee', prevData)
  const nextFee = prop('fee', nextData)

  if (!equals(prevCoins, nextCoins) || !equals(prevFee, nextFee)) {
    nextProps.dataBitcoinActions.refreshEffectiveBalance(nextCoins, nextFee)
  }
}

export const updateSelection = (prevProps, nextProps, seed) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const prevCoins = prop('coins', prevData)
  const nextCoins = prop('coins', nextData)
  const prevFee = prop('fee', prevData)
  const nextFee = prop('fee', nextData)
  const prevTo = prop('to', prevData)
  const nextTo = prop('to', nextData)
  // const nextFrom = prop('from', prevData)
  const nextUnit = prop('unit', nextData)
  const nextChangeAddress = prop('changeAddress', nextData)
  const nextReceiveAddress = prop('receiveAddress', nextData)
  const value = nextCoins[0] ? nextCoins[0].value : 0

  if (!equals(prevCoins, nextCoins) ||
      !equals(prevTo, nextTo) ||
      !equals(prevFee, nextFee)) {
    const satoshis = Exchange.convertBitcoinToBitcoin({ value: value, fromUnit: nextUnit, toUnit: 'SAT' }).value
    const algorithm = 'selectAll'
    nextProps.dataBitcoinActions.refreshSelection(nextFee, nextCoins, satoshis, nextReceiveAddress, nextChangeAddress, algorithm, seed)
  }
}
