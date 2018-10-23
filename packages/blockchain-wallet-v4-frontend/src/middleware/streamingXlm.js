import { compose, head, map, prop } from 'ramda'
import { actions, actionTypes, selectors } from 'data'

const streamingMiddleware = streamingService => store => {
  return next => action => {
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
      const state = store.getState()
      const defaultAccountId = selectors.core.kvStore.xlm
        .getDefaultAccountId(state)
        .getOrElse(null)
      const txCursor = head(selectors.core.data.xlm.getTransactions(state))
        .map(head)
        .map(prop('paging_token'))
        .getOrElse(null)
      const accounts = map(account => {
        if (account.id === defaultAccountId) return { ...account, txCursor }
        return account
      }, payload.data)
      streamingService.updateStreams(accounts)
    }

    if (type === actionTypes.middleware.webSocket.xlm.STOP_STREAMS) {
      streamingService.close()
    }

    return next(action)
  }
}

export default streamingMiddleware
