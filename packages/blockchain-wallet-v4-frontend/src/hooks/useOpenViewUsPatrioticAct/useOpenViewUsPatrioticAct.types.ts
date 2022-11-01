import { BSShowModalOriginType } from 'data/types'

export type OpenViewUsPatrioticActCallback = (props: { origin: BSShowModalOriginType }) => void

export type OpenViewUsPatrioticActHook = () => OpenViewUsPatrioticActCallback
