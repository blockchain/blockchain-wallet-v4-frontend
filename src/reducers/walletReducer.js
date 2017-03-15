import { over, append, set, compose, view } from 'ramda'
import * as Lens from '../lens'
import * as A from '../actions'
import { Wallet, WalletUtils } from '../immutable'
import { encryptSecPass } from '../WalletCrypto'
import { Map } from 'immutable-ext'
import { combineReducers } from 'redux-immutable'


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
