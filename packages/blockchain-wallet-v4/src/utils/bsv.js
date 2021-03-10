import Bitcoin from 'bitcoinjs-lib'
import cashaddress from 'cashaddress'

export const TX_PER_PAGE = 5

const formatAddr = (address, displayOnly) => {
  return displayOnly ? address.split('bitcoincash:')[1] : address
}

const hasPrefix = address => address.substring(0, 12) === 'bitcoincash:'

export const toCashAddr = (address, displayOnly) => {
  const pubKeyHash = 0
  const scriptHash = 5
  const cashAddrPrefix = 'bitcoincash'

  try {
    const { hash, version } = Bitcoin.address.fromBase58Check(address)

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
        throw new Error('toBch: Address type not supported')
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
      throw new Error('fromBch: Address type not supported')
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
