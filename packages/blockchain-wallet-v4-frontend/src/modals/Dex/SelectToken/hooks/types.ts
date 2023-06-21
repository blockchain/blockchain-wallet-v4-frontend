import { DexTokenWithBalance } from '@core/network/api/dex'

export type UseFilteredListType = {
  items: DexTokenWithBalance[]
  search?: string
}
