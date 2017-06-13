import { is } from 'ramda'

import * as Wrapper from './Wrapper'
// import * as HDWallet from './HDWallet'
// import * as HDAccount from './HDAccount'
// import * as Address from './Address'
// import * as Wallet from './Wallet'

const serializer = {
  // features: {
  //   pause: true, // start/pause recording of dispatched actions
  //   lock: true, // lock/unlock dispatching actions and side effects    
  //   persist: true, // persist states on page reloading
  //   export: true, // export history of actions in a file
  //   import: true, // import history of actions from a file
  //   jump: true, // jump back and forth (time travelling)
  //   skip: true, // skip (cancel) actions
  //   reorder: true, // drag and drop actions in the history list 
  //   dispatch: true, // dispatch custom actions or action creators
  //   test: true // generate tests for the selected actions
  // },
  serialize: {
    replacer: (key, value) => {
      switch (true) {
        case is(Wrapper.Wrapper, value):
          return { data: Wrapper.toJS(value), __serializedType__: 'Wrapper' }
        // case is(Wallet.Wallet, value):
        //   return { data: Wallet.toJS(value), __serializedType__: 'Wallet' }
        // case is(Address.Address, value):
        //   return { data: Address.toJS(value), __serializedType__: 'Address' }
        // case is(HDWallet.HDWallet, value):
        //   return { data: HDWallet.toJS(value), __serializedType__: 'HDWallet' }
        // case is(HDAccount.HDAccount, value):
        //   return { data: HDAccount.toJS(value), __serializedType__: 'HDAccount' }
        default:
          return value
      }
    },
    reviver: function (key, value) {
      if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
        var data = value.data
        switch (value.__serializedType__) {
          case 'Wrapper': return Wrapper.fromJS(data)
          // case 'Wallet': return Wallet.fromJS(data)
          // case 'Address': return Address.fromJS(data)
          // case 'HDWallet': return HDWallet.fromJS(data)
          // case 'HDAccount': return HDAccount.fromJS(data)
          default: return data
        }
      }
      return value
    }
  }
}

export default serializer
