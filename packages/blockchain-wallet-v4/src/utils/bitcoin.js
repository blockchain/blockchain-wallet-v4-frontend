import { selectAll } from '../coinSelection'
import { address, networks, ECPair, Transaction } from 'bitcoinjs-lib'
import { equals, head, or, prop } from 'ramda'
import Base58 from 'bs58'
import BigInteger from 'bigi'
import BigNumber from 'bignumber.js'
import * as Exchange from '../exchange'

export const isValidBitcoinAddress = value => {
  try {
    const addr = address.fromBase58Check(value)
    const n = networks.bitcoin
    const valid = or(equals(addr.version, n.pubKeyHash), equals(addr.version, n.scriptHash))
    return valid
  } catch (e) { console.log(e); return false }
}

export const detectPrivateKeyFormat = key => {
  let isTestnet = false
  // 51 characters base58, always starts with 5 (or 9, for testnet)
  var sipaRegex = isTestnet
    ? (/^[9][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/)
    : (/^[5][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/)

  if (sipaRegex.test(key)) {
    return 'sipa'
  }

  // 52 character compressed starts with L or K (or c, for testnet)
  var compsipaRegex = isTestnet
    ? (/^[c][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/)
    : (/^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/)

  if (compsipaRegex.test(key)) {
    return 'compsipa'
  }

  // 40-44 characters base58
  if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{40,44}$/.test(key)) {
    return 'base58'
  }

  if (/^[A-Fa-f0-9]{64}$/.test(key)) {
    return 'hex'
  }

  if (/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+/]{44}$/.test(key)) {
    return 'base64'
  }

  if (/^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(key)) {
    return 'bip38'
  }
  return null
}

export const privateKeyStringToKey = function (value, format) {
  if (format === 'sipa' || format === 'compsipa') {
    return ECPair.fromWIF(value, networks.bitcoin)
  } else {
    var keyBuffer = null

    switch (format) {
      case 'base58':
        keyBuffer = Base58.decode(value)
        break
      case 'base64':
        keyBuffer = Buffer.from(value, 'base64')
        break
      case 'hex':
        keyBuffer = Buffer.from(value, 'hex')
        break
      default:
        throw new Error('Unsupported Key Format')
    }

    var d = BigInteger.fromBuffer(keyBuffer)
    return new ECPair(d, null, { network: networks.bitcoin })
  }
}

export const isValidBitcoinPrivateKey = value => {
  try {
    let format = detectPrivateKeyFormat(value)
    return format === 'bip38' || privateKeyStringToKey(value, format) != null
  } catch (e) {
    return false
  }
}

export const calculateBalanceSatoshi = (coins, feePerByte) => {
  const { outputs, fee } = selectAll(feePerByte, coins)
  const effectiveBalance = prop('value', head(outputs)) || 0
  const balance = new BigNumber(effectiveBalance).add(new BigNumber(fee))
  return { balance, fee, effectiveBalance }
}

export const calculateBalanceBitcoin = (coins, feePerByte) => {
  const data = calculateBalanceSatoshi(coins, feePerByte)
  return {
    balance: Exchange.convertBitcoinToBitcoin({ value: data.balance, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    fee: Exchange.convertBitcoinToBitcoin({ value: data.fee, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    effectiveBalance: Exchange.convertBitcoinToBitcoin({ value: data.effectiveBalance, fromUnit: 'SAT', toUnit: 'BTC' }).value
  }
}

export const txHexToHashHex = txHex => Transaction.fromHex(txHex).getId()
