import Bitcoin from 'bitcoinjs-lib'
import { path, prop } from 'ramda'

import { btc } from '../../redux/common/selectors'
import { getDefaultAccountIndex } from '../../redux/wallet/selectors'

export default class ExchangeDelegate {
  constructor (state, api, partner) {
    this._trades = []
    this._debug = false
    this.labelBase = 'Exchange order'
    this._state = state
    this._api = api
    this._partner = partner
  }

  get state () {
    return this._state
  }

  get trades () {
    return this._trades
  }

  get api () {
    return this._api
  }

  get partner () {
    return this._partner
  }

  save () {
    return Promise.resolve() // CHEAT: save metadata in rootSaga
  }

  email () {
    return this._state.settingsPath.map(prop('email')).getOrElse('')
  }

  mobile () {
    return this._state.settingsPath.map(prop('sms_number')).getOrElse('')
  }

  isEmailVerified () {
    return this._state.settingsPath.map(prop('email_verified')).getOrElse(0)
  }

  isMobileVerified () {
    return this._state.settingsPath.map(prop('sms_verified')).getOrElse(0)
  }

  getToken (partner, options) {
    options = options || {}

    const guid = this.state.walletPath.wallet.guid
    const sharedKey = this.state.walletPath.wallet.sharedKey

    let fields = {
      guid: guid,
      sharedKey: sharedKey,
      fields: `email${options.mobile ? '|mobile' : ''}${
        options.walletAge ? '|wallet_age' : ''
      }`
    }

    if (partner) {
      fields.partner = partner
    }

    return this.api.getTokenForDelegate(fields).then(function (res) {
      if (res.success) {
        return res.token
      } else {
        throw new Error('Unable to obtain email & mobile verification proof')
      }
    })
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
    const network = prop('walletOptionsPath', this.state)
      .map(path(['platforms', 'web', 'bitcoin', 'config', 'network']))
      .getOrElse('bitcoin')

    const defaultIndex = getDefaultAccountIndex(this.state)
    let receiveAddress = btc
      .getNextAvailableReceiveAddress(
        Bitcoin.networks[network],
        defaultIndex,
        this.state
      )
      .getOrElse()

    return {
      receiveAddress,
      commit: trade => {}
    }
  }

  releaseReceiveAddress (trade) {
    // console.log('delegate.releaseReceiveAddress', trade)
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

  toJSON () {
    return ''
  }
}
