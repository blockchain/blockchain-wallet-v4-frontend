import { BSShowModalOriginType } from 'data/types'

export type OpenViewTradingAccountCallback = (props: {
  coin: string
  origin: BSShowModalOriginType
}) => void

export type OpenViewTradingAccountHook = () => OpenViewTradingAccountCallback
