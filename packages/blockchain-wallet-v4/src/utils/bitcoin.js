import { selectAll } from '../coinSelection'
import { address, networks, ECPair, Transaction } from 'bitcoinjs-lib'
import { equals, head, or, prop, compose } from 'ramda'
import { decode, fromWords } from 'bech32'
import { compile } from 'bitcoinjs-lib/src/script'
import * as OP from 'bitcoin-ops'
import Base58 from 'bs58'
import BigInteger from 'bigi'
import BigNumber from 'bignumber.js'
import * as Exchange from '../exchange'
import Either from 'data.either'

export const isValidBitcoinAddress = value => {
  try {
    const addr = address.fromBase58Check(value)
    const n = networks.bitcoin
    return or(equals(addr.version, n.pubKeyHash), equals(addr.version, n.scriptHash))
  } catch (e) {
    try {
      const decoded = decode(value)

      // TODO how do we know which network we are on here?
      if (decoded.prefix !== 'bc') {
        return false
      }

      // We only validate version 0 scripts
      // TODO Should we fail other scripts? This would make upgrading harder in the future
      if (decoded.words[0] === 0) {
        const remainder = Buffer.from(fromWords(decoded.words.slice(1)))
        if (remainder.length !== 20 && remainder.length !== 32) {
          return false
        }
      }
      return true
    } catch (e1) {
      return false
    }
  }
}

export const addressToScript = (value, network) => {
  const n = network || networks.bitcoin

  try {
    if (value.toLowerCase().startsWith('bc')) {
      const words = decode(value).words
      const version = words[0]
      const program = compose(
        Buffer.from,
        fromWords,
        w => w.slice(1))(words)

      return compile([OP[`OP_${version}`], program])
    } else {
      return address.toOutputScript(value, n)
    }
  } catch (e) {
    return undefined
  }
}

export const scriptToAddress = (script, network) => {
  try {
    return address.fromOutputScript(Buffer.from(script, 'hex'), network).toString()
  } catch (e) {
    return undefined
  }
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

export const privateKeyStringToKey = function (value, format, network = networks.bitcoin) {
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
    return new ECPair(d, null, { network: network })
  }
}

// formatPrivateKeyString :: String -> String -> String
export const formatPrivateKeyString = (keyString, format) => {
  let keyFormat = detectPrivateKeyFormat(keyString)
  let eitherKey = Either.try(privateKeyStringToKey)(keyString, keyFormat)
  return eitherKey.chain(key => {
    if (format === 'wif') return Either.of(key.toWIF())
    if (format === 'base58') return Either.of(Base58.encode(key.d.toBuffer(32)))
    return Either.Left(new Error('Unsupported Key Format'))
  })
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

export const isKey = function (bitcoinKey) {
  return bitcoinKey instanceof ECPair
}

export const calculateBalanceBitcoin = (coins, feePerByte) => {
  const data = calculateBalanceSatoshi(coins, feePerByte)
  return {
    balance: Exchange.convertBitcoinToBitcoin({ value: data.balance, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    fee: Exchange.convertBitcoinToBitcoin({ value: data.fee, fromUnit: 'SAT', toUnit: 'BTC' }).value,
    effectiveBalance: Exchange.convertBitcoinToBitcoin({ value: data.effectiveBalance, fromUnit: 'SAT', toUnit: 'BTC' }).value
  }
}

export const getWifAddress = (key, compressed = true) => {
  let oldFlag = key.compressed // avoid input mutation
  key.compressed = compressed
  let result = { address: key.getAddress(), wif: key.toWIF() }
  key.compressed = oldFlag
  return result
}

export const txHexToHashHex = txHex => Transaction.fromHex(txHex).getId()
