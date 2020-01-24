import { ComponentsActionTypes } from './components/types'
import { ModuleActionTypes } from './modules/types'

// All ActionTypes should go here
// export type AppActionTypes = ComponentsActionTypes | ModuleActionTypes | etc
export type AppActionTypes = ComponentsActionTypes | ModuleActionTypes

export * from './components/types'
export * from './modules/types'
export * from 'blockchain-wallet-v4/src'
// Import via `import { AppActionTypes } from 'data/types'`
