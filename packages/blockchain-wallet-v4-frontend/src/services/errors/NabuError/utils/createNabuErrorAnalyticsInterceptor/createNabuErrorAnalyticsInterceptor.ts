import { actions } from 'data'
import { ClientErrorProperties } from 'data/analytics/types/errors'
import { Analytics } from 'data/types'

import { isNabuError } from '../isNabuError'
import { CreateNabuErrorAnalyticsInterceptorUtility } from './createNabuErrorAnalyticsInterceptor.types'

export const createNabuErrorAnalyticsInterceptor: CreateNabuErrorAnalyticsInterceptorUtility =
  (dispatch) => (error) => {
    if (isNabuError(error)) {
      const clientError: ClientErrorProperties = {
        category: error.categories,
        error: 'NABU_ERROR',
        id: error.id,
        network_error_description: error.message,
        network_error_type: 'NABU_ERROR',
        source: 'NABU',
        title: error.title
      }

      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.CLIENT_ERROR,
          properties: clientError
        })
      )
    }

    return Promise.reject(error)
  }
