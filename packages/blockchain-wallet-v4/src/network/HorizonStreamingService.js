import { assoc, difference, dissoc, forEach, isEmpty, keys, prop } from 'ramda'
import * as StellarSDK from 'stellar-sdk'

// refetch transactions / attempt stream reconnect every 6 minutes
export const RECONNECT_TIMEOUT = 360000

export default class HorizonStreamingService {
  constructor({ url }) {
    this.server = new StellarSDK.Server(url)
  }

  streams = {}

  _subscribeToAccount = (accountId, cursor) => {
    let txBuilder = this.server.transactions().forAccount(accountId)
    if (cursor) txBuilder = txBuilder.cursor(cursor)
    const closeStream = txBuilder.stream({
      onerror: (e) => {
        // if we fail to subscribe to account, it probably doesnt exist, just kill the
        // subscription to avoid unnecessary calls and polluting logs
        if (e.type === 'error') {
          return this.close()
        }
        return this.onError.bind(null, accountId)
      },
      onmessage: () => this.onMessage.bind(null, accountId),
      reconnectTimeout: RECONNECT_TIMEOUT,
    })
    this.streams = assoc(accountId, closeStream, this.streams)
  }

  _unsubscribeFromAccount = (accountId) => {
    const closeStream = prop(accountId, this.streams)
    if (closeStream) {
      closeStream()
      this.streams = dissoc(accountId, this.streams)
    }
  }

  open(onMessage, onError) {
    this.onMessage = onMessage
    this.onError = onError
  }

  addStreams = (accounts) => {
    const accountIds = keys(accounts)
    const currentAccountIds = keys(this.streams)
    const addedAccounts = difference(accountIds, currentAccountIds)
    if (isEmpty(addedAccounts)) return

    forEach((id) => this._subscribeToAccount(id, accounts[id].txCursor), addedAccounts)
  }

  close() {
    forEach(this._unsubscribeFromAccount, keys(this.streams))
  }
}
