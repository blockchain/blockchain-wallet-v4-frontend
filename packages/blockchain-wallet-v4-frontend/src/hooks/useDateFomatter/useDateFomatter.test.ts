import { renderHook } from '@testing-library/react-hooks'

import { useDateFomatter } from '.'

describe('useDateFomatter()', () => {
  it('Should format the date with parttern DD/MM/yyyy', () => {
    const { result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFomatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'DD/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')
  })

  it('Should update the result when the pattern changes', () => {
    const { rerender, result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFomatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'DD/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')

    rerender({
      date: new Date(2022, 1, 18),
      pattern: 'DD - MM - yyyy'
    })

    expect(result.current).toEqual('18 - 02 - 2022')
  })

  it('Should update the result when the date changes', () => {
    const { rerender, result } = renderHook(
      ({ date, pattern }: { date: Date; pattern: string }) => useDateFomatter(date, pattern),
      {
        initialProps: {
          date: new Date(2022, 1, 18),
          pattern: 'DD/MM/yyyy'
        }
      }
    )

    expect(result.current).toEqual('18/02/2022')

    rerender({
      date: new Date(2020, 4, 16),
      pattern: 'DD/MM/yyyy'
    })

    expect(result.current).toEqual('16/05/2020')
  })
})
