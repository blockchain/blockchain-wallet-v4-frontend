import { formValueSelector } from 'redux-form'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'
import bip21 from 'bip21'

export const getData = (state, ownProps) => {
  const { receiveAddress } = ownProps
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const satoshis = Exchange.convertBitcoinToBitcoin({ value: amount.coin, fromUnit: 'BTC', toUnit: 'SAT' }).value
  const payload = `bitcoin:${receiveAddress}?message=${message}&amount=${amount.coin}`
  const encodedPayload = encodeURIComponent(payload)
  const link = `https://blockchain.com/open/${encodedPayload}`
  return Remote.of({ satoshis, link, amount, message, receiveAddress })
}