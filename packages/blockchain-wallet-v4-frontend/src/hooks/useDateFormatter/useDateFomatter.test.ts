import { renderHook } from '@testing-library/react-hooks'

import { useDateFormatter } from '.'

describe('useDateFormatter()', () => {
  it('Should format the date with pattern dd/mm/yyyy', () => {
    const { result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFormatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'dd/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')
  })

  it('Should update the result when the pattern changes', () => {
    const { rerender, result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFormatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'dd/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')

    rerender({
      date: new Date(2022, 1, 18),
      pattern: 'dd - MM - yyyy'
    })

    expect(result.current).toEqual('18 - 02 - 2022')
  })

  it('Should update the result when the date changes', () => {
    const { rerender, result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFormatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'dd/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')

    rerender({
      date: new Date(2020, 4, 16),
      pattern: 'dd/MM/yyyy'
    })

    expect(result.current).toEqual('16/05/2020')
  })
})
