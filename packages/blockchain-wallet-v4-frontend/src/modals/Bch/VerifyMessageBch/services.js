import { fromCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import BitcoinMessage from 'bitcoinjs-message'

export const showResult = ({ address, message, signature }) =>
  Boolean(address && message && signature)

export const verifySignature = ({ address, message, signature }) => {
  // Exceptions are thrown if the signature is malformed or doesn't match the
  // address.
  try {
    // first need to convert back from cash addr
    const addr = fromCashAddr(address)
    return BitcoinMessage.verify(message, addr, signature)
  } catch (exception) {
    return false
  }
}
