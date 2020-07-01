import * as AT from './actionTypes'
import { MempoolFeeType } from 'data/components/types'
import { RemoteDataType } from 'core/types'

// types
export type ABTestNameType = 'SwapFees'

export type ABTestCmdType = {
  command: MempoolFeeType
  from: 'matomo'
  to: 'swap'
}

// state
export type AnalyticsStateType = {
  ab_tests: {
    [key in ABTestNameType]?: RemoteDataType<string, ABTestCmdType>
  }
}

// actions
interface CreateABTestSuccessActionType {
  payload: { result: ABTestCmdType; test: ABTestNameType }
  type: typeof AT.CREATE_AB_TEST_SUCCESS
}

interface CreateABTestActionType {
  payload: { test: ABTestNameType }
  type: typeof AT.CREATE_AB_TEST
}

export type AnalyticsActionTypes =
  | CreateABTestActionType
  | CreateABTestSuccessActionType
