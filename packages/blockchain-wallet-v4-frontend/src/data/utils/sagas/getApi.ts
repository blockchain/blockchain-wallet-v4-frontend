import { getContext } from 'typed-redux-saga'

import { APIType } from '@core/network/api'

export const getApi = function* () {
  return yield* getContext<APIType>('api')
}
