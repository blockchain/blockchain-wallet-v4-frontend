import BigNumber from 'bignumber.js'
import Task from 'data.task'
import EthereumAbi from 'ethereumjs-abi'
import EthereumTx from 'ethereumjs-tx'
import { curry } from 'ramda'

import * as eth from '../utils/eth'

const isOdd = (str) => str.length % 2 !== 0
const toHex = (value) => {
  const hex = new BigNumber(value).toString(16)
  return isOdd(hex) ? `0x0${hex}` : `0x${hex}`
}

export const signErc20 = curry((network = 1, mnemonic, data, contractAddress) => {
  const { amount, gasLimit, gasPrice, index, nonce, to } = data
  const privateKey = eth.getPrivateKey(mnemonic, index)
  const transferMethodHex = '0xa9059cbb'

  // block ERC20 transfers/sends that are being created with 0 amount
  if (new BigNumber(amount).isZero()) {
    return Task.rejected(new Error('erc20_amount_cannot_be_zero'))
  }

  const txParams = {
    chainId: network,
    data:
      transferMethodHex +
      EthereumAbi.rawEncode(['address'], [to]).toString('hex') +
      EthereumAbi.rawEncode(['uint256'], [amount.toString()]).toString('hex'),
    gasLimit: toHex(gasLimit),
    gasPrice: toHex(gasPrice),
    nonce: toHex(nonce),
    to: contractAddress,
    value: toHex(0)
  }
  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = `0x${tx.serialize().toString('hex')}`
  return Task.of(rawTx)
})

export const sign = curry((network = 1, mnemonic, data) => {
  const { amount, gasLimit, gasPrice, index, nonce, to } = data
  const privateKey = eth.getPrivateKey(mnemonic, index)
  const txParams = {
    chainId: network,
    gasLimit: toHex(gasLimit),
    gasPrice: toHex(gasPrice),
    nonce: toHex(nonce),
    to,
    value: toHex(amount)
  }
  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = `0x${tx.serialize().toString('hex')}`
  return Task.of(rawTx)
})

export const serialize = (network, raw, signature) => {
  const { amount, gasLimit, gasPrice, nonce, to } = raw
  const txParams = {
    chainId: network,
    gasLimit: toHex(gasLimit),
    gasPrice: toHex(gasPrice),
    nonce: toHex(nonce),
    r: `0x${signature.r}`,
    s: `0x${signature.s}`,
    to,
    v: `0x${signature.v}`,
    value: toHex(amount)
  }
  const tx = new EthereumTx(txParams)
  return `0x${tx.serialize().toString('hex')}`
}

export const signLegacy = curry((network = 1, seedHex, data) => {
  const { amount, gasLimit, gasPrice, index, nonce, to } = data
  const privateKey = eth.getLegacyPrivateKey(seedHex, index)
  const txParams = {
    chainId: network || 1,
    gasLimit: toHex(gasLimit),
    gasPrice: toHex(gasPrice),
    nonce: toHex(nonce),
    to,
    value: toHex(amount)
  }

  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = `0x${tx.serialize().toString('hex')}`
  return Task.of(rawTx)
})
