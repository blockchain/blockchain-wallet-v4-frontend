import { Dispatch } from 'redux'

export type CreateNabuErrorAnalyticsInterceptorUtility = (
  dispatch: Dispatch
) => (error: Error) => Promise<Error>
