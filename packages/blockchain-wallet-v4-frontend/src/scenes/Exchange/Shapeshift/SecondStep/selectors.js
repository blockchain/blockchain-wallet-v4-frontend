import { selectors } from 'data'
import { has, is, lift, prop } from 'ramda'
import settings from 'config'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selector, value) => {
  if (value == null) return undefined
  if (is(String, value)) return value
  if (has('address', value)) return prop('address', value)
  if (has('index', value)) return selector(prop('index', value)).getOrElse(undefined)
  return undefined
}

export const getData = (state, source, target) => {
  const orderR = selectors.core.data.shapeShift.getOrder(state)
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
  const sourceAddress = extractAddress(getReceive, source)
  const sourceCoin = prop('coin', source)
  const targetAddress = extractAddress(getReceive, target)
  const targetCoin = prop('coin', target)

  const transform = (order) => {
    const depositAddress = prop('deposit', order)
    const depositAmount = prop('depositAmount', order)
    const depositFee = 0
    const depositTotal = 0
    const exchangeRate = `1 ${sourceCoin} = ${prop('quotedRate', order)} ${targetCoin}`
    const withdrawalAmount = prop('withdrawalAmount', order)
    const withdrawalFee = prop('minerFee', order)
    const expiration = prop('expiration', order)

    return {
      depositAddress,
      depositAmount,
      depositFee,
      depositTotal,
      exchangeRate,
      withdrawalAmount,
      withdrawalFee,
      expiration,
      sourceAddress,
      sourceCoin,
      targetAddress,
      targetCoin
    }
  }

  return lift(transform)(orderR)
}
