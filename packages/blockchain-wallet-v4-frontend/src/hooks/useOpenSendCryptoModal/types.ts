import { ModalOriginType } from 'data/types'

export type OpenSendCryptoModalHookOpenCallback = (props: {
  coin: string
  origin: ModalOriginType
}) => void

export type OpenSendCryptoModalHook = () => [OpenSendCryptoModalHookOpenCallback]
