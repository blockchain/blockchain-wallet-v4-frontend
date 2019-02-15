import BitcoinMessage from 'bitcoinjs-message'

export const showResult = ({ address, message, signature }) =>
  Boolean(address && message && signature)

export const verifySignature = ({ address, message, signature }) => {
  // Exceptions are thrown if the signature is malformed or doesn't match the
  // address.
  try {
    return BitcoinMessage.verify(message, address, signature)
  } catch (exception) {
    return false
  }
}
