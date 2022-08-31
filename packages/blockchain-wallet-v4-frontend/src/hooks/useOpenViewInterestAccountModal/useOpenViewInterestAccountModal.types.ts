import { BSShowModalOriginType } from 'data/types'

export type OpenViewInterestAccountModalCallback = (props: {
  coin: string
  origin: BSShowModalOriginType
}) => void

export type OpenViewInterestAccountModalHook = () => OpenViewInterestAccountModalCallback
