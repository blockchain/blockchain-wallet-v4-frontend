
import { START_UP} from './actionTypes'
import {storeOptions} from './actions'
import { takeEvery} from 'redux-saga'
import { put, select } from 'redux-saga/effects'
import * as random from 'crypto'
import { path } from 'ramda'
import {rootOptions} from './selectors'
import Long from 'long'


var ec = require('bcoin/lib/crypto/secp256k1-browser')

export const LNRootSagas = () => {
  let INITIAL_OPTIONS = {
    chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
    dustLimitSatoshis: Long.fromNumber(546),
    maxHtlcValueInFlightMsat: Long.fromNumber(100000),
    channelReserveSatoshis: Long.fromNumber(1000),
    feeRatePerKw: 10000,
    htlcMinimumMsat: 1,
    toSelfDelay: 60,
    maxAcceptedHtlcs: 100,
    minimumDepth: 1
  }
  const startUp = function * (action) {
    let options = yield select(rootOptions)
    if (options !== undefined) {
      return
    }
    options = INITIAL_OPTIONS
    let staticLocal = {}
    staticLocal.priv = random.randomBytes(32)
    staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)
    options.staticLocal = staticLocal

    yield put(storeOptions(options))
  }

  const takeSagas = function * () {
    yield takeEvery(START_UP, startUp)
  }

  return {
    takeSagas,
    startUp
  }
}
