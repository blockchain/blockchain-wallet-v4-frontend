export class ExchangeDelegate {
  constructor (state, token) {
    this._trades = []
    this._debug = false
    this.labelBase = 'Exchange order'
    this._state = state
    this._token = token
  }

  get state () {
    return this._state
  }

  get trades () {
    return this._trades
  }

  get token () {
    return this._token
  }

  set token (token) {
    this._token = token
  }

  save () {
    return Promise.resolve() // CHEAT: save metadata in rootSaga
  }

  email () {
    return this._state.settingsPath.data.email
  }

  mobile () {
    return this._state.settingsPath.data.sms_number
  }

  isEmailVerified () {
    return this._state.settingsPath.data.email_verified
  }

  isMobileVerified () {
    return this._state.settingsPath.data.sms_verified
  }

  getToken (partner, options) {
    // token is previously set by sfox signup saga
    return this.token
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
