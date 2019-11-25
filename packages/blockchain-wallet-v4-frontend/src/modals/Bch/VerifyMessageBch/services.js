import { fromCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import BitcoinMessage from 'bitcoinjs-message'

export const showResult = ({ address, message, signature }) =>
  Boolean(address && message && signature)

export const verifySignature = ({ address, message, signature }) => {
  // Exceptions are thrown if the signature is malformed or doesn't match the
  // address.
  try {
    // first need to convert to btc address format
    const btcAddr = fromCashAddr(address)
    return BitcoinMessage.verify(message, btcAddr, signature)
  } catch (error) {
    return false
  }
}
