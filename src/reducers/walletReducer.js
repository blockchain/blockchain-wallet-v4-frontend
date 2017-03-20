import { over, append, set, compose, view } from 'ramda'
import * as Lens from '../lens'
import * as A from '../actions'
import { Wallet, WalletUtils } from '../immutable'
import { encryptSecPass } from '../WalletCrypto'
import { Map } from 'immutable-ext'
import { combineReducers } from 'redux-immutable'
import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'

const emptyWallet = {
  "tx_notes": {},
  "guid": "",
  "tx_names": [],
  "double_encryption": false,
  "address_book": [],
  "keys": [],
  "hd_wallets": [
    {
      "seed_hex": "",
      "passphrase": "",
      "mnemonic_verified": false,
      "default_account_idx": 0,
      "accounts": [
        {
          "label": "",
          "archived": false,
          "xpriv": "",
          "xpub": "",
          "address_labels": [],
          "cache": {
            "receiveAccount": "",
            "changeAccount": ""
          }
        }
      ]
    }
  ],
  "sharedKey": "",
  "options": {
    "pbkdf2_iterations": 5000,
    "fee_per_kb": 10000,
    "html5_notifications": false,
    "logout_time": 600000
  }
}

export const WALLET_INITIAL_STATE = Wallet(emptyWallet)

export const walletImmutable = (state = WALLET_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_LOAD: {
      return action.payload.get('walletImmutable')
    }
    case A.SECOND_PASSWORD_ON:
    case A.SECOND_PASSWORD_OFF:{
      return action.payload
    }
    case A.WALLET_CLEAR: {
      return WALLET_INITIAL_STATE
    }
    case A.ADDRESS_ADD: {
      const {address, secondPassword} = action.payload
      return WalletUtils.addAddress(state, Map(address), secondPassword)
    }
    case A.ADDRESS_LABEL: {
      const {address, label} = action.payload
      const myAddressLens = compose(Lens.addresses, Lens.iLensProp(address));
      if(!view(myAddressLens, state)) { return state }
      return set(compose(myAddressLens, Lens.label), label ,state)
    }
    case A.WALLET_NEW_SET: { // wallet-signup
      // TODO :: all the derivations must be abstracted
      // data
      const {guid, sharedKey, mnemonic, password} = action.payload
      const defaultName = 'My Bitcoin Wallet'
      const entropy = BIP39.mnemonicToEntropy(mnemonic)
      const seed = BIP39.mnemonicToSeed(mnemonic)
      BIP39.entropyToMnemonic
      // TODO :: consider NETWORK (testnet, mainnet)
      const masterNode = Bitcoin.HDNode.fromSeedBuffer(seed)
      const index = 0;
      const accNode = masterNode.deriveHardened(44).deriveHardened(0).deriveHardened(index)
      const xpriv = accNode.toBase58()
      const xpub = accNode.neutered().toBase58()
      const receiveNode = accNode.derive(0)
      const changeNode = accNode.derive(1)
      const receivexpub = receiveNode.neutered().toBase58()
      const changexpub = changeNode.neutered().toBase58()
      // setters
      const accLens = compose(Lens.hdwallets, Lens.first, Lens.accounts, Lens.first)
      const setReceive = set(compose(accLens, Lens.cache, Lens.receiveAccount), receivexpub)
      const setChange = set(compose(accLens, Lens.cache, Lens.changeAccount), changexpub)
      const setxpriv = set(compose(accLens, Lens.xpriv), xpriv)
      const setxpub = set(compose(accLens, Lens.xpub), xpub)
      const setName = set(compose(accLens, Lens.label), defaultName)
      const setSeed = set(compose(Lens.hdwallets, Lens.first, Lens.seedHex), entropy)
      const setGuid = set(Lens.guid, guid)
      const setSharedKey = set(Lens.sharedKey, sharedKey)
      const setAll = compose(setReceive, setChange, setxpriv, setxpub, setName, setSeed, setSharedKey, setGuid)
      return setAll(WALLET_INITIAL_STATE)
    }
    default:
      return state
  }
}

// ///////////////////////////////////////////////////////////////////////////
export const pbkdf2_iterations = (state = 5000, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return 5000
    }
    case A.WALLET_LOAD: {
      return action.payload.get('pbkdf2_iterations')
    }
    case A.WALLET_NEW_SET: {
      return 5000 // intiial-iterations for new wallets
    }
    default:
      return state
  }
}

export const password = (state = '', action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return ''
    }
    case A.WALLET_LOAD: {
      return action.payload.get('password')
    }
    case A.MAIN_PASSWORD_CHANGE: {
      return action.payload
    }
    case A.WALLET_NEW_SET: {
      const { password } = action.payload
      return password
    }
    default:
      return state
  }
}

export const version = (state = 3, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return 3
    }
    case A.WALLET_LOAD: {
      return action.payload.get('version')
    }
    case A.WALLET_NEW_SET: {
      return 3
    }
    default:
      return state
  }
}

export const payload_checksum = (state = '', action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return ''
    }
    case A.WALLET_LOAD: {
      return action.payload.get('payload_checksum')
    }
    case A.PAYLOAD_CHECKSUM_CHANGE: {
      return action.payload
    }
    case A.WALLET_NEW_SET: {
      return ''
    }
    default:
      return state
  }
}

export const language = (state = 'en', action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return 'en'
    }
    case A.WALLET_LOAD: {
      return action.payload.get('language')
    }
    case A.WALLET_NEW_SET: {
      const { language } = action.payload
      return language ? language : 'en'
    }
    default:
      return state
  }
}


export const sync_pubkeys = (state = false, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return false
    }
    case A.WALLET_LOAD: {
      return action.payload.get('sync_pubkeys')
    }
    case A.WALLET_NEW_SET: {
      return false
    }
    default:
      return state
  }
}

export const war_checksum = (state = '', action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return ''
    }
    case A.WALLET_LOAD: {
      return action.payload.get('war_checksum')
    }
    case A.WALLET_NEW_SET: {
      return ''
    }
    default:
      return state
  }
}

export const auth_type = (state = 0, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return 0
    }
    case A.WALLET_LOAD: {
      return action.payload.get('auth_type') || 0
    }
    case A.WALLET_NEW_SET: {
      return 0
    }
    default:
      return state
  }
}

export const real_auth_type = (state = 0, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_CLEAR: {
      return 0
    }
    case A.WALLET_LOAD: {
      return action.payload.get('real_auth_type') || 0
    }
    case A.WALLET_NEW_SET: {
      return 0
    }
    default:
      return state
  }
}

const walletReducer = combineReducers({
  walletImmutable,
  pbkdf2_iterations,
  password,
  version,
  payload_checksum,
  language,
  sync_pubkeys,
  war_checksum,
  auth_type,
  real_auth_type
})

export default walletReducer
