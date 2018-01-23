import { formValueSelector } from 'redux-form'
import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const from = formValueSelector('sendEther')(state, 'from')
  const to = formValueSelector('sendEther')(state, 'to')
  const message = formValueSelector('sendEther')(state, 'message')
  const amount = formValueSelector('sendEther')(state, 'amount')
  const fee = formValueSelector('sendEther')(state, 'fee')
  const amountWei = Exchange.convertEtherToEther({ value: amount, fromUnit: 'ETH', toUnit: 'WEI' }).value

  return {
    from,
    to,
    message,
    amount: amountWei,
    fee
  }
}
