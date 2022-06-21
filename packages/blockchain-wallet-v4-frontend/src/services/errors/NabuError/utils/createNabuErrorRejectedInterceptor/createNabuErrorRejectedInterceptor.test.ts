import { AxiosResponse } from 'axios'

import NabuError from '../../NabuError'
import createNabuErrorRejectedInterceptor from './createNabuErrorRejectedInterceptor'
import { AxiosErrorResponse } from './createNabuErrorRejectedInterceptor.types'

describe('#createNabuErrorRejectedInterceptor()', () => {
  const rejectedInterceptor = createNabuErrorRejectedInterceptor()

  it('Should return the error then there is no nabu UX attribute', async () => {
    const axiosResponse = {
      data: {
        id: '1'
      }
    } as AxiosResponse<any>

    const error: AxiosErrorResponse = {
      ...new Error(),
      ...{ response: axiosResponse }
    }

    await expect(rejectedInterceptor(error)).rejects.toEqual(error)
  })

  it('Should intercept the nabu error UX and throw the NabuError', async () => {
    const axiosResponse = {
      data: {
        ux: {
          message: 'Error message',
          title: 'Error title'
        }
      }
    } as AxiosResponse<any>

    const error: AxiosErrorResponse = {
      ...new Error(),
      ...{ response: axiosResponse }
    }

    const nabuError = new NabuError({
      message: 'Error message',
      title: 'Error title'
    })

    await expect(rejectedInterceptor(error)).rejects.toEqual(nabuError)
  })

  it('Should not handle the error if response is not present in error', async () => {
    const error = new Error('Some error') as AxiosErrorResponse

    await expect(rejectedInterceptor(error)).rejects.toEqual(error)
  })
})
