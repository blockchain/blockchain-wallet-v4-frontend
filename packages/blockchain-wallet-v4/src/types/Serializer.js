import * as Wrapper from './Wrapper'
import * as HDWallet from './HDWallet'
import * as HDAccount from './HDAccount'
import * as Address from './Address'
import * as Wallet from './Wallet'
import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as Cache from './Cache'
import * as AddressMap from './AddressMap'
import * as AddressBook from './AddressBook'
import * as AddressBookEntry from './AddressBookEntry'
import * as HDAccountList from './HDAccountList'
import * as HDWalletList from './HDWalletList'
import * as TXNotes from './TXNotes'
import * as TXNames from './TXNames'
import * as Options from './Options'
import * as KVStoreEntry from './KVStoreEntry'
import Remote from '../remote'

const serializer = {
  replacer: function (key, value) {
    // Without this, jsan swallows the stack trace.
    if (value instanceof Error) {
      return {
        __serializedType__: `Error`,
        data: {
          message: value.message,
          stack: value.stack
        }
      }
    }

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
  reviver: function (key, value) {
    if (value && value.type === 'Buffer') {
      return Buffer.from(value.data)
    } else if (
      typeof value === 'object' &&
      value !== null &&
      '__serializedType__' in value
    ) {
      var data = value.data
      switch (value.__serializedType__) {
        case `Error`:
          return Object.assign(new Error(data.message), { stack: data.stack })
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
