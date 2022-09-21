import { BSShowModalOriginType } from 'data/types'

export type OpenBuyFlowHookOpenCallback = (props: {
  coin: string
  origin: BSShowModalOriginType
}) => void

export type OpenBuyFlowHook = () => OpenBuyFlowHookOpenCallback
