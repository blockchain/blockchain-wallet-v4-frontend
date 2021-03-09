import {
  compose,
  head,
  indexBy,
  isNil,
  map,
  pathOr,
  prop,
  reject,
  unnest
} from 'ramda'

import { actions, actionTypes } from 'data'

const logLocation = 'middleware/streamingXlm'

const streamingMiddleware = (streamingService, api) => {
  const addCursor = publicKey =>
    api
      .getXlmTransactions({
        publicKey,
        limit: 1
      })
      .then(head)
      .then(prop('paging_token'))
      .then(txCursor => ({
        id: publicKey,
        txCursor
      }))
      .catch(() => ({
        id: publicKey
      }))
  const addStreams = accountIds =>
    Promise.all(map(addCursor, accountIds))
      .then(indexBy(prop('id')))
      .then(streamingService.addStreams)
      .catch(error =>
        actions.logs.logErrorMessage(
          logLocation,
          'streamingMiddleware',
          prop('message', error)
        )
      )
  return store => next => action => {
    const { payload, type } = action

    if (type === actionTypes.middleware.webSocket.xlm.START_STREAMS) {
      streamingService.open(
        compose(
          store.dispatch,
          actions.middleware.webSocket.xlm.onStreamMessage
        ),
        compose(store.dispatch, actions.middleware.webSocket.xlm.onStreamError)
      )
    }
    if (type === actionTypes.core.kvStore.xlm.FETCH_METADATA_XLM_SUCCESS) {
      const accountIds = compose(
        map(prop('publicKey')),
        pathOr([], ['value', 'accounts'])
      )(payload)
      addStreams(reject(isNil, accountIds))
    }
    if (
      type === actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS
    ) {
      const accountIds = compose(
        map(prop('publicKey')),
        unnest,
        map(pathOr([], ['xlm', 'accounts'])),
        pathOr([], ['value', 'devices'])
      )(payload)
      addStreams(reject(isNil, accountIds))
    }
    if (type === actionTypes.middleware.webSocket.xlm.STOP_STREAMS) {
      streamingService.close()
    }

    return next(action)
  }
}

export default streamingMiddleware
