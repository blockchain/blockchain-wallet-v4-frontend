import { RemoteHookState } from '../useRemote'

export type CoinBalanceHookProps = { coin: string }

export type CoinBalanceHook = (props: CoinBalanceHookProps) => RemoteHookState<string, number>
