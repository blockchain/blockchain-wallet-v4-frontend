import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'

import { useRecurringBuyBannerFlyout } from './useRecurringBuyBannerFlyout'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch)
  }
})

describe('useRecurringBuyBannerFlyout()', () => {
  describe('#showModal', () => {
    it('Should dispath an event to open the recurring buy banner', () => {
      const { result } = renderHook(() => useRecurringBuyBannerFlyout())

      const dispatch = useDispatch()

      expect(dispatch).not.toHaveBeenCalled()

      const showModal = result.current

      showModal()

      expect(dispatch).toHaveBeenCalledWith({
        payload: { origin: 'RECURRING_BUYS_BANNER' },
        type: 'recurringBuy/showModal'
      })
    })
  })
})
