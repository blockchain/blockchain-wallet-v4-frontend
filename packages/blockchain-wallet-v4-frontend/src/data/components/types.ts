import { BrokerageActionTypes } from './brokerage/types'
import { IdentityVerificationActionTypes } from './identityVerification/types'
import { RecoveryPhraseActionTypes } from './recoveryPhrase/types'
import { SimpleBuyActionTypes } from './simpleBuy/types'

// All relative ActionTypes should go here
// export type ComponentsActionTypes = IdentityVerificationActionTypes | ActivityListActionTypes | BchTransactionsActionTypes
export type ComponentsActionTypes =
  | BrokerageActionTypes
  | IdentityVerificationActionTypes
  | RecoveryPhraseActionTypes
  | SimpleBuyActionTypes

export * from './brokerage/types'
export * from './identityVerification/types'
export * from './interest/types'
export * from './recoveryPhrase/types'
export * from './sendBch/types'
export * from './sendBtc/types'
export * from './settings/types'
export * from './simpleBuy/types'
export * from './swap/types'
export * from './withdraw/types'
