import { renderHook } from '@testing-library/react-hooks'

import { useRecord } from '.'

describe('useRecord()', () => {
  it('Should map the value when the key changes', () => {
    type T1 = 'first_item' | 'second_item'

    const { rerender, result } = renderHook<[T1, Record<T1, number>], [unknown]>(
      (args) => useRecord<T1, number>(...args),
      {
        initialProps: [
          'first_item',
          {
            first_item: 1,
            second_item: 2
          }
        ]
      }
    )

    const [value] = result.current

    expect(value).toEqual(1)

    rerender([
      'second_item',
      {
        first_item: 1,
        second_item: 2
      }
    ])

    const [secondValue] = result.current

    expect(secondValue).toEqual(2)
  })
})
