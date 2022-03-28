import { renderHook } from '@testing-library/react-hooks'

import { useIsToday } from '.'

describe('useIsToday()', () => {
  it('Should return false when the date is tomorrow', () => {
    const now = new Date()

    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    const { result } = renderHook(() => useIsToday(tomorrow))

    expect(result.current).toEqual(false)
  })

  it('Should return false when the date is yesterday', () => {
    const now = new Date()

    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)

    const { result } = renderHook(() => useIsToday(yesterday))

    expect(result.current).toEqual(false)
  })

  it('Should return true when the date is today', () => {
    const { result } = renderHook(() => useIsToday(new Date()))

    expect(result.current).toEqual(true)
  })
})
