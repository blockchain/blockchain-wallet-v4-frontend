import { RemoteHookState } from '../useRemote'
import { WalletsHookData } from '../useWallets'

export type WalletsForCoinHookProps = {
  coin: string
}

export type WalletsForCoinHook = (
  props: WalletsForCoinHookProps
) => RemoteHookState<string, WalletsHookData[]>
