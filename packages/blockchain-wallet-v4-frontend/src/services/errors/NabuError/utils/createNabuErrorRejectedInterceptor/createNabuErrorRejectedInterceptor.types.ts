import { AxiosResponse } from 'axios'

import NabuError from '../../NabuError'

type AxiosErrorResponse = Error & { response: AxiosResponse<any> }

type CreateNabuErrorRejectedInterceptorUtility = () => (
  error: AxiosErrorResponse
) => Promise<AxiosErrorResponse | NabuError>

export type { AxiosErrorResponse, CreateNabuErrorRejectedInterceptorUtility }
