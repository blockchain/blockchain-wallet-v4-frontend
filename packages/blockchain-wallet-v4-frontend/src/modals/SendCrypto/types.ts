import { SwapAccountType } from 'data/types'

export type SendFormType = {
  amount: string
  coin: string
  fix: 'CRYPTO' | 'FIAT'
  selectedAccount: SwapAccountType
  to: string
}
