import { compose } from 'ramda'
import { Wallet, Wrapper } from '../data'

const ImtoJS = i => i.toJS()
export const getWalletContext = compose(ImtoJS, Wallet.selectContext, Wrapper.selectWallet)
export const getAddressContext = compose(ImtoJS, Wallet.selectAddrContext, Wrapper.selectWallet)
export const getXpubsContext = compose(ImtoJS, Wallet.selectXpubsContext, Wrapper.selectWallet)

// // context is a single address/xpub for now
// export const getAddrInfo = dpath => context => state =>
//   state[dpath].get('addressesInfo').get(context)

// // context is a single address/xpub for now
// export const getTransactions = dpath => context => state => {
//   const info = getAddrInfo(dpath)(context)(state)
//   return info ? info.get('transactions') : List([])
// }

export const getBalance = bd => bd.wallet.final_balance
