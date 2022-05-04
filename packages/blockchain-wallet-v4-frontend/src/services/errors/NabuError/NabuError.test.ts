import { NabuError } from '.'

describe('NabuError()', () => {
  it('Should create a nabu error with only title and message', () => {
    const title = 'Unable to quote USDC-USD'
    const message =
      "We are having problems fetching a quote for USDC-USD, don't worry - we're on it"

    const error = new NabuError({
      message,
      title
    })

    expect(error.title).toEqual(title)
    expect(error.message).toEqual(message)
  })

  it('Should create a nabu error with all properties', () => {
    const title = 'Unable to quote USDC-USD'
    const message =
      "We are having problems fetching a quote for USDC-USD, don't worry - we're on it"
    const icon = 'https://blockchain.com/asset/quote/usd-usdc.png'

    const error = new NabuError({
      icon,
      message,
      title
    })

    expect(error.title).toEqual(title)
    expect(error.message).toEqual(message)
    expect(error.icon).toEqual(icon)
  })
})
