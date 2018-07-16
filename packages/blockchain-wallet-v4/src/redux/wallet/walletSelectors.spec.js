import { Wrapper } from '../../types'
import * as selectors from './selectors'
import { walletV1, walletV2, walletV3 } from '../../../data'

describe('selectors.core.wallet', () => {
  let createMockState = (wallet) => ({
    walletPath: Wrapper.fromJS({ wallet })
  })

  describe('isHdWallet', () => {
    it('should return true for a v3 wallet', () => {
      let mockState = createMockState(walletV3)
      let isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(true)
    })

    it('should return false for a v2 wallet', () => {
      let mockState = createMockState(walletV2)
      let isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(false)
    })

    it('should return false for a v1 wallet', () => {
      let mockState = createMockState(walletV1)
      let isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(false)
    })
  })
})
