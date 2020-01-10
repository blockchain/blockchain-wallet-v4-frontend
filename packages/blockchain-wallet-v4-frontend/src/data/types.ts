import { ComponentsActionTypes } from './components/types'

// All ActionTypes should go here
// export type AppActionTypes = ComponentsActionTypes | ModuleActionTypes | etc
export type AppActionTypes = ComponentsActionTypes

export * from './components/types'
export * from './modules/types'
// Import via `import { AppActionTypes } from 'data/types'`
