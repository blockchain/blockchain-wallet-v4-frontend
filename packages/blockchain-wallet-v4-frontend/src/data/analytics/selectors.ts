import { curry } from 'ramda'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

import { ABTestCmdType, ABTestNameType } from './types'

export const selectAbTest = curry(
  (
    test: ABTestNameType,
    state: RootState
  ): RemoteDataType<string, ABTestCmdType> | undefined =>
    state.analytics.ab_tests[test]
)
