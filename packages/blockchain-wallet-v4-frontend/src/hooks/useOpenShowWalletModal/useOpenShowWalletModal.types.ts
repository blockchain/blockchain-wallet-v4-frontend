import { ModalOriginType } from 'data/types'

export type OpenShowWalletModalCallbackProps = {
  address: string
  origin: ModalOriginType
}

export type OpenShowWalletModalCallback = (props: OpenShowWalletModalCallbackProps) => void

export type OpenShowWalletModalHook = () => [OpenShowWalletModalCallback]
