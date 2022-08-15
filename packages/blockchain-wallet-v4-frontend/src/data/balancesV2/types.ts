import { UnifiedBalancesResponseType } from '@core/network/api/coins/types'
import { RemoteDataType } from '@core/types'

export type BalancesV2StateType = {
  unifiedBalances: RemoteDataType<string, UnifiedBalancesResponseType['currencies']>
}
