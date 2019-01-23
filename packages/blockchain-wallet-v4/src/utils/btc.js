import { selectAll } from '../coinSelection'
import { address, networks, ECPair, Transaction, crypto } from 'bitcoinjs-lib'
import { equals, head, or, propOr, compose, dropLast, last } from 'ramda'
import { decode, fromWords } from 'bech32'
import { fromPublicKey } from 'bip32'
import { compile } from 'bitcoinjs-lib/src/script'
import * as OP from 'bitcoin-ops'
import Base58 from 'bs58'
import BigInteger from 'bigi'
import BigNumber from 'bignumber.js'
import * as Exchange from '../exchange'
import Either from 'data.either'
import * as bippath from 'bip32-path'
import { fromCashAddr } from './bch'

export const isValidBitcoinAddress = (value, network) => {
  try {
    const addr = address.fromBase58Check(value)
    const n = network || networks.bitcoin
    return or(
      equals(addr.version, n.pubKeyHash),
      equals(addr.version, n.scriptHash)
    )
  } catch (e) {
    try {
      const decoded = decode(value)

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
        w => w.slice(1)
      )(words)

      return compile([OP[`OP_${version}`], program])
    } else if (value.toLowerCase().startsWith('bitcoincash')) {
      return address.toOutputScript(fromCashAddr(value), n)
    } else {
      return address.toOutputScript(value, n)
    }
  } catch (e) {
    return undefined
  }
}

export const scriptToAddress = (script, network) => {
  try {
    return address
      .fromOutputScript(Buffer.from(script, 'hex'), network)
      .toString()
  } catch (e) {
    return undefined
  }
}

export const detectPrivateKeyFormat = key => {
  let isTestnet = false
  // 51 characters base58, always starts with 5 (or 9, for testnet)
  const sipaRegex = isTestnet
    ? /^[9][1-9A-HJ-Za-km-z]{50}$/
    : /^[5][1-9A-HJ-Za-km-z]{50}$/

  if (sipaRegex.test(key)) {
    return 'sipa'
  }

  // 52 character compressed starts with L or K (or c, for testnet)
  const compsipaRegex = isTestnet
    ? /^[c][1-9A-HJ-Za-km-z]{51}$/
    : /^[LK][1-9A-HJ-Za-km-z]{51}$/

  if (compsipaRegex.test(key)) {
    return 'compsipa'
  }

  // 40-44 characters base58
  if (/^[1-9A-HJ-Za-km-z]{40,44}$/.test(key)) {
    return 'base58'
  }

  if (/^[A-Fa-f0-9]{64}$/.test(key)) {
    return 'hex'
  }

  if (
    /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+/]{44}$/.test(
      key
    )
  ) {
    return 'base64'
  }

  if (/^6P[1-9A-HJ-Za-km-z]{56}$/.test(key)) {
    return 'bip38'
  }

  if (
    /^S[1-9A-HJ-Za-km-z]{21}$/.test(key) ||
    /^S[1-9A-HJ-Za-km-z]{25}$/.test(key) ||
    /^S[1-9A-HJ-Za-km-z]{29}$/.test(key) ||
    /^S[1-9A-HJ-Za-km-z]{30}$/.test(key)
  ) {
    const testBytes = crypto.sha256(key + '?')

    if (testBytes[0] === 0x00 || testBytes[0] === 0x01) {
      return 'mini'
    }
  }
  return null
}

const parseMiniKey = function (miniKey) {
  const check = crypto.sha256(miniKey + '?')
  if (check[0] !== 0x00) {
    throw new Error('Invalid mini key')
  }
  return crypto.sha256(miniKey)
}

export const privateKeyStringToKey = function (
  value,
  format,
  network = networks.bitcoin,
  addr
) {
  if (format === 'sipa' || format === 'compsipa') {
    return ECPair.fromWIF(value, network)
  } else {
    let keyBuffer = null

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
      case 'mini':
        keyBuffer = parseMiniKey(value)
        break
      default:
        throw new Error('Unsupported Key Format')
    }

    const d = BigInteger.fromBuffer(keyBuffer)
    let keyPair = new ECPair(d, null, { network: network })

    if (addr && keyPair.getAddress() !== addr) {
      keyPair.compressed = false
    }

    return keyPair
  }
}

// formatPrivateKeyString :: String -> String -> String
export const formatPrivateKeyString = (keyString, format, addr) => {
  let keyFormat = detectPrivateKeyFormat(keyString)
  let eitherKey = Either.try(privateKeyStringToKey)(
    keyString,
    keyFormat,
    null,
    addr
  )
  return eitherKey.chain(key => {
    if (format === 'wif') return Either.of(key.toWIF())
    if (format === 'base58') return Either.of(Base58.encode(key.d.toBuffer(32)))
    return Either.Left(new Error('Unsupported Key Format'))
  })
}

export const isValidBitcoinPrivateKey = (value, network) => {
  try {
    let format = detectPrivateKeyFormat(value)
    return (
      format === 'bip38' ||
      privateKeyStringToKey(value, format, network) != null
    )
  } catch (e) {
    return false
  }
}

export const calculateBalanceSatoshi = (coins, feePerByte) => {
  const { outputs, fee } = selectAll(feePerByte, coins)
  const effectiveBalance = propOr(0, 'value', head(outputs))
  const balance = new BigNumber.sum(effectiveBalance, new BigNumber(fee))
  return { balance, fee, effectiveBalance }
}

export const isKey = function (bitcoinKey) {
  return bitcoinKey instanceof ECPair
}

export const calculateBalanceBitcoin = (coins, feePerByte) => {
  const data = calculateBalanceSatoshi(coins, feePerByte)
  return {
    balance: Exchange.convertBitcoinToBitcoin({
      value: data.balance,
      fromUnit: 'SAT',
      toUnit: 'BTC'
    }).value,
    fee: Exchange.convertBitcoinToBitcoin({
      value: data.fee,
      fromUnit: 'SAT',
      toUnit: 'BTC'
    }).value,
    effectiveBalance: Exchange.convertBitcoinToBitcoin({
      value: data.effectiveBalance,
      fromUnit: 'SAT',
      toUnit: 'BTC'
    }).value
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

export const compressPublicKey = publicKey => {
  const prefix = (publicKey[64] & 1) !== 0 ? 0x03 : 0x02
  const prefixBuffer = Buffer.alloc(1)
  prefixBuffer[0] = prefix
  return Buffer.concat([prefixBuffer, publicKey.slice(1, 1 + 32)])
}

export const fingerprint = publickey => {
  let pkh = compose(
    crypto.ripemd160,
    crypto.sha256
  )(publickey)
  return ((pkh[0] << 24) | (pkh[1] << 16) | (pkh[2] << 8) | pkh[3]) >>> 0
}

export const getParentPath = compose(
  array => bippath.fromPathArray(array).toString(),
  dropLast(1),
  path => bippath.fromString(path).toPathArray()
)

export const createXpubFromChildAndParent = (path, child, parent) => {
  let pathArray = bippath.fromString(path).toPathArray()
  let pkChild = compressPublicKey(Buffer.from(child.publicKey, 'hex'))
  let pkParent = compressPublicKey(Buffer.from(parent.publicKey, 'hex'))
  let hdnode = fromPublicKey(pkChild, Buffer.from(child.chainCode, 'hex'))
  hdnode.parentFingerprint = fingerprint(pkParent)
  hdnode.depth = pathArray.length
  hdnode.index = last(pathArray)
  return hdnode.toBase58()
}
