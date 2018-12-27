import { Types } from '../src'

export { default as bchTx } from './tx.bch.json'
export { default as walletV1 } from './wallet.v1'
export { default as walletV2 } from './wallet.v2'
export { default as walletV3 } from './wallet.v3'
export { default as walletV3WithLegacy } from './wallet.v3-with-legacy'

export const createMockWalletState = wallet => ({
  walletPath: Types.Wrapper.fromJS({ wallet })
})

export const xpriv =
  'xprv9uMGUhxGeDoMcVjBXceA13ivqEUkfL7YzcFFnFWLj7San5jPi2cdPH144pNkyJuLMouf3acrvrtpQWJFGQLdReuWQwpMDvwLJcP7QEfysm8'
