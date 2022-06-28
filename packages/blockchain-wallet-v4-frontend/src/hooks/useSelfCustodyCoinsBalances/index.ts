import { CoinfigType } from '@core/redux/walletOptions/types'

export type CoinDataItem = { balance: number; coinfig: CoinfigType }
export { useSelfCustodyCoinsBalances } from './useSelfCustodyCoinsBalances'
