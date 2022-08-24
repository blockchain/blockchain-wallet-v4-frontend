import { SwapAccountType } from 'data/types'

export type OpenSwapModalCallback = (account: SwapAccountType) => void

export type OpenSwapModalHook = () => OpenSwapModalCallback
