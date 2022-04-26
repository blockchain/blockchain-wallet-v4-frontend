import { RemoteHookState } from "../useRemote";

export type WalletHookProps = {
    address: string
}

export type WalletHook = (props: WalletHookProps) => RemoteHookState<string, {}>