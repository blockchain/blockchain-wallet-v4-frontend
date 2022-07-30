import { createNabuErrorAnalyticsInterceptor, NabuError } from 'services/errors'

describe('createNabuErrorAnalyticsInterceptor()', () => {
  it('Should not handle error that is not nabu', async () => {
    const dispatchSpy = jest.fn()
    const error = new Error()

    const interceptor = createNabuErrorAnalyticsInterceptor(dispatchSpy)

    const promise = interceptor(error)

    await expect(promise).rejects.toEqual(error)

    expect(dispatchSpy).not.toHaveBeenCalled()
  })

  it('Should push the nabu error to the analytics service', async () => {
    const dispatchSpy = jest.fn()
    const error = new NabuError({
      categories: ['TestCategory'],
      id: 'nabu_error_id',
      message: 'Message',
      title: 'Error title'
    })

    const interceptor = createNabuErrorAnalyticsInterceptor(dispatchSpy)

    const promise = interceptor(error)

    await expect(promise).rejects.toEqual(error)

    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        key: 'Client Error',
        properties: {
          category: ['TestCategory'],
          error: 'NABU_ERROR',
          id: error.id,
          network_error_description: error.message,
          network_error_type: 'NABU_ERROR',
          source: 'NABU',
          title: error.title
        }
      },
      type: 'trackEvent'
    })
  })
})
