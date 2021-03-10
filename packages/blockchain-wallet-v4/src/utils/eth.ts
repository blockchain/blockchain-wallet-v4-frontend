import BigNumber from 'bignumber.js'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import EthUtil from 'ethereumjs-util'
import { hdkey as EthHd } from 'ethereumjs-wallet'
import { path, prop } from 'ramda'

import * as Exchange from '../exchange'

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
    .deriveHardened(44)
    .deriveHardened(60)
    .deriveHardened(0)
    .derive(0)
    .derive(index)
    .toBase58()
  return EthHd.fromExtendedKey(account)
    .getWallet()
    .getPrivateKey()
}

// Derivation error using seedHex directly instead of seed derived from mnemonic derived from seedHex
export const getLegacyPrivateKey = seedHex => {
  return deriveChildLegacy(0, seedHex)
    .getWallet()
    .getPrivateKey()
}

const deriveChildLegacy = (index, seed) => {
  const derivationPath = "m/44'/60'/0'/0"
  return EthHd.fromMasterSeed(seed)
    .derivePath(derivationPath)
    .deriveChild(index)
}

export const privateKeyToAddress = pk =>
  EthUtil.toChecksumAddress(EthUtil.privateToAddress(pk).toString('hex'))

export const deriveAddress = (mnemonic, index) =>
  privateKeyToAddress(getPrivateKey(mnemonic, index))

export const deriveAddressFromXpub = xpub => {
  const ethPublic = EthHd.fromExtendedKey(xpub)
    .getWallet()
    .getPublicKey()
  return EthUtil.toChecksumAddress(
    EthUtil.publicToAddress(ethPublic).toString('hex')
  )
}

export const calculateFee = (
  gasPrice: string,
  gasLimit: string,
  toWei: boolean
): string => {
  const feeGWei = new BigNumber(gasPrice)
    .multipliedBy(new BigNumber(gasLimit))
    .toString()

  if (toWei) {
    return Exchange.convertEtherToEther({
      value: feeGWei,
      fromUnit: 'GWEI',
      toUnit: 'WEI'
    }).value
  } else {
    return feeGWei
  }
}

export const calculateEffectiveBalance = (balance, fee, isErc20) => {
  const balanceB = new BigNumber(balance)
  if (isErc20) return balanceB.toString()
  const feeB = new BigNumber(fee)
  const effectiveBalanceB = balanceB.minus(feeB)
  const zeroB = new BigNumber('0')
  return effectiveBalanceB.isLessThan(zeroB)
    ? zeroB.toString()
    : effectiveBalanceB.toString()
}

export const calculateTransactionAmount = (amount, fee) => {
  return new BigNumber(amount).plus(new BigNumber(fee)).toString()
}

export const convertGweiToWei = amount => {
  return new BigNumber(amount).multipliedBy('1000000000').toString()
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

export const sanitazeEth = (data: string) => data.replace(/.*:/, '')
