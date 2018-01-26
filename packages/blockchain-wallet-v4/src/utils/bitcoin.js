import { address, networks } from 'bitcoinjs-lib'
import { equals, or } from 'ramda'

export const isValidBitcoinAddress = value => {
  try {
    const addr = address.fromBase58Check(value)
    const n = networks.bitcoin
    const valid = or(equals(addr.version, n.pubKeyHash), equals(addr.version, n.scriptHash))
    return valid
  } catch (e) { console.log(e); return false }
}
