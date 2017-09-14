'use strict'

var EventEmitter = require('events').EventEmitter
var bcoin = require('bcoin/lib/bcoin-browser')
var utils = require('bcoin/lib/utils/util')
var assert = require('assert')
var constants = bcoin.constants
var wire = require('./wire')

function Parser (options) {
  if (!(this instanceof Parser)) { return new Parser(options) }

  if (!options) { options = {} }

  EventEmitter.call(this)

  this.network = bcoin.network.get(options.network)
  console.info('parser setup network ', this.network)

  this.pending = []
  this.total = 0
  this.waiting = 12
  this.cmd = -1

  this._init()
}

utils.inherits(Parser, EventEmitter)

Parser.prototype._init = function _init (str) {
  ;
}

Parser.prototype._error = function _error (str) {
  this.emit('error', new Error(str))
}

Parser.prototype.feed = function feed (data) {
  var chunk, off, len

  this.total += data.length
  this.pending.push(data)

  while (this.total >= this.waiting) {
    chunk = new Buffer(this.waiting)
    off = 0
    len = 0

    while (off < chunk.length) {
      len = this.pending[0].copy(chunk, off)
      if (len === this.pending[0].length) { this.pending.shift() } else { this.pending[0] = this.pending[0].slice(len) }
      off += len
    }

    assert.equal(off, chunk.length)

    this.total -= chunk.length
    this.parse(chunk)
  }
}

Parser.prototype.parse = function parse (chunk) {
  var payload

  if (chunk.length > constants.MAX_MESSAGE) {
    this.waiting = 12
    this.cmd = -1
    return this._error('Packet too large: %dmb.', utils.mb(chunk.length))
  }

  if (this.cmd === -1) {
    this.cmd = this.parseHeader(chunk)
    return
  }

  try {
    payload = this.parsePayload(this.cmd, chunk)
  } catch (e) {
    this.emit('error', e)
    this.waiting = 12
    this.cmd = -1
    return
  }

  this.emit('packet', payload)
  this.waiting = 12
  this.cmd = -1
}

Parser.prototype.parseHeader = function parseHeader (data) {
  var magic = data.readUInt32BE(0, true)
  var cmd = data.readUInt32BE(4, true)
  var size = data.readUInt32BE(8, true)

  if (magic !== this.network.magic) { return this._error('Invalid magic value: ' + magic.toString(16)) }

  if (size > constants.MAX_MESSAGE) {
    this.waiting = 12
    return this._error('Packet length too large: %dmb', utils.mb(size))
  }

  this.waiting = size

  return cmd
}

Parser.prototype.parsePayload = function parsePayload (cmd, data) {
  return wire.fromRaw(cmd, data)
}

module.exports = Parser
