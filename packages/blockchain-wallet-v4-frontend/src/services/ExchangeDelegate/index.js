class ExchangeDelegate {
  constructor (state) {
    this._trades = []
    this._debug = false
    this.labelBase = 'Exchange order'
    this._state = state
  }

  get state () {
    return this._state
  }

  save () {
    // TODO: implement save
  }

  email () {
    // TODO: implement email
  }

  mobile () {
    // TODO: implement mobile
  }

  isEmailVerified () {
    // TODO: implement isEmailVerified
  }

  isMobileVerified () {
    // TODO: implement isMobileVerified
  }

  getToken (partner, options) {
    // TODO: implement getToken
  }

  monitorAddress (address, callback) {
    // TODO: monitor address
    console.log('Monitor address: ' + address)
  }

  checkAddress (address) {
    // TODO: implement chek address
  }

  getReceiveAddress (trade) {
    // TODO: getReceiveAddress
  }

  findLastExchangeIndex () {
    // TODO: implement findLastExchangeIndex
  }

  reserveReceiveAddress () {
    // TODO: define reservation and then remove eslint disable comments
    /* eslint-disable no-undef */
    return {
      _reservation: reservation,
      receiveAddress: reservation.receiveAddress,
      commit: (trade) => {
        /* istanbul ignore if */
        if (self.debug) {
          console.info('Set label for receive index', reservation.receiveIndex)
        }
        trade._account_index = account.index
        trade._receive_index = reservation.receiveIndex
        let id = trade.tradeSubscriptionId || trade.id
        let label = trade.tradeSubscriptionId ? 'Recurring Order' : self.labelBase
        reservation.commit(`${label} #${id}`)
      }
    }
    /* eslint-enable */
  }

  releaseReceiveAddress (trade) {
    // TODO: releaseReceiveAddress
  }

  serializeExtraFields (obj, trade) {
    obj.account_index = trade._account_index
    obj.receive_index = trade._receive_index
  }

  deserializeExtraFields (obj, trade) {
    trade._account_index = obj.account_index
    trade._receive_index = obj.receive_index
  }
}

module.exports = ExchangeDelegate
