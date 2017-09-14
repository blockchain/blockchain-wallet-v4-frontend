'use strict'

import TCP from 'blockchain-wallet-v4/src/ln/TCP'
import { sha256 } from '../WalletCrypto/index'

var EventEmitter = require('events').EventEmitter
var bcoin = require('bcoin/lib/bcoin-browser')
var ec = require('bcoin/lib/crypto/secp256k1-browser')
var utils = require('bcoin/lib/utils/util')
var crypto = require('bcoin/lib/crypto')
var hkdf = require('bcoin/lib/crypto/hkdf')
var assert = require('assert')
var AEAD = require('bcoin/lib/crypto/aead')

/**
 * Lightning Connection
 * @constructor
 */
const handshakeVersion = Buffer.from('00', 'hex')

function Connection (staticLocal, staticRemote) {
  if (!(this instanceof Connection)) { return new Connection() }

  EventEmitter.call(this)

  this.staticLocal = staticLocal
  this.staticRemote = staticRemote

  // Handshake data
  this.tempLocal = {}
  this.tempRemote = {}

  this.ck = null
  this.h = null
  this.temp_k1 = null
  this.temp_k2 = null
  this.temp_k3 = null
  this.e = null
  this.s = null

  // Key for sending and receiving
  this.sk = null
  this.rk = null

  // Nonces for sending and receiving
  this.rn = 0
  this.sn = 0

  this.authed = false
  this.local = null
  this.remote = null
  this.viaPBX = false
  this.pbxIncoming = null
  this.pbxOutgoing = null
  this.version = 0
  this.socket = null

  this.readQueue = []
  this.readCallback = null
  this.pending = []
  this.total = 0
  this.waiting = 2
  this.hasSize = false
}

utils.inherits(Connection, EventEmitter)

Connection.prototype.error = function error (err) {
  this.emit('error', new Error(err))
}

Connection.prototype.connect = function connect () {
  var self = this

  let onConnect = () => {
    self._onConnect()
  }

  let onClose = () => {
    self.emit('error', 'Connection closed')
  }

  let onData = (data) => {
    self.feed(data)
  }

  let t = new TCP()
  t.connectToMaster(() => {
    t.connectToNode(
      '127.0.0.1:8080',
      () => {
        console.info(t)
        t.connectToNode(this.staticRemote.pub.toString('base64'), onConnect, onData, onClose)
      },
      (data) => console.info('msg ', data),
      () => console.info('closed')
    )
  })
  this.conn = t
}

Connection.prototype._onConnect = function _onConnect () {
  this.sendHandshakePart1()

  this.readRaw(50, (data) => {
    this.readHandshakePart2(data)
    this.sendHandshakePart3()

    this.write(Buffer.alloc(100))
  })
}

Connection.prototype.sendHandshakePart1 = function () {
  console.debug('sendHandshakePart1')

  this.tempLocal.priv = ec.generatePrivateKey()
  this.tempLocal.pub = ec.publicKeyCreate(this.tempLocal.priv, true)

  this.h = crypto.sha256('Noise_XK_secp256k1_ChaChaPoly_SHA256')
  this.ck = this.h
  this._appendToHash(Buffer.from('lightning', 'ascii'))
  this._appendToHash(this.staticRemote.pub)
  this._appendToHash(this.tempLocal.pub)

  var ss = crypto.sha256(ec.ecdh(this.staticRemote.pub, this.tempLocal.priv))

  console.debug('ss = 0x' + ss.toString('hex'))
  console.debug('ck = 0x' + this.ck.toString('hex'))

  let hkdfResult = hkdfDerive(this.ck, ss)
  this.ck = hkdfResult.p1
  this.temp_k1 = hkdfResult.p2

  var c = encryptAEAD(this.temp_k1, this.h)
  console.info('c = 0x' + c.toString('hex'))

  this._appendToHash(c)

  var packet = Buffer.concat([handshakeVersion, this.tempLocal.pub, c])

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
  let ss = crypto.sha256(ec.ecdh(this.tempRemote.pub, this.tempLocal.priv))

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

  let ss = crypto.sha256(ec.ecdh(this.tempRemote.pub, this.staticLocal.priv))

  let hkdfResult1 = hkdfDerive(this.ck, ss)
  this.ck = hkdfResult1.p1
  this.temp_k3 = hkdfResult1.p2

  let t = encryptAEAD(this.temp_k3, this.h)

  console.debug('c = 0x' + c.toString('hex'))
  console.debug('ss = 0x' + ss.toString('hex'))
  console.debug('ck = 0x' + this.ck.toString('hex'))
  console.debug('temp_k3 = 0x' + this.temp_k3.toString('hex'))

  let hkdfResult2 = hkdfDerive(this.ck, Buffer.allocUnsafe(0))
  this.rk = hkdfResult2.p1
  this.sk = hkdfResult2.p2

  this.rn = 0
  this.sn = 0
  this.authed = true

  var packet = Buffer.concat([handshakeVersion, c, t])

  this.writeRaw(packet)
}

