import { CoinType } from '@core/types'
import { ModalOriginType } from 'data/types'

type OpenSendCryptoModalHookOpenCallback = (props: {
  coin: CoinType
  origin: ModalOriginType
}) => void

type OpenSendCryptoModalHook = () => [OpenSendCryptoModalHookOpenCallback]

export type { OpenSendCryptoModalHook, OpenSendCryptoModalHookOpenCallback }
