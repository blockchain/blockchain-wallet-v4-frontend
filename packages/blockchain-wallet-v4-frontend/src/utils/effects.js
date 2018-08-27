import axios from 'axios'
import { call, cancelled } from 'redux-saga/effects'

/**
 * Cancels running API request
 * when hosting saga is cancelled
 *
 * NB: API request has to be using axios
 */
export const callLatest = function*(apiCall, options) {
  const source = axios.CancelToken.source()
  try {
    return yield call(apiCall, options, source.token)
  } finally {
    if (yield cancelled()) {
      source.cancel()
    }
  }
}
