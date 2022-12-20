import { Experiments } from '@core/network/api/experiments/types'
import { RemoteDataType } from '@core/types'

export type ExperimentsState = {
  data: RemoteDataType<string, Experiments>
}
