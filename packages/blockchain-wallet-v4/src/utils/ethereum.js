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
  return EthHd.fromExtendedKey(account).getWallet().getPrivateKey()
}

// Derivation error using seedHex directly instead of seed derived from mnemonic derived from seedHex
export const getLegacyPrivateKey = seedHex => {
  return deriveChildLegacy(0, seedHex).getWallet().getPrivateKey()
}

const deriveChildLegacy = (index, seed) => {
  const derivationPath = "m/44'/60'/0'/0"
  return EthHd.fromMasterSeed(seed).derivePath(derivationPath).deriveChild(index)
}

export const privateKeyToAddress = pk =>
  EthUtil.toChecksumAddress(EthUtil.privateToAddress(pk).toString('hex')).toLowerCase()

export const deriveAddress = (mnemonic, index) =>
  privateKeyToAddress(getPrivateKey(mnemonic, index))

export const calculateFee = (gasPrice, gasLimit) => {
  const feeGWei = new BigNumber(gasPrice).mul(new BigNumber(gasLimit)).toString()
  return Exchange.convertEtherToEther({ value: feeGWei, fromUnit: 'GWEI', toUnit: 'WEI' }).value
}

export const calculateEffectiveBalance = (balance, fee) => {
  const balanceB = new BigNumber(balance)
  const feeB = new BigNumber(fee)
  const effectiveBalanceB = balanceB.sub(feeB)
  const zeroB = new BigNumber('0')
  return effectiveBalanceB.lessThan(zeroB) ? zeroB.toString() : effectiveBalanceB.toString()
}

export const calculateTransactionAmount = (amount, fee) => {
  return new BigNumber(amount).add(new BigNumber(fee)).toString()
}

export const convertGweiToWei = (amount) => {
  return new BigNumber(amount).mul('1000000000').toString()
}

export const convertFeeToWei = fees => ({
  gasLimit: prop('gasLimit', fees),
  priority: convertGweiToWei(prop('priority', fees)),
  regular: convertGweiToWei(prop('regular', fees)),
  limits: {
    min: convertGweiToWei(path(['limits', 'min'], fees)),
    max: convertGweiToWei(path(['limits', 'max'], fees))
  }
})

export const txHexToHashHex = txHex => new EthTx(txHex).hash().toString('hex')
