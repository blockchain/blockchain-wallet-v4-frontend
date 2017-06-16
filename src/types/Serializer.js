import { is } from 'ramda'

import * as Wrapper from './Wrapper'
import * as HDWallet from './HDWallet'
import * as HDAccount from './HDAccount'
import * as Address from './Address'
import * as Wallet from './Wallet'
import * as AddressLabel from './AddressLabel'
import * as Cache from './Cache'

const serializer = {
  replacer: (key, value) => {
    switch (true) {
      case is(Wallet.Wallet, value):
        return { data: Wallet.toJSON(value), __serializedType__: 'Wallet' }
      case is(Address.Address, value):
        return { data: Address.toJSON(value), __serializedType__: 'Address' }
      case is(HDWallet.HDWallet, value):
        return { data: HDWallet.toJSON(value), __serializedType__: 'HDWallet' }
      case is(HDAccount.HDAccount, value):
        return { data: HDAccount.toJSON(value), __serializedType__: 'HDAccount' }
      case is(Wrapper.Wrapper, value):
        return { data: Wrapper.toJSON(value), __serializedType__: 'Wrapper' }
      case is(AddressLabel.AddressLabel, value):
        return { data: AddressLabel.toJSON(value), __serializedType__: 'AddressLabel' }
      case is(Cache.Cache, value):
        return { data: Cache.toJSON(value), __serializedType__: 'Cache' }
      default:
        return value
    }
  },
  reviver: function (key, value) {
    if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
      var data = value.data
      switch (value.__serializedType__) {
        case 'Wrapper': return Wrapper.fromJSON(data)
        case 'Wallet': return Wallet.fromJSON(data)
        case 'Address': return Address.fromJSON(data)
        case 'HDWallet': return HDWallet.fromJSON(data)
        case 'HDAccount': return HDAccount.fromJSON(data)
        case 'AddressLabel': return AddressLabel.fromJSON(data)
        case 'Cache': return Cache.fromJSON(data)
        default: return data
      }
    }
    return value
  }
}

export default serializer
