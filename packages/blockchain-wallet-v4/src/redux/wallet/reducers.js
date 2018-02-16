import { over, set } from 'ramda-lens'
import { compose } from 'ramda'

import * as T from './actionTypes.js'
import { Wrapper, Wallet, Options, HDWallet, HDWalletList, Address, AddressMap } from '../../types'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(Wrapper.createNewReadOnly('', ''))

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.SET_PAYLOAD_CHECKSUM: {
      const checksum = action.payload
      return set(Wrapper.payloadChecksum, checksum, state)
    }
    case T.REFRESH_WRAPPER:
    case T.SET_WRAPPER: {
      return action.payload
    }
    case T.DELETE_WRAPPER: {
      return WRAPPER_INITIAL_STATE
    }
    case T.SET_LEGACY_ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(Wrapper.wallet, Wallet.setLegacyAddressLabel(address, label), state)
    }
    case T.SET_AUTOLOGOUT: {
      const { time } = action.payload
      return over(compose(Wrapper.wallet, Wallet.options), Options.setLogoutTime(time), state)
    }
    case T.SET_ARCHIVED_ADDRESS: {
      console.log('Reducer: set archived address', action, Address, state)
      const { address } = action.payload.address
      // console.log('addr', Address.fromJS({address}), addrType)
      // console.log(AddressMap.address(address.address))
      const addr = Address.fromJS({ addr: address })
      console.log('addr', addr)
      Address.archive(addr)
      // return over(addr, Address.archive(addr), state)
    }
    case T.DELETE_LEGACY_ADDRESS: {
      const address = action.payload
      return over(Wrapper.wallet, Wallet.deleteLegacyAddress(address), state)
    }
    case T.SET_MAIN_PASSWORD: {
      const password = action.payload
      return set(Wrapper.password, password, state)
    }
    case T.SET_HD_ADDRESS_LABEL: {
      let { accountIdx, addressIdx, label } = action.payload
      return over(Wrapper.wallet, Wallet.setHdAddressLabel(accountIdx, addressIdx, label), state)
    }
    case T.DELETE_HD_ADDRESS_LABEL: {
      const { accountIdx, addressIdx } = action.payload
      return over(Wrapper.wallet, Wallet.deleteHdAddressLabel(accountIdx, addressIdx), state)
    }
    case T.VERIFY_MNEMONIC: {
      const mvLens = compose(Wrapper.wallet,
                             Wallet.hdWallets,
                             HDWalletList.hdwallet,
                             HDWallet.mnemonicVerified)
      return set(mvLens, true, state)
    }
    default:
      return state
  }
}

const walletReducer = wrapperReducer

export default walletReducer
