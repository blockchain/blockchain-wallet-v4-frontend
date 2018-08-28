import { Types } from '../src'

export { default as walletV1 } from './wallet.v1'
export { default as walletV2 } from './wallet.v2'
export { default as walletV3 } from './wallet.v3'
export { default as walletV3WithLegacy } from './wallet.v3-with-legacy'

export const createMockState = wallet => ({
  walletPath: Types.Wrapper.fromJS({ wallet })
})
