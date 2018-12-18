import Bitcoin from 'bitcoinjs-lib'
import cashaddress from 'cashaddress'
import { selectAll } from '../coinSelection'
import { head, propOr } from 'ramda'
import BigNumber from 'bignumber.js'
// import * as Exchange from '../exchange'

export const TX_PER_PAGE = 1000
export const BSV_FORK_TIME = 1542300000

export const calculateBalanceSatoshi = (coins, feePerByte) => {
  const { outputs, fee } = selectAll(feePerByte, coins)
  const effectiveBalance = propOr(0, 'value', head(outputs))
  const balance = new BigNumber(effectiveBalance).add(new BigNumber(fee))
  return { balance, fee, effectiveBalance }
}

const formatAddr = (address, displayOnly) => {
  return displayOnly ? address.split('bitcoincash:')[1] : address
}

const hasPrefix = address => address.substring(0, 12) === 'bitcoincash:'

export const toCashAddr = (address, displayOnly) => {
  const pubKeyHash = 0
  const scriptHash = 5
  const cashAddrPrefix = 'bitcoincash'

  try {
    const { version, hash } = Bitcoin.address.fromBase58Check(address)

    switch (version) {
      case pubKeyHash:
        return formatAddr(
          cashaddress.encode(cashAddrPrefix, 'pubkeyhash', hash),
          displayOnly
        )
      case scriptHash:
        return formatAddr(
          cashaddress.encode(cashAddrPrefix, 'scripthash', hash),
          displayOnly
        )
      default:
        throw new Error('toBitcoinCash: Address type not supported')
    }
  } catch (e) {
    return undefined
  }
}

export const fromCashAddr = address => {
  const { hash, version } = hasPrefix(address)
    ? cashaddress.decode(address)
    : cashaddress.decode(`bitcoincash:${address}`)
  switch (version) {
    case 'pubkeyhash':
      return Bitcoin.address.toBase58Check(
        hash,
        Bitcoin.networks.bitcoin.pubKeyHash
      )
    case 'scripthash':
      return Bitcoin.address.toBase58Check(
        hash,
        Bitcoin.networks.bitcoin.scriptHash
      )
    default:
      throw new Error('fromBitcoinCash: Address type not supported')
  }
}

export const isCashAddr = address => {
  try {
    return fromCashAddr(address)
  } catch (e) {
    return false
  }
}

export const convertFromCashAddrIfCashAddr = addr =>
  isCashAddr(addr) ? fromCashAddr(addr) : addr
