import { selectAll } from '../coinSelection'
import { address, networks, ECPair } from 'bitcoinjs-lib'
import { equals, head, or, prop } from 'ramda'
import Base58 from 'bs58'
import BigInteger from 'bigi'
import * as Exchange from '../exchange'

export const isValidBitcoinAddress = value => {
  try {
    const addr = address.fromBase58Check(value)
    const n = networks.bitcoin
    const valid = or(equals(addr.version, n.pubKeyHash), equals(addr.version, n.scriptHash))
    return valid
  } catch (e) { return false }
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

export const isKey = function (bitcoinKey) {
  return bitcoinKey instanceof ECPair
}

export const calculateEffectiveBalanceSatoshis = (coins, feePerByte) => {
  const { outputs } = selectAll(feePerByte, coins)
  return prop('value', head(outputs)) || 0
}

export const calculateEffectiveBalanceBitcoin = (coins, feePerByte) => {
  const effectiveBalanceSatoshis = calculateEffectiveBalanceSatoshis(coins, feePerByte)
  return Exchange.convertBitcoinToBitcoin({ value: effectiveBalanceSatoshis, fromUnit: 'SAT', toUnit: 'BTC' }).value
}
