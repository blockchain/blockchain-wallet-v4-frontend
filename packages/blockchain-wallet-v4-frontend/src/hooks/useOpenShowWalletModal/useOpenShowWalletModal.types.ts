import { CoinType } from '@core/types'
import { ModalOriginType } from 'data/types'

export type OpenShowWalletModalCallbackProps = {
  address: string
  coin: CoinType
  origin: ModalOriginType
}

export type OpenShowWalletModalCallback = (props: OpenShowWalletModalCallbackProps) => void

export type OpenShowWalletModalHook = () => [OpenShowWalletModalCallback]
