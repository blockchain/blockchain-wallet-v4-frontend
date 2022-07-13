import { AxiosResponse } from 'axios'

import NabuError from '../../NabuError'

type CreateNabuErrorFulfilledInterceptorUtility = () => (
  response: AxiosResponse<any>
) => AxiosResponse<any> | Promise<NabuError>

export type { CreateNabuErrorFulfilledInterceptorUtility }
