'use strict'

var utils = require('bcoin/lib/utils/util')
var crypto = require('bcoin/lib/crypto/crypto')
var bcoin = require('bcoin/lib/bcoin-browser')
var constants = bcoin.constants

/*
 * Constants
 */

var maxIndex = 281474976710654 // 2^48 - 2
var maxHeight = 47

/**
 * Elkrem Sender
 */

function ElkremSender (root) {
  this.root = root
}

ElkremSender.prototype.getIndex = function getIndex (w) {
  return descend(w, maxIndex, maxHeight, this.root)
}

/**
 * Elkrem Receiver
 */

function ElkremReceiver (stack) {
  this.stack = stack || []
}

ElkremReceiver.prototype.addNext = function addNext (hash) {
  var node = new ElkremNode(hash)
  var t = this.stack.length - 1
  var left, right

  if (t >= 0) { node.i = this.stack[t].i + 1 }

  if (t > 0 && this.stack[t - 1].h === this.stack[t].h) {
    node.h = this.stack[t].h + 1

    left = leftHash(hash)
    right = rightHash(hash)

    if (!utils.equal(this.stack[t - 1].hash, left)) { throw new Error('Left child does not match.') }

    if (!utils.equal(this.stack[t].hash, right)) { throw new Error('Right child does not match.') }

    this.stack.pop()
    this.stack.pop()
  }

  this.stack.push(node)
}

ElkremReceiver.prototype.getIndex = function getIndex (w) {
  var i, node, out

  if (this.stack.length === 0) { throw new Error('Nil receiver') }

  for (i = 0; i < this.stack.length; i++) {
    node = this.stack[i]
    if (w <= node.i) {
      out = node
      break
    }
  }

  if (!out) {
    throw new Error('Receiver has max ' +
      this.stack[this.stack.length - 1].i +
      ', less than requested ' + w)
  }

  return descend(w, out.i, out.h, out.hash)
}

ElkremReceiver.prototype.upTo = function upTo () {
  if (this.stack.length < 1) { return 0 }
  return this.stack[this.stack.length - 1].i
}

/**
 * Elkrem Node
 */

function ElkremNode (hash, h, i) {
  this.hash = hash || constants.ZERO_HASH
  this.h = h || 0
  this.i = i || 0
}

/*
 * Helpers
 */

function leftHash (hash) {
  return crypto.hash256(hash)
}

function rightHash (hash) {
  var buf = new Buffer(33)
  hash.copy(buf, 0)
  buf[32] = 1
  return crypto.hash256(buf)
}

function descend (w, i, h, hash) {
  var pow

  while (w < i) {
    pow = Math.pow(2, h)

    if (w <= i - pow) {
      hash = leftHash(hash)
      i -= pow
    } else {
      hash = rightHash(hash)
      i--
    }

    if (h === 0) { break }

    h--
  }

  if (w !== i) { throw new Error('Cannot get index ' + w + ' from ' + i) }

  return hash
}

/*
 * Expose
 */

exports.ElkremSender = ElkremSender
exports.ElkremReceiver = ElkremReceiver
