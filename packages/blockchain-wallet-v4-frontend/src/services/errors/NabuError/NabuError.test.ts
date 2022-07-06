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
    const title = 'Unable to quote USDC-USD'
    const message =
      "We are having problems fetching a quote for USDC-USD, don't worry - we're on it"
    const icon: NabuErrorIconProps = {
      accessibility: {
        description: ''
      },
      status: {
        url: ''
      },
      url: 'https://blockchain.com/asset/quote/usd-usdc.png'
    }

    const error = new NabuError({
      icon,
      message,
      title
    })

    expect(error.title).toEqual(title)
    expect(error.message).toEqual(message)
    expect(error.icon).toEqual(icon)
  })

  it('Should remove empty actions', () => {
    const error = new NabuError({
      actions: [
        {
          title: '',
          type: 'LAUNCH',
          url: ''
        },
        {
          title: 'Blockchain',
          type: 'LAUNCH',
          url: 'https://blockchain.com'
        }
      ],
      message: 'Message',
      title: 'Title'
    })

    const actions = error.actions ?? []

    expect(error.actions?.length).toEqual(1)
    expect(actions[0].title).toEqual('Blockchain')
  })
})
