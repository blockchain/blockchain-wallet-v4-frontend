import { ModalOriginType } from 'data/types'

export type OpenReceiveCryptoModalCallback = (props: {
  coin: string
  origin: ModalOriginType
}) => void

export type OpenReceiveCryptoModalHook = () => OpenReceiveCryptoModalCallback
