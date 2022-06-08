import NabuError from '../../NabuError'
import { isNabuErrorInNetworkResponse } from '../isNabuErrorInNetworkResponse'
import { CreateNabuErrorFulfilledInterceptorUtility } from './createNabuErrorFulfilledInterceptor.types'

const createNabuErrorFulfilledInterceptor: CreateNabuErrorFulfilledInterceptorUtility =
  () => (response) => {
    try {
      const { data } = response

      if (isNabuErrorInNetworkResponse(data)) {
        const error = new NabuError(data.ux)

        return Promise.reject(error)
      }

      return response
    } catch (error) {
      return response
    }
  }

export default createNabuErrorFulfilledInterceptor
