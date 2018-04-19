import BigNumber from 'bignumber.js'
import EthereumTx from 'ethereumjs-tx'
import * as eth from '../utils/ethereum'
import Task from 'data.task'
import { curry } from 'ramda'

// /////////////////////////////////////////////////////////////////////////////
const isOdd = str => str.length % 2 !== 0

const toHex = value => {
  const hex = new BigNumber(value).toString(16)
  return isOdd(hex) ? `0x0${hex}` : `0x${hex}`
}

// /////////////////////////////////////////////////////////////////////////////
export const sign = curry((network, mnemonic, data) => {
  const { nonce, gasPrice, gasLimit, to, amount, from } = data
  const privateKey = eth.getPrivateKey(mnemonic, from.index)
    .getWallet().getPrivateKey()
  const txParams = {
    to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasLimit),
    value: toHex(amount),
    chainId: network || 1
  }
  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = '0x' + tx.serialize().toString('hex')
  return Task.of(rawTx)
})
