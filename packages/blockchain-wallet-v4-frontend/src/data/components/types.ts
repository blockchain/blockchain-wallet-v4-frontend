import { BorrowActionTypes } from './borrow/types'
import { IdentityVerificationActionTypes } from './identityVerification/types'
import { RecoveryPhraseActionTypes } from './recoveryPhrase/types'
import { SimpleBuyActionTypes } from './simpleBuy/types'

// All relative ActionTypes should go here
// export type ComponentsActionTypes = IdentityVerificationActionTypes | ActivityListActionTypes | BchTransactionsActionTypes
export type ComponentsActionTypes =
  | BorrowActionTypes
  | IdentityVerificationActionTypes
  | RecoveryPhraseActionTypes
  | SimpleBuyActionTypes

export * from './borrow/types'
export * from './identityVerification/types'
export * from './recoveryPhrase/types'
export * from './sendBch/types'
export * from './sendBtc/types'
export * from './simpleBuy/types'
