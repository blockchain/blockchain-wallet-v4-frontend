import { renderHook } from '@testing-library/react-hooks'

import { useDate } from '.'

describe('#useDate()', () => {
  it('Should create date from string', () => {
    const { rerender, result } = renderHook((value: string) => useDate(value), {
      initialProps: '2022-03-30T17:00'
    })

    expect(result.current).toEqual(new Date(2022, 2, 30, 17))

    rerender('2022-03-23T17:00')

    expect(result.current).toEqual(new Date(2022, 2, 23, 17))
  })
})
