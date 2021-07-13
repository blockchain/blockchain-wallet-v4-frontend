import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'

export const deriveAddress = mnemonic => {
  const seed = BIP39.mnemonicToSeed(mnemonic)
  const pubkey = Bitcoin.bip32
    .fromSeed(seed)
    .deriveHardened(44)
    .deriveHardened(5757)
    .deriveHardened(0)
    .derive(0)
    .derive(0).publicKey

  return Bitcoin.payments.p2pkh({ pubkey }).address
}
