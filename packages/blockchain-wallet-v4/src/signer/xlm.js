import { getKeyPair } from '../utils/xlm'

export const sign = ({ transaction }, mnemonic) => {
  const keyPair = getKeyPair(mnemonic)
  transaction.sign(keyPair)
  return transaction
}
