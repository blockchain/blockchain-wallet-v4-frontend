import { formValueSelector } from 'redux-form'
import { Remote, Exchange } from 'blockchain-wallet-v4/src'

export const getData = (state, ownProps) => {
  const { receiveAddress } = ownProps
  const amount = formValueSelector('requestBtc')(state, 'amount')
  const message = formValueSelector('requestBtc')(state, 'message')
  const satoshis = Exchange.convertBtcToBtc({
    value: amount.coin,
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value
  const link = `https://blockchain.com/btc/payment_request?address=${receiveAddress}&amount=${
    amount.coin
  }&message=${message}`
  return Remote.of({ satoshis, link, amount, message, receiveAddress })
}
