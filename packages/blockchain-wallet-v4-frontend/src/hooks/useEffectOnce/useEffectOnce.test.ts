import { renderHook } from '@testing-library/react-hooks'

import { useEffectOnce } from '.'

describe('useEffectOnce()', () => {
  it('Should call the event callback only once any rerender', () => {
    const eventCallback = jest.fn()

    const { rerender } = renderHook(() => useEffectOnce(eventCallback))

    expect(eventCallback).toHaveBeenCalledTimes(1)

    rerender(eventCallback)

    expect(eventCallback).toHaveBeenCalledTimes(1)
  })
})
