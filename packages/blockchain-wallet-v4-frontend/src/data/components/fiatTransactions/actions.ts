import { WalletFiatType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

export const initialized = (currency: WalletFiatType) => ({
  type: AT.FIAT_TRANSACTIONS_INITIALIZED,
  payload: { currency }
})

export const loadMore = (currency: WalletFiatType) => ({
  type: AT.FIAT_TRANSACTIONS_LOAD_MORE,
  payload: { currency }
})
