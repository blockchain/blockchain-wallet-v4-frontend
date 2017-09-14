'use strict'

import Connection from 'blockchain-wallet-v4/src/ln/connection'

var EventEmitter = require('events').EventEmitter
var bcoin = require('bcoin/lib/bcoin-browser')
var utils = require('bcoin/lib/utils')
var Parser = require('./parser')
var Framer = require('./framer')

function Peer (staticLocal, staticRemote, network) {
  var self = this
  EventEmitter.call(this)

  this.network = network || bcoin.network.get()
  this.conn = new Connection(staticLocal, staticRemote)
  this.parser = new Parser({network: 'testnet'})
  this.framer = new Framer({network: 'testnet'})

  this.conn.on('connect', function () {
    self.emit('connect')
  })

  this.conn.on('data', function (data) {
    self.parser.feed(data)
  })

  this.conn.on('error', function (err) {
    self.emit('error', err)
  })

  this.parser.on('packet', function (msg) {
    self.emit('packet', msg)
  })
}

// utils.inherits(Peer, EventEmitter)

Peer.prototype.connect = function connect () {
  this.conn.connect()
}

Peer.prototype.send = function send (msg) {
  return this.write(msg.cmd, msg.toRaw())
}

Peer.prototype.frame = function frame (cmd, payload) {
  return this.framer.packet(cmd, payload)
}

Peer.prototype.write = function write (cmd, payload) {
  return this.conn.write(this.frame(cmd, payload))
}

export default Peer
