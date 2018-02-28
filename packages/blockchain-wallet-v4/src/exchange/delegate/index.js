export class ExchangeDelegate {
  constructor (state) {
    this._trades = []
    this._debug = false
    this.labelBase = 'Exchange order'
    this._state = state
  }

  get state () {
    return this._state
  }

  get trades () {
    return this._trades
  }

  save () {
    return Promise.resolve() // CHEAT: save metadata in rootSaga
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
    // TODO: implement check address
  }

  getReceiveAddress (trade) {
    // TODO: getReceiveAddress
  }

  findLastExchangeIndex () {
    // TODO: implement findLastExchangeIndex
  }

  reserveReceiveAddress () {
    return {
      receiveAddress: this.state.dataPath.sfox.nextAddress,
      commit: (trade) => {}
    }
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
