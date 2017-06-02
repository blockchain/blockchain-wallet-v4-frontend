import { Map, fromJS as iFromJS } from 'immutable-ext'
import * as R from 'ramda'
import { iLensProp } from '../lens'
import { typeDef, shift, shiftIProp } from '../util'
import Bitcoin from 'bitcoinjs-lib'
import BIP39 from 'bip39'

const DEFAULT_LABEL = 'My Bitcoin Wallet'

/* HDWallet :: {
  seed_hex :: String
  accounts :: [Account]
} */

function HDWallet (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(HDWallet)

export const seedHex = define('seedHex')
export const accounts = define('accounts')
export const xpriv = iLensProp('xpriv')

const shiftHDWallet = R.compose(shiftIProp('seed_hex', 'seedHex'), shift)

export const fromJS = (x) => {
  return new HDWallet(shiftHDWallet(iFromJS(x)).forward())
}

export const toJS = R.pipe(guard, (hd) => {
  return shiftHDWallet(hd.__internal).back().toJS()
})

export const createNew = R.curry((mnemonic, { label = DEFAULT_LABEL } = {}) => {
  let seed = BIP39.mnemonicToSeed(mnemonic)
  let entropy = BIP39.mnemonicToEntropy(mnemonic)
  let masterNode = Bitcoin.HDNode.fromSeedBuffer(seed)
  let accountNode = masterNode.deriveHardened(44).deriveHardened(0).deriveHardened(0)

  // TODO: move to own data type
  let account = {
    label,
    archived: false,
    xpriv: accountNode.toBase58(),
    xpub: accountNode.neutered().toBase58(),
    address_labels: [],
    cache: {
      receiveAccount: accountNode.derive(0).neutered().toBase58(),
      changeAccount: accountNode.derive(1).neutered().toBase58()
    }
  }

  return fromJS({
    seed_hex: entropy,
    passphrase: '',
    mnemonic_verified: false,
    default_account_idx: 0,
    accounts: [account]
  })
})

export default HDWallet
