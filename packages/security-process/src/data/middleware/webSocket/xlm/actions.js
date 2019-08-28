import * as AT from './actionTypes'

export const startStreams = () => ({ type: AT.START_STREAMS })
export const stopStreams = () => ({ type: AT.STOP_STREAMS })

export const onStreamMessage = (accountId, tx) => ({
  type: AT.STREAM_MESSAGE,
  payload: { accountId, tx }
})
export const onStreamError = (accountId, error) => ({
  type: AT.STREAM_ERROR,
  payload: { accountId, error }
})
