import * as Exchange from '../exchange'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import EthHd from 'ethereumjs-wallet/hdkey'
import EthUtil from 'ethereumjs-util'

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

export const getLegacyPrivateKey = mnemonic => {
  // find the legacy private
}

export const privateKeyToAddress = pk =>
  EthUtil.toChecksumAddress(EthUtil.privateToAddress(pk).toString('hex')).toLowerCase()

export const deriveAddress = (mnemonic, index) =>
  privateKeyToAddress(getPrivateKey(mnemonic, index).getWallet().getPrivateKey())

export const calculateFee = (gasPrice, gasLimit) => Exchange.convertEtherToEther({ value: (gasPrice * gasLimit), fromUnit: 'GWEI', toUnit: 'WEI' }).value

export const calculateFeeAndEffectiveBalanceWei = (gasPrice, gasLimit, balanceWei) => {
  const transactionFee = calculateFee(gasPrice, gasLimit)
  return {
    fee: transactionFee,
    effectiveBalance: balanceWei - transactionFee
  }
}

export const calculateFeeAndEffectiveBalanceEther = (gasPrice, gasLimit, balanceWei) => {
  const data = calculateFeeAndEffectiveBalanceWei(gasPrice, gasLimit, balanceWei)
  return {
    fee: data.fee,
    effectiveBalance: Exchange.convertEtherToEther({ value: data.effectiveBalance, fromUnit: 'WEI', toUnit: 'ETH' }).value
  }
}
