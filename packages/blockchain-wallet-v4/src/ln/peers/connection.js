'use strict'
import {List} from 'immutable'
import {getSerializer} from '../messages/parser'
import {wrapHex} from '../helper'
import * as random from 'crypto'
import * as Message from '../messages/serializer'
import * as Parse from '../messages/parser'

let ec = require('bcoin/lib/crypto/secp256k1-browser')
let crypto = require('bcoin/lib/crypto')
let hkdf = require('bcoin/lib/crypto/hkdf')
let assert = require('assert')
let AEAD = require('../crypto/aead')
const elliptic = require('elliptic')
const secp256k1 = elliptic.ec('secp256k1')

/**
 * Lightning Connection
 * @constructor
 */
const handshakeVersion = wrapHex('00')

function Connection (options, staticRemote) {
  if (!(this instanceof Connection)) { return new Connection() }

  this.staticLocal = options.staticLocal
  this.staticRemote = staticRemote

  // Features that peer supports
  this.gfRemote = []
  this.lfRemote = []


    // Handshake data
  this.tempLocal = {}
  this.tempRemote = {}
  this.tempLocal.priv = random.randomBytes(32)
  this.tempLocal.pub = ec.publicKeyCreate(this.tempLocal.priv, true)

  this.ck = null
  this.h = null
  this.temp_k1 = null
  this.temp_k2 = null
  this.temp_k3 = null
  this.e = null
  this.s = null

  // Queue for handshake
  this.readQueue = []
  this.readCallback = null
  this.pending = []
  this.total = 0
  this.waiting = 2

  // Key for sending and receiving
  this.authed = false
  this.sk = null
  this.rk = null

  // Nonces for sending and receiving
  this.rn = 0
  this.sn = 0

  this.hasSize = false
  this.sizeBuffer = Buffer.alloc(0)
  this.size = 0
  this.dataBuffer = Buffer.alloc(0)

  // Callback functions
  this.onHandshakeCb = null
  this.onCloseCb = null
}

Connection.prototype.error = function error (err) {
  console.error(err)
  throw err
}

Connection.prototype.connectPromise = function connectPromise (tcp) {
  return new Promise((resolve, reject) => {
    this.connect(tcp, resolve, reject)
  })
}

Connection.prototype.connect = function connect (tcp, onHandshakeCb, onCloseCb) {
  this.tcp = tcp

  this.onHandshakeCb = onHandshakeCb
  this.onCloseCb = onCloseCb

  let onConnect = () => {
    this.sendHandshakePart1()
  }

  let onClose = () => {
    // clean up
    this.authed = false
    onCloseCb()
  }

  tcp.connectToNode(this.staticRemote.pub.toString('hex'), onConnect, () => {}, onClose)

  this.tcp = tcp
}

Connection.prototype.sendHandshakePart1 = function () {
  console.debug('sendHandshakePart1')

  this.h = crypto.sha256(Buffer.from('Noise_XK_secp256k1_ChaChaPoly_SHA256', 'ascii'))
  this.ck = this.h
  this._appendToHash(Buffer.from('lightning', 'ascii'))
  this._appendToHash(this.staticRemote.pub)
  this._appendToHash(this.tempLocal.pub)

  let ss = ecdh(this.staticRemote.pub, this.tempLocal.priv)

  console.debug('ss = 0x' + ss.toString('hex'))
  console.debug('ck = 0x' + this.ck.toString('hex'))

  let hkdfResult = hkdfDerive(this.ck, ss)
  this.ck = hkdfResult.p1
  this.temp_k1 = hkdfResult.p2

  let c = encryptAEAD(this.temp_k1, this.h)
  console.debug('c = 0x' + c.toString('hex'))

  this._appendToHash(c)
  let packet = Buffer.concat([handshakeVersion, this.tempLocal.pub, c])
  this.writeRaw(packet)
}

