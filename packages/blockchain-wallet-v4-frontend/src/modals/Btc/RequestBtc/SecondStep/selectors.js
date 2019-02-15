import { formValueSelector } from 'redux-form'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  const { receiveAddress } = ownProps
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const satoshis = Exchange.convertBitcoinToBitcoin({
    value: amount.coin,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  const link = `https://blockchain.com/btc/payment_request?address=${receiveAddress}&amount=${
    amount.coin
  }&message=${message}`
  return Remote.of({ satoshis, link, amount, message, receiveAddress })
}