Connection.prototype._appendToHash = function _appendToHash (data) {
  let v = [this.h, data]
  this.h = crypto.sha256(Buffer.concat(v))
}

const hkdfDerive = function (salt, key) {
  const temp = hkdf.extract(key, salt, 'sha256')
  const hkdfResult = hkdf.expand(temp, Buffer.allocUnsafe(0), 64, 'sha256')
  const ck = hkdfResult.slice(0, 32)
  const tempK = hkdfResult.slice(32, 64)

  console.info(`hkdf derive call (${key.toString('hex')}, ${salt.toString('hex')})
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

  console.info(`encryptAEAD 
  (${key.toString('hex')}, ${ad.toString('hex')}, ${iv.toString('hex')}, ${data.toString('hex')})
        = (${tag.toString('hex')}, ${tempData.toString('hex')})`)

  return result
}

Connection.prototype.writeClear = function writeClear (payload) {
  var packet = Buffer.alloc(2 + payload.length)
  packet.writeUInt16BE(payload.length, 0, true)
  payload.copy(packet, 2)
  this.conn.sendToNode(this.staticRemote.pub, packet)
}

Connection.prototype.readClear = function readClear (size, callback) {
  this.readQueue.push(new QueuedRead(size, callback))
}

Connection.prototype.writeRaw = function writeRaw (data) {
  this.conn.sendToNode(this.staticRemote.pub, data)
}

Connection.prototype.readRaw = function readRaw (size, callback) {
  assert(!this.hasSize)
  this.waiting = size
  this.readCallback = callback
}

Connection.prototype.feed = function feed (data) {
  var chunk

  console.info('feed called with length ' + data.length + ' waiting: ' + this.waiting)

  this.total += data.length
  this.pending.push(data)

  while (this.total >= this.waiting) {
    chunk = this.read(this.waiting)
    this.parse(chunk)
  }
}

Connection.prototype.read = function read (size) {
  var pending, chunk, off, len

  assert(this.total >= size, 'Reading too much.')

  if (size === 0) { return Buffer.alloc(0) }

  pending = this.pending[0]

  if (pending.length > size) {
    chunk = pending.slice(0, size)
    this.pending[0] = pending.slice(size)
    this.total -= chunk.length
    return chunk
  }

  if (pending.length === size) {
    chunk = this.pending.shift()
    this.total -= chunk.length
    return chunk
  }

  chunk = Buffer.alloc(size)
  off = 0
  len = 0

  while (off < chunk.length) {
    pending = this.pending[0]
    len = pending.copy(chunk, off)
    if (len === pending.length) { this.pending.shift() } else { this.pending[0] = pending.slice(len) }
    off += len
  }

  assert.equal(off, chunk.length)

  this.total -= chunk.length

  return chunk
}

Connection.prototype.parse = function parse (data) {
  var size, payload, tag, item

  console.info('Received data: ' + data.toString('hex'))

  if (!this.authed) {
    if (this.readCallback) {
      this.hasSize = false
      this.waiting = 2
      item = this.readCallback
      this.readCallback = null
      item.call(this, data)
      return
    }

    if (!this.hasSize) {
      size = data.readUInt16BE(0, true)

      if (size < 12) {
        this.waiting = 2
        console.info('bad packet size')
        // this.emit('error', new Error('Bad packet size.'))
        return
      }

      this.hasSize = true
      this.waiting = size

      return
    }

    this.hasSize = false
    this.waiting = 2

    if (this.readQueue.length > 0) {
      item = this.readQueue.shift()
      if (item.size !== data.length) { return this.error('Bad packet size.') }
      item.callback.call(this, data)
      return
    }

    this.emit('data', data)

    return
  }

  if (!this.hasSize) {
    size = this.local.decryptSize(data)

    if (size < 2) {
      this.waiting = 2
      this.error('Bad packet size.')
      return
    }

    this.hasSize = true
    this.waiting = size

    return
  }

  payload = data.slice(0, this.waiting - 16)
  tag = data.slice(this.waiting - 16, this.waiting)

  this.hasSize = false
  this.waiting = 2

  // Authenticate payload before decrypting.
  // This ensures the cipher state isn't altered
  // if the payload integrity has been compromised.
  this.local.auth(payload)
  this.local.finish()

  if (!this.local.verify(tag)) {
    this.local.sequence()
    this.error('Bad tag.')
    return
  }

  this.local.decrypt(payload)
  this.local.sequence()

  this.emit('data', payload)
}

Connection.prototype.encryptOut = function (payload) {
  let encrypted = encryptAEAD(this.sk, Buffer.alloc(0), this.sn, payload)
  this.sn++
  return encrypted
}

Connection.prototype.write = function (payload) {
  assert(payload.length < 65535)

  let size = Buffer.alloc(2)
  size.writeInt16BE(payload.length)

  let sizeEncrypted = this.encryptOut(size)
  let dataEncrypted = this.encryptOut(payload)

  this.writeRaw(Buffer.concat([sizeEncrypted, dataEncrypted]))
}

/*
 * Helpers
 */

function QueuedRead (size, callback) {
  this.size = size
  this.callback = callback
}

export default Connection
