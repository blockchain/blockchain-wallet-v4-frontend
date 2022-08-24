import { BSShowModalOriginType } from 'data/types'

export type OpenSellFlowHookOpenCallback = (props: {
  coin: string
  origin: BSShowModalOriginType
}) => void

export type OpenSellFlowHook = () => OpenSellFlowHookOpenCallback
