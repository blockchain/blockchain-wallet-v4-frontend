import { ABTestCmdType, ABTestNameType } from './types'
import { curry, path } from 'ramda'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'

export const selectAbTest = curry((test: ABTestNameType, state: RootState):
  | RemoteDataType<string, ABTestCmdType>
  | undefined => path(['analytics', 'ab_tests', test], state))
