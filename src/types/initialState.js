// This is meant to define inital state for each type
export const AddressBookEntry = {
  'addr': '',
  'label': ''
}

export const Cache = {
  'receiveAccount': '',
  'changeAccount': ''
}

export const AddressLabel = {
  'index': 0,
  'label': ''
}

export const Address = {
  'addr': '',
  'priv': '',
  'label': '',
  'tag': 0,
  'created_time': 0,
  'created_device_name': '',
  'created_device_version': ''
}

export const HDAccount = {
  'label': '',
  'archived': false,
  'xpriv': '',
  'xpub': '',
  'address_labels': [],
  'cache': Cache
}

export const HDWallet = {
  'seed_hex': '',
  'passphrase': '',
  'mnemonic_verified': false,
  'default_account_idx': 0,
  'accounts': []
}

export const Wallet = {
  'tx_notes': {},
  'guid': 'my-guid',
  'tx_names': [],
  'double_encryption': false,
  'address_book': [],
  'keys': [],
  'hd_wallets': [HDWallet],
  'sharedKey': 'my-shared-key',
  'options': {
    'pbkdf2_iterations': 5000,
    'fee_per_kb': 10000,
    'html5_notifications': false,
    'logout_time': 600000
  }
}

export const Wrapper = {
  sync_pubkeys: false,
  payload_checksum: '',
  storage_token: '',
  version: 3,
  language: 'en',
  wallet: Wallet,
  war_checksum: '',
  password: '',
  pbkdf2_iterations: 5000
}
