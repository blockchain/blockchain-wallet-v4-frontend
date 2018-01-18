import { formValueSelector } from 'redux-form'
import { lift, equals, head, filter, map, prop } from 'ramda'
import settings from 'config'
import { selectors } from 'data'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'

// extractAddress :: (Int -> Remote(String)) -> Int -> Remote(String)
const extractAddress = (selectorFunction, value) =>
  value
    ? value.address
      ? Remote.of(value.address)
      : selectorFunction(value.index)
    : Remote.of(undefined)

export const getData = state => {
  const getReceive = index => selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const unitR = selectors.core.settings.getBtcUnit(state)
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const receiveAddressR = extractAddress(getReceive, to)
  const transform = lift((unit, receiveAddress) => {
    const satoshis = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: unit, toUnit: 'SAT' }).value
    const btc = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: unit, toUnit: 'BTC' }).value
    const link = `https://blockchain.info/payment_request?address=${receiveAddress}&amount=${btc}&message=${message}`
    return { satoshis, link, amount, message, receiveAddress }
  })

  return transform(unitR, receiveAddressR)
}
