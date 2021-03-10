import Remote from '../remote'
import * as Address from './Address'
import * as AddressBook from './AddressBook'
import * as AddressBookEntry from './AddressBookEntry'
import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as AddressMap from './AddressMap'
import * as Cache from './Cache'
import * as Derivation from './Derivation'
import * as DerivationList from './DerivationList'
import * as HDAccount from './HDAccount'
import * as HDAccountList from './HDAccountList'
import * as HDWallet from './HDWallet'
import * as HDWalletList from './HDWalletList'
import * as KVStoreEntry from './KVStoreEntry'
import * as Options from './Options'
import * as TXNames from './TXNames'
import * as TXNotes from './TXNotes'
import * as Wallet from './Wallet'
import * as Wrapper from './Wrapper'

const serializer = {
  replacer: function(key, value) {
    // Remove all functions from the state
    if (value && typeof value === 'function') {
      return ''
    }
    // Remove redux form syncErrors from the state
    if (key === 'syncErrors') {
      return ''
    }
    // Remove redux persist from the state
    if (value && value === 'persist/PERSIST') {
      return ''
    }
    return value
  },
  reviver: function(key, value) {
    if (
      typeof value === 'object' &&
      value !== null &&
      '__serializedType__' in value
    ) {
      var data = value.data
      switch (value.__serializedType__) {
        case 'Wrapper':
          return Wrapper.reviver(data)
        case 'Wallet':
          return Wallet.reviver(data)
        case 'Address':
          return Address.reviver(data)
        case 'HDWallet':
          return HDWallet.reviver(data)
        case 'HDAccount':
          return HDAccount.reviver(data)
        case 'AddressLabel':
          return AddressLabel.reviver(data)
        case 'AddressLabelMap':
          return AddressLabelMap.reviver(data)
        case 'Cache':
          return Cache.reviver(data)
        case 'AddressMap':
          return AddressMap.reviver(data)
        case 'AddressBookEntry':
          return AddressBookEntry.reviver(data)
        case 'AddressBook':
          return AddressBook.reviver(data)
        case 'Derivation':
          return Derivation.reviver(data)
        case 'DerivationList':
          return DerivationList.reviver(data)
        case 'HDAccountList':
          return HDAccountList.reviver(data)
        case 'HDWalletList':
          return HDWalletList.reviver(data)
        case 'TXNotes':
          return TXNotes.reviver(data)
        case 'TXNames':
          return TXNames.reviver(data)
        case 'Options':
          return Options.reviver(data)
        case 'KVStoreEntry':
          return KVStoreEntry.reviver(data)
        case 'Success':
          return Remote.Success(data.__remote)
        case 'Failure':
          return Remote.Failure(data.__remote)
        case 'Loading':
          return Remote.Loading
        case 'NotAsked':
          return Remote.NotAsked
        default:
          return data
      }
    }
    return value
  }
}

export default serializer
