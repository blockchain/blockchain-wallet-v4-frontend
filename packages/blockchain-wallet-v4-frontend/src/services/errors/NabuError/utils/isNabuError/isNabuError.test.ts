import NabuError from '../../NabuError'
import { isNabuError } from '.'

describe('isNabuError()', () => {
  it('Should return true when the error is a NabuError', () => {
    const title = 'Unable to quote USDC-USD'
    const message =
      "We are having problems fetching a quote for USDC-USD, don't worry - we're on it"

    const error = new NabuError({
      message,
      title
    })

    expect(isNabuError(error)).toBe(true)
  })

  it('Should return false when the error is not a NabuError', () => {
    const error = new Error('not a error')

    expect(isNabuError(error)).toBe(false)
  })

  it('Should return false when the error is a string', () => {
    const error = 'not a error'

    expect(isNabuError(error)).toBe(false)
  })
})
