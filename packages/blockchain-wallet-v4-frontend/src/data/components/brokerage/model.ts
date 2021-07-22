import { WalletFiatType } from 'blockchain-wallet-v4/src/types'

export const DEFAULT_METHODS = {
  currency: 'EUR' as WalletFiatType,
  methods: []
}

export const POLLING = {
  RETRY_AMOUNT: 30,
  SECONDS: 10
}
