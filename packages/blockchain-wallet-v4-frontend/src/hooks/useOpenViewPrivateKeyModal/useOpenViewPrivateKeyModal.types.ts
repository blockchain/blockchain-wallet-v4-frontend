import { BSShowModalOriginType } from 'data/types'

export type OpenViewPrivateKeyModalCallback = (props: {
  coin: string
  origin: BSShowModalOriginType
}) => void

export type OpenViewPrivateKeyModalHook = () => OpenViewPrivateKeyModalCallback
