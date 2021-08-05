import { SwapAccountType } from 'data/types'

export type SendFormType = {
  amount: string
  fix: 'CRYPTO' | 'FIAT'
  selectedAccount: SwapAccountType
  selectedCoin: string
  to: string
}
