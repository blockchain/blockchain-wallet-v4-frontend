import { AxiosResponse } from 'axios'

import NabuError from '../../NabuError'
import createNabuErrorFulfilledInterceptor from './createNabuErrorFulfilledInterceptor'

describe('#createNabuErrorFulfilledInterceptor()', () => {
  const fulfilledInterceptor = createNabuErrorFulfilledInterceptor()

  it('Should pass the response throw if there is no UX nabue error in the response', async () => {
    const axiosResponse = {
      data: {
        id: '1'
      }
    } as AxiosResponse<any>

    expect(await fulfilledInterceptor(axiosResponse)).toEqual(axiosResponse)
  })

  it('Should throw a NabuError with the UX paramters when it is present in the response', async () => {
    const axiosResponse = {
      data: {
        ux: {
          message: 'Error message',
          title: 'Error title'
        }
      }
    } as AxiosResponse<any>

    const nabuError = new NabuError({
      message: 'Error message',
      title: 'Error title'
    })

    await expect(fulfilledInterceptor(axiosResponse)).rejects.toEqual(nabuError)
  })
})
