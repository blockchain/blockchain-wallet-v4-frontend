import { ComponentsActionTypes } from './components/types'
import { ModalActionTypes } from './modals/types'
import { ModuleActionTypes } from './modules/types'

// All ActionTypes should go here
// export type AppActionTypes = ComponentsActionTypes | ModuleActionTypes | etc
export type AppActionTypes =
  | ComponentsActionTypes
  | ModuleActionTypes
  | ModalActionTypes

export * from './components/types'
export * from './modules/types'
export * from './modals/types'
// Import via `import { AppActionTypes } from 'data/types'`
