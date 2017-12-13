import * as LN from 'blockchain-wallet-v4/src/ln/index'
import * as random from 'crypto'

import * as Long from 'long'

const ec = require('bcoin/lib/crypto/secp256k1-browser')

let options = {
  chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100
}

let staticLocal = {}
staticLocal.priv = random.randomBytes(32)
staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)

options.staticLocal = staticLocal

console.info('Starting! \nNode ID: ' + staticLocal.pub.toString('hex'))


LN.startUp(options)
