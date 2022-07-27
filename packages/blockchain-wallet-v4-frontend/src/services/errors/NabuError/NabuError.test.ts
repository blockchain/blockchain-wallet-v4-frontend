import { NabuError } from '.'
import { NabuErrorIconProps } from './NabuError.types'

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
    const id = 'nabu_error_id'
    const title = 'Unable to quote USDC-USD'
    const message =
      "We are having problems fetching a quote for USDC-USD, don't worry - we're on it"
    const icon: NabuErrorIconProps = {
      accessibility: {
        description: 'error-icon'
      },
      status: {
        url: 'https://blockchain.com/asset/warning.png'
      },
      url: 'https://blockchain.com/asset/quote/usd-usdc.png'
    }

    const error = new NabuError({
      icon,
      id,
      message,
      title
    })

    expect(error.title).toEqual(title)
    expect(error.id).toEqual(id)
    expect(error.message).toEqual(message)
    expect(error.icon).toEqual(icon)
  })

  it('Should remove empty actions', () => {
    const error = new NabuError({
      actions: [
        {
          title: 'Go to enter amount',
          url: 'https://blockchain.com/go/to/enter'
        },
        {
          title: 'Blockchain',
          url: 'https://blockchain.com'
        }
      ],
      message: 'Message',
      title: 'Title'
    })

    const actions = error.actions ?? []

    expect(error.actions?.length).toEqual(2)
    expect(actions[0].title).toEqual('Go to enter amount')
    expect(actions[1].title).toEqual('Blockchain')
  })

  it('Should include the error categories when available', () => {
    const error = new NabuError({
      categories: ['TestCategory'],
      message: 'Message',
      title: 'Title'
    })

    expect(error.categories).toEqual(['TestCategory'])
  })
})
