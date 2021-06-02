import {
  createMockWalletState,
  walletV1,
  walletV2,
  walletV4,
  walletV4WithLegacy
} from '../../../data'
import * as selectors from './selectors'

describe('selectors.core.wallet', () => {
  describe('isHdWallet', () => {
    it('should return true for a v3 wallet', () => {
      const mockState = createMockWalletState(walletV4)
      const isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(true)
    })

    it('should return false for a v2 wallet', () => {
      const mockState = createMockWalletState(walletV2)
      const isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(false)
    })

    it('should return false for a v1 wallet', () => {
      const mockState = createMockWalletState(walletV1)
      const isHdWallet = selectors.isHdWallet(mockState)
      expect(isHdWallet).toEqual(false)
    })
  })

  describe('getSpendableAddrContext', () => {
    it('should return empty if there is no spendable context', () => {
      const mockState = createMockWalletState(walletV4)
      const spendableAddrContext = selectors.getSpendableAddrContext(mockState)
      expect(spendableAddrContext).toEqual([])
    })

    it('should return the spendable context', () => {
      const mockState = createMockWalletState(walletV4WithLegacy)
      const spendableAddrContext = selectors.getSpendableAddrContext(mockState)
      expect(spendableAddrContext).toEqual(['1EGW5YZs4EXExhLiCVvRXTRVmfLjs69bZc'])
    })
  })
})
