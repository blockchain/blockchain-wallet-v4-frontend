import { RemoteHookState } from '../useRemote'
import { WalletsHookData } from '../useWallets'

export type WalletHookProps = {
  address: string
  coin: string
}

export type WalletHook = (props: WalletHookProps) => RemoteHookState<string, WalletsHookData>
