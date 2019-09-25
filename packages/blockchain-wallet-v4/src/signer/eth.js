import BigNumber from 'bignumber.js'
import EthereumTx from 'ethereumjs-tx'
import EthereumAbi from 'ethereumjs-abi'

import { returnTask } from '../utils/functional'
import * as eth from '../utils/eth'
import Task from 'data.task'
import { curry } from 'ramda'
import Eth from '@ledgerhq/hw-app-eth'

const isOdd = str => str.length % 2 !== 0
const toHex = value => {
  const hex = new BigNumber(value).toString(16)
  return isOdd(hex) ? `0x0${hex}` : `0x${hex}`
}

export const signErc20 = curry(
  (network = 1, securityModule, data, contractAddress) => {
    const { index, to, amount, nonce, gasPrice, gasLimit } = data
    const privateKey = eth.getPrivateKey(securityModule, index)
    const transferMethodHex = '0xa9059cbb'
    const txParams = {
      to: contractAddress,
      nonce: toHex(nonce),
      gasPrice: toHex(gasPrice),
      gasLimit: toHex(gasLimit),
      value: toHex(0),
      chainId: network,
      data:
        transferMethodHex +
        EthereumAbi.rawEncode(['address'], [to]).toString('hex') +
        EthereumAbi.rawEncode(['uint256'], [amount]).toString('hex')
    }
    const tx = new EthereumTx(txParams)
    tx.sign(privateKey)
    const rawTx = '0x' + tx.serialize().toString('hex')
    return Task.of(rawTx)
  }
)

export const sign = curry((network = 1, securityModule, data) => {
  const { index, to, amount, nonce, gasPrice, gasLimit } = data
  const privateKey = eth.getPrivateKey(securityModule, index)
  const txParams = {
    to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasLimit),
    value: toHex(amount),
    chainId: network
  }
  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = '0x' + tx.serialize().toString('hex')
  return Task.of(rawTx)
})

export const signWithLockbox = function * (
  network = 1,
  transport,
  scrambleKey,
  data
) {
  const { to, amount, nonce, gasPrice, gasLimit } = data
  const txParams = {
    to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasLimit),
    value: toHex(amount),
    chainId: network,
    v: '0x01',
    s: '0x00',
    r: '0x00'
  }
  const tx = new EthereumTx(txParams)
  const rawTx = tx.serialize().toString('hex')
  const eth = new Eth(transport, scrambleKey)
  const signature = yield eth.signTransaction("44'/60'/0'/0/0", rawTx)
  return serialize(network, data, signature)
}

export const serialize = (network, raw, signature) => {
  const { to, amount, nonce, gasPrice, gasLimit } = raw
  const txParams = {
    to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasLimit),
    value: toHex(amount),
    chainId: network,
    r: '0x' + signature.r,
    v: '0x' + signature.v,
    s: '0x' + signature.s
  }
  const tx = new EthereumTx(txParams)
  return '0x' + tx.serialize().toString('hex')
}

export const signLegacy = curry(
  returnTask(async (network = 1, securityModule, secondPassword, data) => {
    const { to, amount, nonce, gasPrice, gasLimit } = data

    const privateKey = await securityModule.deriveLegacyEthereumKey({
      secondPassword
    })

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
    return '0x' + tx.serialize().toString('hex')
  })
)
