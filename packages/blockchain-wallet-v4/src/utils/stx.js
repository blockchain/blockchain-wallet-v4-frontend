import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'

export const deriveAddress = mnemonic => {
  const seed = BIP39.mnemonicToSeed(mnemonic)
  const address = Bitcoin.HDNode.fromSeedBuffer(seed)
    .deriveHardened(44)
    .deriveHardened(5757)
    .deriveHardened(0)
    .derive(0)
    .derive(0)
    .getAddress()

  return address
}