Connection.prototype.readHandshakePart2 = function (data) {
  console.debug('readHandshakePart2')

  let version = data.readInt8(0)
  if (version !== handshakeVersion.readInt8(0)) {
    return this.error('Unexpected authentication version')
  }

  this.tempRemote.pub = data.slice(1, 34)
  let c = data.slice(34, 50)

  this._appendToHash(this.tempRemote.pub)
  let ss = ecdh(this.tempRemote.pub, this.tempLocal.priv)

  let hkdfResult = hkdfDerive(this.ck, ss)
  this.ck = hkdfResult.p1
  this.temp_k2 = hkdfResult.p2

  console.debug('c = 0x' + c.toString('hex'))
  console.debug('ss = 0x' + ss.toString('hex'))
  console.debug('ck = 0x' + this.ck.toString('hex'))
  console.debug('temp_k2 = 0x' + this.temp_k2.toString('hex'))

  let p = encryptAEAD(this.temp_k2, this.h)

  console.debug('p = 0x' + p.toString('hex'))

  if (Buffer.compare(c, p) !== 0) {
    return this.error('MAC check failed')
  }

  this._appendToHash(c)
}

Connection.prototype.sendHandshakePart3 = function () {
  console.debug('sendHandshakePart3')

  let c = encryptAEAD(this.temp_k2, this.h, 1, this.staticLocal.pub)
  this._appendToHash(c)

  let ss = ecdh(this.tempRemote.pub, this.staticLocal.priv)

  let hkdfResult1 = hkdfDerive(this.ck, ss)
  this.ck = hkdfResult1.p1
  this.temp_k3 = hkdfResult1.p2

  let t = encryptAEAD(this.temp_k3, this.h)

  console.debug('c = 0x' + c.toString('hex'))
  console.debug('ss = 0x' + ss.toString('hex'))
  console.debug('ck = 0x' + this.ck.toString('hex'))
  console.debug('temp_k3 = 0x' + this.temp_k3.toString('hex'))

  let hkdfResult2 = hkdfDerive(this.ck, Buffer.allocUnsafe(0))
  this.sk = hkdfResult2.p1
  this.rk = hkdfResult2.p2

  this.rn = 0
  this.sn = 0
  this.authed = true

  let packet = Buffer.concat([handshakeVersion, c, t])

  this.writeRaw(packet)
}

Connection.prototype._appendToHash = function _appendToHash (data) {
  let v = [this.h, data]
  this.h = crypto.sha256(Buffer.concat(v))
}

const ecdh = function (pub, priv) {
  priv = secp256k1.keyPair({ priv: priv })
  pub = secp256k1.keyPair({ pub: pub })
  let dh = Buffer.from(pub.getPublic().mul(priv.getPrivate()).encode('array', true))
  return crypto.sha256(dh)
}

const hkdfDerive = function (salt, key) {
  const temp = hkdf.extract(key, salt, 'sha256')
  const hkdfResult = hkdf.expand(temp, Buffer.allocUnsafe(0), 64, 'sha256')
  const ck = hkdfResult.slice(0, 32)
  const tempK = hkdfResult.slice(32, 64)

  console.debug(`hkdf derive call (${key.toString('hex')}, ${salt.toString('hex')})
   = (${ck.toString('hex')}, ${tempK.toString('hex')})`)

  return { p1: ck, p2: tempK }
}

const encryptAEAD = function (key, ad, nonce = 0, data = Buffer.allocUnsafe(0)) {
  let tempData = Buffer.from(data)
  let tempAEAD = new AEAD()

  let iv = Buffer.allocUnsafe(12)
  iv.fill(0)
  iv.writeUIntLE(nonce, 4, 8, false)

  tempAEAD.init(key, iv)

  tempAEAD.aad(ad)
  tempAEAD.encrypt(tempData)

  let tag = tempAEAD.finish()

  let result = Buffer.concat([tempData, tag])

  console.debug(`encryptAEAD
    (${key.toString('hex')}, ${ad.toString('hex')}, ${iv.toString('hex')}, ${data.toString('hex')})
       = (${tempData.toString('hex')}, ${tag.toString('hex')}) = (${result.toString('hex')})`)

  return result
}

const decryptAEAD = function (key, ad, nonce, data, tag) {
  let tempData = Buffer.from(data)
  let tempAEAD = new AEAD()

  let iv = Buffer.allocUnsafe(12)
  iv.fill(0)
  iv.writeUIntLE(nonce, 4, 8, false)

  tempAEAD.init(key, iv)

  tempAEAD.aad(ad)
  tempAEAD.auth(tempData)

  let hmac = tempAEAD.finish()
  let result = Buffer.compare(hmac, tag)
  let decrypted = tempAEAD.decrypt(data)

  console.debug(`decryptAEAD
    (${key.toString('hex')}, ${ad.toString('hex')}, ${iv.toString('hex')}, ${data.toString('hex')}, ${tag.toString('hex')})
       = (${result}, ${decrypted.toString('hex')})`)

  if (result !== 0) {
    throw new Error('HMAC not correct')
  }

  return decrypted
}

