import NabuError from '../../NabuError'
import { isNabuErrorInNetworkResponse } from '../isNabuErrorInNetworkResponse'
import { CreateNabuErrorFulfilledInterceptorUtility } from './createNabuErrorFulfilledInterceptor.types'

const createNabuErrorFulfilledInterceptor: CreateNabuErrorFulfilledInterceptorUtility =
  () => (response) => {
    try {
      const data = response?.data

      if (!!data && isNabuErrorInNetworkResponse(data)) {
        const { ux, ...dataFields } = data

        const error = new NabuError({ ...ux, dataFields })

        return Promise.reject(error)
      }

      return response
    } catch (error) {
      return response
    }
  }

export default createNabuErrorFulfilledInterceptor
