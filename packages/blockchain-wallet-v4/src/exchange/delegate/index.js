import Bitcoin from 'bitcoinjs-lib'
import { path, prop } from 'ramda'

import { btc } from '../../redux/common/selectors'
import { getDefaultAccountIndex } from '../../redux/wallet/selectors'

export class ExchangeDelegate {
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
    const isProd = prop('walletOptionsPath', this.state)
      .map(path(['platforms', 'web', this.partner, 'config', 'production']))
      .getOrFail(`Missing ${this.partner} production flag in walletOptions`)

    let receiveAddress
    if (isProd) {
      const defaultIndex = getDefaultAccountIndex(this.state)
      receiveAddress = btc
        .getNextAvailableReceiveAddress(
          Bitcoin.networks.bitcoin.NETWORK_BITCOIN,
          defaultIndex,
          this.state
        )
        .getOrElse()
    } else {
      receiveAddress = '2N7FwMpgyXQA85SaVXumm3UZowq2VKChehP' // testnet address used on staging
    }

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

module.exports = ExchangeDelegate
