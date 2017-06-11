import { prop } from 'ramda'

// // context is a single address/xpub for now
// export const getAddrInfo = dpath => context => state =>
//   state[dpath].get('addressesInfo').get(context)

// // context is a single address/xpub for now
// export const getTransactions = dpath => context => state => {
//   const info = getAddrInfo(dpath)(context)(state)
//   return info ? info.get('transactions') : List([])
// }

export const getTransactions = prop('txs')
