import { formValueSelector } from 'redux-form'
import { multiply } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const gweiToWei = multiply(1000000000)

export const getData = state => {
  const from = {
    address: formValueSelector('sendEther')(state, 'from'),
    index: 0
  }
  const to = formValueSelector('sendEther')(state, 'to')
  const message = formValueSelector('sendEther')(state, 'message')
  const amount = formValueSelector('sendEther')(state, 'amount')
  const fee = formValueSelector('sendEther')(state, 'fee')
  const nonce = selectors.core.data.ethereum.getNonce(state, from.address).getOrElse(undefined)
  const gasPrice = gweiToWei(selectors.core.data.ethereum.getFeeRegular(state).getOrElse(undefined))
  const gasLimit = selectors.core.data.ethereum.getGasLimit(state).getOrElse(undefined)
  const amountWei = Exchange.convertEtherToEther({ value: amount, fromUnit: 'ETH', toUnit: 'WEI' }).value
  const total = Number(amountWei) + Number(fee)

  return {
    from,
    to,
    message,
    amount: amountWei,
    total,
    fee,
    gasLimit,
    gasPrice,
    nonce
  }
}
