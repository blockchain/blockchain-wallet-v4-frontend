import Bitcoin from 'bitcoinjs-lib'
import cashaddress from 'cashaddress'
import { selectAll } from '../coinSelection'
import { head, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import * as Exchange from '../exchange'

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

const formatAddr = (address, displayOnly) => {
  return displayOnly ? address.split('bitcoincash:')[1] : address
}

const hasPrefix = (address) => address.substring(0, 12) === 'bitcoincash:'

export const toCashAddr = (address, displayOnly) => {
  const pubKeyHash = 0
  const scriptHash = 5
  const cashAddrPrefix = 'bitcoincash'
  const { version, hash } = Bitcoin.address.fromBase58Check(address)
  switch (version) {
    case pubKeyHash:
      return formatAddr(cashaddress.encode(cashAddrPrefix, 'pubkeyhash', hash), displayOnly)
    case scriptHash:
      return formatAddr(cashaddress.encode(cashAddrPrefix, 'scripthash', hash), displayOnly)
    default:
      throw new Error('toBitcoinCash: Address type not supported')
  }
}

export const fromCashAddr = (address) => {
  const { hash, version } = hasPrefix(address) ? cashaddress.decode(address) : cashaddress.decode(`bitcoincash:${address}`)
  switch (version) {
    case 'pubkeyhash':
      return Bitcoin.address.toBase58Check(hash, Bitcoin.networks.bitcoin.pubKeyHash)
    case 'scripthash':
      return Bitcoin.address.toBase58Check(hash, Bitcoin.networks.bitcoin.scriptHash)
    default:
      throw new Error('fromBitcoinCash: Address type not supported')
  }
}

export const isCashAddr = (address) => {
  try { return fromCashAddr(address) } catch (e) { return false }
}
