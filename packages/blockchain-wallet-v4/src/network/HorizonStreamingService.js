import * as StellarSDK from 'stellar-sdk'
import { assoc, difference, dissoc, forEach, keys, prop } from 'ramda'

export default class HorizonStreamingService {
  constructor ({ url }) {
    this.server = new StellarSDK.Server(url)
  }

  streams = {}

  _subscribeToAccount = (accountId, cursor) => {
    let txBuilder = this.server.transactions().forAccount(accountId)
    if (cursor) txBuilder = txBuilder.cursor(cursor)
    const closeStream = txBuilder.stream({
      onmessage: this.onMessage.bind(null, accountId),
      onerror: this.onError.bind(null, accountId)
    })
    this.streams = assoc(accountId, closeStream, this.streams)
  }

  _unsubscribeFromAccount = accountId => {
    const closeStream = prop(accountId, this.streams)
    if (closeStream) {
      closeStream()
      this.streams = dissoc(accountId, this.streams)
    }
  }

  open (onMessage, onError) {
    this.onMessage = onMessage
    this.onError = onError
  }

  updateStreams (accounts) {
    const accountIds = keys(accounts)
    const currentAccountIds = keys(this.streams)
    const addedAccounts = difference(accountIds, currentAccountIds)
    const removedAccounts = difference(currentAccountIds, accountIds)

    forEach(
      id => this._subscribeToAccount(id, accounts[id].txCursor),
      addedAccounts
    )
    forEach(this._unsubscribeFromAccount, removedAccounts)
  }

  close () {
    forEach(this._unsubscribeFromAccount, keys(this.streams))
  }
}
