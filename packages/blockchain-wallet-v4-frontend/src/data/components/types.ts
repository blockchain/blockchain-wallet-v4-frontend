import { BorrowActionTypes } from './borrow/types'
import { BrokerageActionTypes } from './brokerage/types'
import { FundRecoveryActionType } from './fundRecovery/types'
import { IdentityVerificationActionTypes } from './identityVerification/types'
import { RecoveryPhraseActionTypes } from './recoveryPhrase/types'
import { RequestActionTypes } from './request/types'
import { SimpleBuyActionTypes } from './simpleBuy/types'

// All relative ActionTypes should go here
// export type ComponentsActionTypes = IdentityVerificationActionTypes | ActivityListActionTypes | BchTransactionsActionTypes
export type ComponentsActionTypes =
  | BorrowActionTypes
  | BrokerageActionTypes
  | FundRecoveryActionType
  | IdentityVerificationActionTypes
  | RecoveryPhraseActionTypes
  | RequestActionTypes
  | SimpleBuyActionTypes

export * from './borrow/types'
export * from './brokerage/types'
export * from './fundRecovery/types'
export * from './identityVerification/types'
export * from './interest/types'
export * from './recoveryPhrase/types'
export * from './recurringBuys/types'
export * from './request/types'
export * from './sendBch/types'
export * from './sendBtc/types'
export * from './settings/types'
export * from './simpleBuy/types'
export * from './swap/types'
export * from './withdraw/types'
