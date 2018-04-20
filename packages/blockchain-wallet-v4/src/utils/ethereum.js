import * as Exchange from '../exchange'
import { prop, path } from 'ramda'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import EthHd from 'ethereumjs-wallet/hdkey'
import EthTx from 'ethereumjs-tx'
import EthUtil from 'ethereumjs-util'
import BigNumber from 'bignumber.js'

/**
 * @param {string} address - The ethereum address
 */
export const isValidAddress = address => /^0x[a-fA-F0-9]{40}$/.test(address)

/**
 * @param {string} mnemonic
 * @param {integer} index
 */
export const getPrivateKey = (mnemonic, index) => {
  const seed = BIP39.mnemonicToSeed(mnemonic)
  const account = Bitcoin.HDNode.fromSeedBuffer(seed)
    .deriveHardened(44).deriveHardened(60).deriveHardened(0)
    .derive(0).derive(index).toBase58()
  return EthHd.fromExtendedKey(account)
}

// TODO :: implement same logic: https://github.com/blockchain/My-Wallet-V3/blob/master/src/eth/eth-wallet.js#L322
export const getLegacyPrivateKey = mnemonic => {
  throw new Error('Not implemented getLegacyPrivateKey()')
}

export const privateKeyToAddress = pk =>
  EthUtil.toChecksumAddress(EthUtil.privateToAddress(pk).toString('hex')).toLowerCase()

export const deriveAddress = (mnemonic, index) =>
  privateKeyToAddress(getPrivateKey(mnemonic, index).getWallet().getPrivateKey())

export const calculateFee = (gasPrice, gasLimit) => {
  const feeGWei = new BigNumber(gasPrice).mul(new BigNumber(gasLimit)).toString()
  return Exchange.convertEtherToEther({ value: feeGWei, fromUnit: 'GWEI', toUnit: 'WEI' }).value
}

export const calculateEffectiveBalance = (balance, fee) => {
  return new BigNumber(balance).sub(new BigNumber(fee)).toString()
}

export const calculateTransactionAmount = (amount, fee) => {
  return new BigNumber(amount).add(new BigNumber(fee)).toString()
}

export const convertGweiToWei = (amount) => {
  return new BigNumber(amount).mul('1000000000').toString()
}

// TODO :: to remove...
export const calculateFeeWei = (gasPrice, gasLimit) => gasPrice * gasLimit

// TODO :: to remove...
export const calculateBalanceWei = (gasPrice, gasLimit, balanceWei) => {
  const transactionFee = calculateFeeWei(gasPrice, gasLimit)
  return {
    balance: balanceWei,
    fee: transactionFee,
    effectiveBalance: balanceWei - transactionFee
  }
}

// TODO :: to remove...
export const convertFeeToWei = fees => ({
  gasLimit: prop('gasLimit', fees),
  priority: convertGweiToWei(prop('priority', fees)),
  regular: convertGweiToWei(prop('regular', fees)),
  limits: {
    min: convertGweiToWei(path(['limits', 'min'], fees)),
    max: convertGweiToWei(path(['limits', 'max'], fees))
  }
})

// TODO :: to remove...
export const calculateBalanceEther = (gasPrice, gasLimit, balanceWei) => {
  const data = calculateBalanceWei(gasPrice, gasLimit, balanceWei)
  return {
    balance: Exchange.convertEtherToEther({ value: data.balance, fromUnit: 'WEI', toUnit: 'ETH' }).value,
    fee: Exchange.convertEtherToEther({ value: data.fee, fromUnit: 'WEI', toUnit: 'ETH' }).value,
    effectiveBalance: Exchange.convertEtherToEther({ value: data.effectiveBalance, fromUnit: 'WEI', toUnit: 'ETH' }).value
  }
}

export const txHexToHashHex = txHex => new EthTx(txHex).hash().toString('hex')
