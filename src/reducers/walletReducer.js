import * as A from '../actions'
import * as WalletUtil from '../immutable/Wallet'
import * as AddressUtil from '../immutable/Address'
import { combineReducers } from 'redux-immutable'

const emptyWallet = {
  'tx_notes': {},
  'guid': '',
  'tx_names': [],
  'double_encryption': false,
  'address_book': [],
  'keys': [],
  'hd_wallets': [
    {
      'seed_hex': '',
      'passphrase': '',
      'mnemonic_verified': false,
      'default_account_idx': 0,
      'accounts': [
        {
          'label': '',
          'archived': false,
          'xpriv': '',
          'xpub': '',
          'address_labels': [],
          'cache': {
            'receiveAccount': '',
            'changeAccount': ''
          }
        }
      ]
    }
  ],
  'sharedKey': '',
  'options': {
    'pbkdf2_iterations': 5000,
    'fee_per_kb': 10000,
    'html5_notifications': false,
    'logout_time': 600000
  }
}

export const WALLET_INITIAL_STATE = WalletUtil.fromJS(emptyWallet)

export const walletImmutable = (state = WALLET_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case A.WALLET_LOAD: {
      return action.payload.get('walletImmutable')
    }
    case A.SECOND_PASSWORD_ON:
    case A.SECOND_PASSWORD_OFF: {
      return action.payload
    }
    case A.WALLET_CLEAR: {
      return WALLET_INITIAL_STATE
    }
    case A.ADDRESS_ADD: {
      const { address, secondPassword } = action.payload
      return WalletUtil.addAddress(state, AddressUtil.fromJS(address), secondPassword)
    }
    case A.ADDRESS_LABEL: {
      const { address, label } = action.payload
      return WalletUtil.setAddressLabel(address, label, state)
    }
    case A.WALLET_NEW_SET: {
      let { guid, sharedKey, mnemonic } = action.payload
      return WalletUtil.createNew(guid, sharedKey, mnemonic)
    }
    default:
      return state
  }
}

// ///////////////////////////////////////////////////////////////////////////
export const pbkdf2Iterations = (state = 5000, action) => {
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

export const payloadChecksum = (state = '', action) => {
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
      const { language = 'en' } = action.payload
      return language
    }
    default:
      return state
  }
}

export const syncPubkeys = (state = false, action) => {
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

export const warChecksum = (state = '', action) => {
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

export const authType = (state = 0, action) => {
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

export const realAuthType = (state = 0, action) => {
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
  pbkdf2Iterations,
  password,
  version,
  payloadChecksum,
  language,
  syncPubkeys,
  warChecksum,
  authType,
  realAuthType
})

export default walletReducer
