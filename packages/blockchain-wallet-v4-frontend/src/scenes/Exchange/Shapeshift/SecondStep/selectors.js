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

export const getAddresses = (state, source, target) => {
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index, state)
  const sourceAddress = extractAddress(getReceive, source)
  const targetAddress = extractAddress(getReceive, target)

  return {
    sourceAddress,
    targetAddress
  }
}

export const getData = (state, sourceCoin, targetCoin) => {
  const orderR = selectors.core.data.shapeShift.getOrder(state)

  const transform = (order) => {
    const sendAmount = prop('depositAmount', order)
    const sendFee = 0
    const sendTotal = 0
    const exchangeRate = `1 ${sourceCoin} = ${prop('quotedRate', order)} ${targetCoin}`
    const receiveAmount = prop('withdrawalAmount', order)
    const receiveFee = prop('minerFee', order)
    const expiration = prop('expiration', order)

    return {
      sendAmount,
      sendFee,
      sendTotal,
      exchangeRate,
      receiveAmount,
      receiveFee,
      expiration
    }
  }

  return lift(transform)(orderR)
}
