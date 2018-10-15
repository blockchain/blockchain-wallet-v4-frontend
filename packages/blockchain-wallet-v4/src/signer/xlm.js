import * as StellarSdk from 'stellar-sdk'
import BIP39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'

export const sign = ({ transaction }, mnemonic) => {
  const seed = BIP39.mnemonicToSeed(mnemonic)
  const seedHex = seed.toString('hex')
  const masterKey = ed25519.derivePath("m/44'/148'/0'", seedHex)
  const keyPair = StellarSdk.Keypair.fromRawEd25519Seed(masterKey.key)
  transaction.sign(keyPair)
  return transaction
}
