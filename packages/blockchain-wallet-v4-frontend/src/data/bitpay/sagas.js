import crypto from 'crypto'
import { put } from 'redux-saga/effects'

import { actions } from 'data'

export const logLocation = 'bitpay'

export const parsePaymentRequest = function * (rawPaymentRequest) {
  try {
    const rawBody = rawPaymentRequest.rawBody
    const headers = rawPaymentRequest.headers
    let paymentRequest

    if (!rawBody) {
      throw new Error('Parameter rawBody is required')
    }
    if (!headers) {
      throw new Error('Parameter headers is required')
    }

    try {
      paymentRequest = JSON.parse(rawBody)
    } catch (e) {
      throw new Error(`Unable to parse request - ${e}`)
    }

    if (!headers.digest) {
      throw new Error('Digest missing from response headers')
    }

    let digest = headers.digest.split('=')[1]
    let hash = crypto
      .createHash('sha256')
      .update(rawBody, 'utf8')
      .digest('hex')

    if (digest !== hash) {
      throw new Error(
        `Response body hash does not match digest header. Actual: ${hash} Expected: ${digest}`
      )
    }

    paymentRequest.hash = hash
    paymentRequest.headers = headers
    return paymentRequest
  } catch (e) {
    yield put(
      actions.logs.logErrorMessage(logLocation, 'parsePaymentRequest', e)
    )
  }
}
