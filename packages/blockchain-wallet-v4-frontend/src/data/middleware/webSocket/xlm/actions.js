import * as AT from './actionTypes'

export const startStreams = () => ({ type: AT.START_STREAMS })
export const stopStreams = () => ({ type: AT.STOP_STREAMS })

export const onStreamMessage = (accountId, tx) => ({
  payload: { accountId, tx },
  type: AT.STREAM_MESSAGE
})
export const onStreamError = (accountId, error) => ({
  payload: { accountId, error },
  type: AT.STREAM_ERROR
})
