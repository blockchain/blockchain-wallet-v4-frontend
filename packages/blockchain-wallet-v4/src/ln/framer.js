'use strict'

var bcoin = require('bcoin/lib/bcoin-browser')
var utils = require('bcoin/lib/utils/util')
var assert = require('assert')

/**
 * Protocol packet framer
 * @exports Framer
 * @constructor
 * @param {Object} options
 */

function Framer (options) {
  if (!(this instanceof Framer)) { return new Framer(options) }

  if (!options) { options = {} }

  this.options = options

  this.network = options.network
}

/**
 * Frame a payload with a header.
 * @param {String} cmd - Packet type.
 * @param {Buffer} payload
 * @returns {Buffer} Payload with header prepended.
 */

Framer.prototype.packet = function packet (cmd, payload) {
  var packet

  assert(payload, 'No payload.')

  packet = new Buffer(12 + payload.length)
  packet.writeUInt32BE(this.network.magic, 0, true)
  packet.writeUInt32BE(cmd, 4, true)
  packet.writeUInt32BE(payload.length, 8, true)
  payload.copy(packet, 12)

  return packet
}

module.exports = Framer
