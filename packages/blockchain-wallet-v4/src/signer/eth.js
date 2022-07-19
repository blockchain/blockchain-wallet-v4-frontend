import BigNumber from 'bignumber.js'
import Task from 'data.task'
import EthereumTx from 'ethereumjs-tx'
import * as ethers from 'ethers'
import { curry } from 'ramda'

import * as eth from '../utils/eth'

const extraGas = 600

const isOdd = (str) => str.length % 2 !== 0
const toHex = (value) => {
  const hex = new BigNumber(value).toString(16)
  return isOdd(hex) ? `0x0${hex}` : `0x${hex}`
}

export const signErc20 = curry((network = 1, mnemonic, txnData, contractAddress) => {
  const { amount, depositAddress, gasLimit, gasPrice, index, nonce, to } = txnData
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`)
  const transferMethodHex = '0xa9059cbb'

  // block ERC20 transfers/sends that are being created with 0 amount
  if (new BigNumber(amount).isZero()) {
    return Task.rejected(new Error('erc20_amount_cannot_be_zero'))
  }
  let data =
    transferMethodHex +
    ethers.utils.defaultAbiCoder
      .encode(['address', 'uint256'], [to, amount.toString()])
      .replace('0x', '')
  let gasLimitAdjusted = gasLimit
  // If a deposit address is specified, append the the address to the end of data payload and increase the gasLimit.
  if (depositAddress) {
    data += depositAddress.replace('0x', '')
    gasLimitAdjusted += extraGas
  }
  //
  const txParams = {
    chainId: network,
    data,
    gasLimit: toHex(gasLimitAdjusted),
    gasPrice: toHex(gasPrice),
    nonce: toHex(nonce),
    to: contractAddress,
    value: toHex(0)
  }
  return Task.of(wallet.signTransaction(txParams))
})

export const sign = curry((network = 1, mnemonic, txnData) => {
  const { amount, depositAddress, gasLimit, gasPrice, index, nonce, to } = txnData
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`)
  const gasLimitAdjusted = depositAddress ? gasLimit + extraGas : gasLimit
  const txParams = {
    chainId: network,
    ...(depositAddress && { data: depositAddress }),
    gasLimit: toHex(gasLimitAdjusted),
    gasPrice: toHex(gasPrice),
    nonce,
    to,
    value: toHex(amount)
  }
  return Task.of(wallet.signTransaction(txParams))
})

export const serialize = (network, raw, signature) => {
  const { amount, depositAddress, gasLimit, gasPrice, nonce, to } = raw
  const gasLimitAdjusted = depositAddress ? gasLimit + extraGas : gasLimit
  const txParams = {
    chainId: network,
    ...(depositAddress && { data: depositAddress }),
    gasLimit: toHex(gasLimitAdjusted),
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
  tx.sign(Buffer.from(privateKey.substr(2), 'hex'))
  const rawTx = `0x${tx.serialize().toString('hex')}`
  return Task.of(rawTx)
})
