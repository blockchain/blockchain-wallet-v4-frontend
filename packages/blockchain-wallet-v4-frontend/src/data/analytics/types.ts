import { RemoteDataType } from 'blockchain-wallet-v4/src/types'

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
export interface CreateABTestSuccessActionType {
  payload: { result: ABTestCmdType; test: ABTestNameType }
}

export interface CreateABTestActionType {
  payload: { test: ABTestNameType }
}