Connection.prototype.newData = function newData (data) {
  try {
    return this.feed(data)
  } catch (e) {
    console.info('Connection closed', e)
    this.authed = false
    this.onCloseCb()
  }
}

Connection.prototype.feed = function feed (data) {
  if (!this.authed) {
    if (data.length !== 50) {
      console.error('Invalid handshake length')
      // TODO close and error
      return
    }

    this.readHandshakePart2(data)
    this.sendHandshakePart3()
    console.info('Handshake completed with ' + this.staticRemote.pub.toString('hex'))
    this.write(Parse.writeMessage(new Message.Init(Buffer.alloc(0), wrapHex('08'))))
    this.onHandshakeCb()
    return
  }

  // Not sure how to handle corrupted bytes - for now we just fail the connection completely
  this.dataBuffer = Buffer.concat([this.dataBuffer, data])

  // TODO try catch block to fail connection on corrupted bytes
  if (!this.hasSize && this.dataBuffer.length < 18) {
    return
  }

    // The handshake is already complete - retrieve the size and the payload
  if (!this.hasSize) {
    let sizeBuffer = this.dataBuffer.slice(0, 2)
    let sizeTag = this.dataBuffer.slice(2, 18)

    sizeBuffer = this.decryptIn(sizeBuffer, sizeTag)
    this.size = sizeBuffer.readInt16BE(0)
    this.hasSize = true

    this.dataBuffer = this.dataBuffer.slice(18)
  }

  if (this.dataBuffer.length < (this.size + 16)) {
    return
  }

  let encryptedData = this.dataBuffer.slice(0, this.size)
  let encryptedTag = this.dataBuffer.slice(this.size, this.size + 16)

  let decryptedData = this.decryptIn(encryptedData, encryptedTag)

    // Re-initialise our fields after completely retrieving a full message
  this.dataBuffer = this.dataBuffer.slice(this.size + 16)
  this.size = 0
  this.hasSize = false

  console.debug('[<-] ' + decryptedData.toString('hex'))
  return decryptedData
}

Connection.prototype.encryptOut = function (payload) {
  let encrypted = encryptAEAD(this.sk, Buffer.alloc(0), this.sn, payload)
  this.sn++

  if (this.sn % 1000 === 0) {
    let hkdf = hkdfDerive(this.ck, this.sk)
    this.ck = hkdf.p1
    this.sk = hkdf.p2
    this.sn = 0
  }

  return encrypted
}

Connection.prototype.decryptIn = function (payload, tag) {
  let decrypted = decryptAEAD(this.rk, Buffer.alloc(0), this.rn, payload, tag)
  this.rn++

  if (this.rn % 1000 === 0) {
    let hkdf = hkdfDerive(this.ck, this.rk)
    this.ck = hkdf.p1
    this.rk = hkdf.p2
    this.rn = 0
  }

  return decrypted
}

Connection.prototype.write = function (payload) {
  console.debug('[->] ' + payload.toString('hex'))
  assert(payload.length < 65535)

  let size = Buffer.alloc(2)
  size.writeInt16BE(payload.length)

  let sizeEncrypted = this.encryptOut(size)
  let dataEncrypted = this.encryptOut(payload)

  this.writeRaw(Buffer.concat([sizeEncrypted, dataEncrypted]))
}

Connection.prototype.writeRaw = function writeRaw (data) {
  this.tcp.sendToNode(this.staticRemote.pub, data)
}

let sendOutAllMessages = function (state) {
  // We go through every channel in our state and check if we have a proper connection
  // If we do, we send the message and remove the entry in the channel
  // TODO what do we do when it's not connected? Discard or keep?

  state.get('channels').forEach(c => c.get('messageOut').forEach(m => {
    let staticRemote = c.get('staticRemote').pub
    let conn = state.getIn(['connections', staticRemote, 'conn'])
    if (conn !== undefined) {
      let msg = getSerializer(m)(m)
      conn.write(msg.buffer)
    } else {
      console.info('Discard message: ')
      console.info(m)
    }
  }))

  return state.update('channels',
    c => {
      return c.map(m => {
        return m.set('messageOut', List())
      })
    })
}

export {Connection, sendOutAllMessages}
