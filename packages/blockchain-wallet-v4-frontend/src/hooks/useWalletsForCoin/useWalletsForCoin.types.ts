import { RemoteHookState } from '../useRemote'

export type AddressData = {
  data: {
    label: string
    options: {
      label: string
      value: {
        address: string
        balance: number
        coin: string
        label: string
        type: string
      }
    }[]
    value: string
  }[]
}

export type WalletsForCoinHookData = {
  address: string
  available?: number
  balance?: number
  coin: string
  label: string
  type: string
}[]

export type WalletsForCoinHookProps = {
  coin: string
}

export type WalletsForCoinHook = (
  props: WalletsForCoinHookProps
) => RemoteHookState<string, WalletsForCoinHookData>
