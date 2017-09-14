'use strict'

var bcoin = require('bcoin/lib/bcoin-browser')
var constants = bcoin.constants
var elkrem = require('./elkrem')
var ElkremSender = elkrem.ElkremSender
var ElkremReceiver = elkrem.ElkremReceiver

function ChannelState (options) {
  this.theirLNID = null
  this.id = new bcoin.outpoint()
  this.minRate = 0
  this.ourCommitKey = null // private
  this.ourCommitPub = null
  this.theirCommitKey = null // public
  this.capacity = 0
  this.ourBalance = 0
  this.theirBalance = 0
  this.ourCommitTX = null
  this.ourCommitSig = null
  this.fundingInput = new bcoin.coin()
  this.ourMultisigKey = null // private
  this.ourMiltisigPub = null
  this.theirMultisigKey = null // public
  this.fundingScript = new bcoin.script()
  this.localCSVDelay = 0
  this.remoteCSVDelay = 0
  this.theirCurrentRevocation = constants.ZERO_KEY // public
  this.theirCurrentRevHash = constants.ZERO_HASH
  this.localElkrem = new ElkremSender()
  this.remoteElkrem = new ElkremReceiver()
  this.ourDeliveryScript = new bcoin.script()
  this.theirDeliveryScript = new bcoin.script()
  this.numUpdates = 0
  this.totalSent = 0
  this.totalReceived = 0
  this.totalFees = 0
  this.ts = 0
  this.isPrevState = false
  this.db = null

  if (options) { this.fromOptions(options) }
}

ChannelState.prototype.fromOptions = function (options) {
  if (options.id) { this.id = options.id }

  if (options.ourCommitKey) {
    this.ourCommitKey = options.ourCommitKey
    this.ourCommitPub = bcoin.ec.publicKeyCreate(this.ourCommitKey, true)
  }

  if (options.theirCommitKey) { this.theirCommitKey = options.theirCommitKey }

  if (options.capacity != null) { this.capacity = options.capacity }

  if (options.ourBalance != null) { this.ourBalance = options.ourBalance }

  if (options.theirBalance != null) { this.theirBalance = options.theirBalance }

  if (options.ourCommitTX) { this.ourCommitTX = options.ourCommitTX }

  if (options.ourCommitSig) { this.ourCommitSig = options.ourCommitSig }

  if (options.fundingInput) { this.fundingInput = options.fundingInput }

  if (options.ourMultisigKey) {
    this.ourMultisigKey = options.ourMultisigKey
    this.ourMultisigPub = bcoin.ec.publicKeyCreate(this.ourMultisigKey, true)
  }

  if (options.theirMultisigKey) { this.theirMultisigKey = options.theirMultisigKey }

  if (options.fundingScript) { this.fundingScript = options.fundingScript }

  if (options.localCSVDelay != null) { this.localCSVDelay = options.localCSVDelay }

  if (options.remoteCSVDelay != null) { this.remoteCSVDelay = options.remoteCSVDelay }

  if (options.theirCurrentRevocation) { this.theirCurrentRevocation = options.theirCurrentRevocation }

  if (options.theirCurrentRevHash) { this.theirCurrentRevHash = options.theirCurrentRevHash }

  if (options.localElkrem) { this.localElkrem = options.localElkrem }

  if (options.remoteElkrem) { this.remoteElkrem = options.remoteElkrem }

  if (options.ourDeliveryScript) { this.ourDeliveryScript = options.ourDeliveryScript }

  if (options.theirDeliveryScript) { this.theirDeliveryScript = options.theirDeliveryScript }

  if (options.numUpdates != null) { this.numUpdates = options.numUpdates }

  if (options.db) { this.db = options.db }
}

ChannelState.prototype.fullSync = function () {
}

ChannelState.prototype.syncRevocation = function () {
}

module.exports = ChannelState
