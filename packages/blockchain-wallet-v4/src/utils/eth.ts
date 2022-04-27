import { HDNode } from '@ethersproject/hdnode'
import BigNumber from 'bignumber.js'
import * as ethers from 'ethers'
import { path, prop } from 'ramda'

export const convertGweiToWei = (amount) => {
  return new BigNumber(amount).multipliedBy('1000000000').toString()
}

/**
 * @param {string} address - The ethereum address
 */
export const isValidAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address)

export const getWallet = (mnemonic, index = 0) => {
  return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`)
}

export const getPrivateKey = (mnemonic, index = 0) => {
  return getWallet(mnemonic, index).privateKey
}

const deriveChildLegacy = (index, seed) => {
  const derivationPath = `m/44'/60'/0'/0/${index}`
  return HDNode.fromSeed(Buffer.from(seed)).derivePath(derivationPath)
}

// Derivation error using seedHex directly instead of seed derived from mnemonic derived from seedHex
export const getLegacyPrivateKey = (seedHex) => {
  return deriveChildLegacy(0, seedHex).privateKey
}

export const deriveAddress = (mnemonic: string): string => {
  return ethers.Wallet.fromMnemonic(mnemonic).address
}

export const deriveAddressFromXpub = (xpub) => {
  const ethPublic = HDNode.fromExtendedKey(xpub).publicKey
  return ethers.utils.computeAddress(ethPublic)
}

export const calculateFee = (
  gasPrice: string,
  gasLimit: string,
  toWei: boolean,
  extraGasForMemo = 0
): string => {
  const feeGWei = new BigNumber(gasPrice)
    .multipliedBy(new BigNumber(gasLimit).plus(extraGasForMemo))
    .toString()

  if (toWei) {
    return convertGweiToWei(feeGWei)
  }
  return feeGWei
}

export const calculateEffectiveBalance = (balance, fee, isErc20) => {
  const balanceB = new BigNumber(balance)
  if (isErc20) return balanceB.toString()
  const feeB = new BigNumber(fee)
  const effectiveBalanceB = balanceB.minus(feeB)
  const zeroB = new BigNumber('0')
  return effectiveBalanceB.isLessThan(zeroB) ? zeroB.toString() : effectiveBalanceB.toString()
}

export const calculateTransactionAmount = (amount, fee) => {
  return new BigNumber(amount).plus(new BigNumber(fee)).toString()
}

export const convertFeeToWei = (fees) => ({
  gasLimit: prop('gasLimit', fees),
  limits: {
    max: convertGweiToWei(path(['limits', 'max'], fees)),
    min: convertGweiToWei(path(['limits', 'min'], fees))
  },
  priority: convertGweiToWei(prop('priority', fees)),
  regular: convertGweiToWei(prop('regular', fees))
})

export const sanitazeEth = (data: string) => data.replace(/.*:/, '')
