import { waitFor } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import MockDate from 'mockdate'

import { useCountDown } from './useCountDown'

jest.useFakeTimers()

const setup = (date: Date, totalMs: number) =>
  renderHook((props) => useCountDown(props.date, props.totalMs), {
    initialProps: {
      date,
      totalMs
    }
  })

const CURRENT_TIMESTAMP = 1653436800000

describe('useCountDown', () => {
  beforeEach(() => {
    MockDate.set(CURRENT_TIMESTAMP)
  })

  afterEach(() => {
    MockDate.reset()
    jest.restoreAllMocks()
  })

  it.each([
    [CURRENT_TIMESTAMP + 1, false],
    [CURRENT_TIMESTAMP, true],
    [CURRENT_TIMESTAMP - 1, true]
  ])('should correctly calculate and return isCompleted flag %#', (timestamp, flag) => {
    const { result } = setup(new Date(timestamp), 0)

    expect(result.current.isCompleted).toBe(flag)
  })

  it.each([
    [CURRENT_TIMESTAMP + 3001, false],
    [CURRENT_TIMESTAMP + 3000, true],
    [CURRENT_TIMESTAMP - 2999, true]
  ])('should correctly calculate and return isCompletingSoon flag %#', (timestamp, flag) => {
    const { result } = setup(new Date(timestamp), 0)

    expect(result.current.isCompletingSoon).toBe(flag)
  })

  it.each([
    [{ percentage: 100, timestamp: CURRENT_TIMESTAMP + 3000, totalMs: 0 }],
    [{ percentage: 100, timestamp: CURRENT_TIMESTAMP, totalMs: 50000 }],
    [{ percentage: 100, timestamp: CURRENT_TIMESTAMP - 1, totalMs: 50000 }],
    [{ percentage: 6, timestamp: CURRENT_TIMESTAMP + 47000, totalMs: 50000 }],
    [{ percentage: 94, timestamp: CURRENT_TIMESTAMP + 3000, totalMs: 50000 }]
  ])(
    'should correctly calculate and return percentage value %#',
    ({ percentage, timestamp, totalMs }) => {
      const { result } = setup(new Date(timestamp), totalMs)

      expect(result.current.percentage).toBe(percentage)
    }
  )

  it.each([
    [{ timer: '01:01', timestamp: CURRENT_TIMESTAMP + 61000 }],
    [{ timer: '00:01', timestamp: CURRENT_TIMESTAMP + 1000 }],
    [{ timer: '00:00', timestamp: CURRENT_TIMESTAMP + 500 }],
    [{ timer: '00:00', timestamp: CURRENT_TIMESTAMP }]
  ])('should correctly calculate and return timer value %#', ({ timer, timestamp }) => {
    const { result } = setup(new Date(timestamp), 0)

    expect(result.current.timer).toBe(timer)
  })

  it('should set an interval', () => {
    const setIntervalSpy = jest.spyOn(window, 'setInterval')
    setup(new Date(), 0)

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000)
  })

  describe('when interval handler is called', () => {
    describe('and when time left is less or equal to 0', () => {
      it.each([0, -500])('should clear the interval %#', (offset) => {
        const setIntervalSpy = jest.spyOn(window, 'setInterval')
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
        setup(new Date(CURRENT_TIMESTAMP + offset), 0)

        act(() => {
          setIntervalSpy.mock.calls[0][0]()
        })

        expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Number))
      })
    })

    describe('and when time left is more than zero', () => {
      it('should update the timer', async () => {
        const setIntervalSpy = jest.spyOn(window, 'setInterval')
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
        const { result } = setup(new Date(CURRENT_TIMESTAMP + 10000), 0)

        expect(result.current.timer).toBe('00:10')

        act(() => {
          MockDate.set(CURRENT_TIMESTAMP + 1000)
          setIntervalSpy.mock.calls[0][0]()
        })

        await waitFor(() => expect(result.current.timer).toBe('00:09'))
        expect(clearIntervalSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('when re-rendered with new initial time', () => {
    it('should return new initial time', () => {
      const { rerender, result } = setup(new Date(CURRENT_TIMESTAMP + 1000), 0)

      expect(result.current.timer).toBe('00:01')

      rerender({
        date: new Date(CURRENT_TIMESTAMP + 2000),
        totalMs: 0
      })

      expect(result.current.timer).toBe('00:02')
    })

    it('should clear existing interval', () => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
      const { rerender } = setup(new Date(CURRENT_TIMESTAMP + 1000), 0)

      rerender({
        date: new Date(CURRENT_TIMESTAMP + 2000),
        totalMs: 0
      })

      expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Number))
    })

    it('should set a new interval', () => {
      const setIntervalSpy = jest.spyOn(window, 'setInterval')
      const { rerender } = setup(new Date(CURRENT_TIMESTAMP + 1000), 0)

      rerender({
        date: new Date(CURRENT_TIMESTAMP + 2000),
        totalMs: 0
      })

      expect(setIntervalSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 1000)
    })
  })

  describe('when unmounted', () => {
    it('should clear the interval', () => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
      const { unmount } = setup(new Date(), 0)

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Number))
    })
  })
})
