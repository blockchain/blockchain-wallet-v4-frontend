import { compose, head, indexBy, keys, map, prop } from 'ramda'
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
  return store => next => action => {
    const { type, payload } = action

    if (type === actionTypes.middleware.webSocket.xlm.START_STREAMS) {
      streamingService.open(
        compose(
          store.dispatch,
          actions.middleware.webSocket.xlm.onStreamMessage
        ),
        compose(
          store.dispatch,
          actions.middleware.webSocket.xlm.onStreamError
        )
      )
    }
    if (type === actionTypes.core.data.xlm.FETCH_DATA_SUCCESS) {
      const accountIds = keys(payload.data)
      Promise.all(map(addCursor, accountIds))
        .then(indexBy(prop('id')))
        .then(streamingService.updateStreams)
        .catch(error =>
          actions.logs.logErrorMessage(
            logLocation,
            'streamingMiddleware',
            prop('message', error)
          )
        )
    }

    if (type === actionTypes.middleware.webSocket.xlm.STOP_STREAMS) {
      streamingService.close()
    }

    return next(action)
  }
}

export default streamingMiddleware
