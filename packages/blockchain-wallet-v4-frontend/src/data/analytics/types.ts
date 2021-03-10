import { RemoteDataType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { AB_TESTS } from './model'

// types
export type ABTestNameType = AB_TESTS

export type VerifyEmailType = 'home' | 'verify-email'

export type ABTestCmdType = {
  command: VerifyEmailType
  from: 'matomo'
  to: 'signup'
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
