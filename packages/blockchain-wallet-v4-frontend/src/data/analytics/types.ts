import * as AT from './actionTypes'
import { AB_TESTS } from './model'
import { RemoteDataType } from 'core/types'
import { VerifyEmailType } from 'data/components/types'

// types
export type ABTestNameType = AB_TESTS

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
