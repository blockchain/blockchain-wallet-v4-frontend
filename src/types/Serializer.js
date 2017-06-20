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

const serializer = {
  reviver: function (key, value) {
    if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
      var data = value.data
      switch (value.__serializedType__) {
        case 'Wrapper': return Wrapper.reviver(data)
        case 'Wallet': return Wallet.reviver(data)
        case 'Address': return Address.reviver(data)
        case 'HDWallet': return HDWallet.reviver(data)
        case 'HDAccount': return HDAccount.reviver(data)
        case 'AddressLabel': return AddressLabel.reviver(data)
        case 'AddressLabelMap': return AddressLabelMap.reviver(data)
        case 'Cache': return Cache.reviver(data)
        case 'AddressMap': return AddressMap.reviver(data)
        case 'AddressBookEntry': return AddressBookEntry.reviver(data)
        case 'AddressBook': return AddressBook.reviver(data)
        case 'HDAccountList': return HDAccountList.reviver(data)
        case 'HDWalletList': return HDWalletList.reviver(data)
        case 'TXNotes': return TXNotes.reviver(data)
        case 'TXNames': return TXNames.reviver(data)
        case 'Options': return Options.reviver(data)
        default: return data
      }
    }
    return value
  }
}

export default serializer
