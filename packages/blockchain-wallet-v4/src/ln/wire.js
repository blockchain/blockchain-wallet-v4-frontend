'use strict'

var bcoin = require('bcoin/lib/bcoin-browser')
var utils = require('bcoin/lib/utils/util')
var assert = require('assert')
var constants = bcoin.constants
var ZERO_SIG = new Buffer(73)
ZERO_SIG.fill(0)

// Commands used in lightning message headers which detail the type of message.
var msgType = {
  // Commands for opening a channel funded by one party (single funder).
  SingleFundingRequest: 100,
  SingleFundingResponse: 110,
  SingleFundingComplete: 120,
  SingleFundingSignComplete: 130,
  SingleFundingOpenProof: 140,

  // Commands for the workflow of cooperatively closing an active channel.
  CloseRequest: 300,
  CloseComplete: 310,

  // Commands for negotiating HTLCs.
  HTLCAddRequest: 1000,
  HTLCAddAccept: 1010,
  HTLCAddReject: 1020,
  HTLCSettleRequest: 1100,
  HTLCTimeoutRequest: 1300,

  // Commands for modifying commitment transactions.
  CommitSignature: 2000,
  CommitRevocation: 2010,

  // Commands for routing
  NeighborHello: 3000,
  NeighborUpd: 3010,
  NeighborAck: 3020,
  NeighborRst: 3030,
  RoutingTableRequest: 3040,
  RoutingTableTransfer: 3050,

  // Commands for reporting protocol errors.
  ErrorGeneric: 4000
}

function fromRaw (cmd, data) {
  switch (cmd) {
    case msgType.SingleFundingRequest:
      return SingleFundingRequest.fromRaw(data)
    case msgType.SingleFundingResponse:
      return SingleFundingResponse.fromRaw(data)
    case msgType.SingleFundingComplete:
      return SingleFundingComplete.fromRaw(data)
    case msgType.SingleFundingSignComplete:
      return SingleFundingSignComplete.fromRaw(data)
    case msgType.SingleFundingOpenProof:
      return SingleFundingOpenProof.fromRaw(data)

    // Commands for the workflow of cooperatively closing an active channel.
    case msgType.CloseRequest:
      return CloseRequest.fromRaw(data)
    case msgType.CloseComplete:
      return CloseComplete.fromRaw(data)

    // Commands for negotiating HTLCs.
    case msgType.HTLCAddRequest:
      return HTLCAddRequest.fromRaw(data)
    // case msgType.HTLCAddAccept:
    //   return HTLCAddAccept.fromRaw(data);
    case msgType.HTLCAddReject:
      return HTLCAddReject.fromRaw(data)
    case msgType.HTLCSettleRequest:
      return HTLCSettleRequest.fromRaw(data)
    case msgType.HTLCTimeoutRequest:
      return HTLCTimeoutRequest.fromRaw(data)

    // Commands for modifying commitment transactions.
    case msgType.CommitSignature:
      return CommitSignature.fromRaw(data)
    case msgType.CommitRevocation:
      return CommitRevocation.fromRaw(data)

    // Commands for routing
    case msgType.NeighborHello:
      return NeighborHello.fromRaw(data)
    case msgType.NeighborUpd:
      return NeighborUpd.fromRaw(data)
    case msgType.NeighborAck:
      return NeighborAck.fromRaw(data)
    case msgType.NeighborRst:
      return NeighborRst.fromRaw(data)
    case msgType.RoutingTableRequest:
      return RoutingTableRequest.fromRaw(data)
    case msgType.RoutingTableTransfer:
      return RoutingTableTransfer.fromRaw(data)

    // Commands for reporting protocol errors.
    case msgType.ErrorGeneric:
      return ErrorGeneric.fromRaw(data)
    default:
      throw new Error('Unknown cmd.')
  }
}

function CloseComplete () {
  this.channelPoint = new bcoin.outpoint()
  this.responderCloseSig = ZERO_SIG
}

CloseComplete.prototype.cmd = msgType.CloseComplete

CloseComplete.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.responderCloseSig = p.readBytes(73)
  return this
}

CloseComplete.fromRaw = function fromRaw (data) {
  return new CloseComplete().fromRaw(data)
}

CloseComplete.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeBytes(this.responderCloseSig)
  return p.render()
}

function CloseRequest () {
  this.channelPoint = new bcoin.outpoint()
  this.requesterCloseSig = ZERO_SIG
  this.fee = 0
}

CloseRequest.prototype.cmd = msgType.CloseRequest

CloseRequest.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.requesterCloseSig = p.readBytes(73)
  this.fee = p.read64NBE()
  return this
}

CloseRequest.fromRaw = function fromRaw (data) {
  return new CloseRequest().fromRaw(data)
}

CloseRequest.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeBytes(this.requesterCloseSig)
  p.write64BE(this.fee)
  return p.render()
}

function CommitRevocation () {
  this.channelPoint = new bcoin.outpoint()
  this.revocation = constants.ZERO_HASH
  this.nextRevKey = constants.ZERO_KEY
  this.nextRevHash = constants.ZERO_HASH
}

CommitRevocation.prototype.cmd = msgType.CommitRevocation

CommitRevocation.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.revocation = p.readBytes(32)
  this.nextRevKey = p.readBytes(33)
  this.nextRevHash = p.readBytes(32)
  return this
}

CommitRevocation.fromRaw = function fromRaw (data) {
  return new CommitRevocation().fromRaw(data)
}

CommitRevocation.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeBytes(this.revocation)
  p.writeBytes(this.nextRevKey)
  p.writeBytes(this.nextRevHash)
  return p.render()
}

function CommitSignature () {
  this.channelPoint = new bcoin.outpoint()
  this.logIndex = 0
  this.fee = 0
  this.commitSig = ZERO_SIG
}

CommitSignature.prototype.cmd = msgType.CommitSignature

CommitSignature.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.logIndex = p.readU64NBE()
  this.fee = p.read64NBE()
  this.commitSig = p.readBytes(73)
  return this
}

CommitSignature.fromRaw = function fromRaw (data) {
  return new CommitSignature().fromRaw(data)
}

CommitSignature.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeU64BE(this.logIndex)
  p.write64BE(this.fee)
  p.writeBytes(this.commitSig)
  return p.render()
}

function ErrorGeneric () {
  this.channelPoint = new bcoin.outpoint()
  this.errorID = 0
  this.problem = ''
}

ErrorGeneric.prototype.cmd = msgType.ErrorGeneric

ErrorGeneric.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.errorID = p.readU16BE()
  this.problem = p.readVarString('utf8')
  return this
}

ErrorGeneric.fromRaw = function fromRaw (data) {
  return new ErrorGeneric().fromRaw(data)
}

ErrorGeneric.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeU16BE(this.errorID)
  p.writeString(this.problem, 'utf8')
  return p.render()
}

function HTLCAddReject () {
  this.channelPoint = new bcoin.outpoint()
  this.htlcKey = 0
}

HTLCAddReject.prototype.cmd = msgType.HTLCAddReject

HTLCAddReject.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.htlcKey = p.readU64NBE()
  return this
}

HTLCAddReject.fromRaw = function fromRaw (data) {
  return new HTLCAddReject().fromRaw(data)
}

HTLCAddReject.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeU64BE(this.htlcKey)
  return p.render()
}

function HTLCAddRequest () {
  this.channelPoint = new bcoin.outpoint()
  this.expiry = 0
  this.value = 0
  this.refundContext = null // not currently used
  this.contractType = 0 // bitfield for m of n
  this.redemptionHashes = []
  this.onionBlob = new Buffer(0)
}

HTLCAddRequest.prototype.cmd = msgType.HTLCAddRequest

HTLCAddRequest.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  var i, count

  this.channelPoint.fromRaw(p)
  this.expiry = p.readU32BE()
  this.value = p.readU32BE()
  this.contractType = p.readU8()

  count = p.readU16BE()

  for (i = 0; i < count; i++) { this.redemptionHashes.push(p.readBytes(32)) }

  this.onionBlob = p.readVarBytes()

  return this
}

HTLCAddRequest.fromRaw = function fromRaw (data) {
  return new HTLCAddRequest().fromRaw(data)
}

HTLCAddRequest.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  var i

  this.channelPoint.toRaw(p)

  p.writeU32BE(this.expiry)
  p.writeU32BE(this.value)
  p.writeU8(this.contractType)
  p.writeU16BE(this.redemptionHashes.length)

  for (i = 0; i < this.redemptionHashes.length; i++) { p.writeBytes(this.redemptionHashes[i]) }

  p.writeVarBytes(this.onionBlob)

  return p.render()
}

function HTLCSettleRequest () {
  this.channelPoint = new bcoin.outpoint()
  this.htlcKey = 0
  this.redemptionProofs = []
}

HTLCSettleRequest.prototype.cmd = msgType.HTLCSettleRequest

HTLCSettleRequest.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  var i, count

  this.channelPoint.fromRaw(p)
  this.htlcKey = p.readU64NBE()

  count = p.readU16BE()

  for (i = 0; i < count; i++) { this.redemptionProofs.push(p.readBytes(32)) }

  return this
}

HTLCSettleRequest.fromRaw = function fromRaw (data) {
  return new HTLCSettleRequest().fromRaw(data)
}

HTLCSettleRequest.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  var i

  this.channelPoint.toRaw(p)

  p.writeU64BE(this.htlcKey)
  p.writeU16BE(this.redemptionProofs.length)

  for (i = 0; i < this.redemptionProofs.length; i++) { p.writeBytes(this.redemptionProofs[i]) }

  return p.render()
}

function HTLCTimeoutRequest () {
  this.channelPoint = new bcoin.outpoint()
  this.htlcKey = 0
}

HTLCTimeoutRequest.prototype.cmd = msgType.HTLCTimeoutRequest

HTLCTimeoutRequest.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelPoint.fromRaw(p)
  this.htlcKey = p.readU64NBE()
  return this
}

HTLCTimeoutRequest.fromRaw = function fromRaw (data) {
  return new HTLCTimeoutRequest().fromRaw(data)
}

HTLCTimeoutRequest.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  this.channelPoint.toRaw(p)
  p.writeU64BE(this.htlcKey)
  return p.render()
}

function NeighborAck () {
}

NeighborAck.prototype.cmd = msgType.NeighborAck

NeighborAck.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  assert(p.readString(18, 'ascii') === 'NeighborAckMessage')
  return this
}

NeighborAck.fromRaw = function fromRaw (data) {
  return new NeighborAck().fromRaw(data)
}

NeighborAck.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeString('NeighborAckMessage', 'ascii')
  return p.render()
}

function NeighborHello () {
  this.rt = null // TODO: Routing table.
}

NeighborHello.prototype.fromRaw = function fromRaw (data) {
  // var p = new bcoin.reader(data);
  // this.rt.fromRaw(data);
  return this
}

NeighborHello.fromRaw = function fromRaw (data) {
  return new NeighborAck().fromRaw(data)
}

NeighborHello.prototype.toRaw = function toRaw () {
  // var p = new bcoin.writer();
  // this.rt.toRaw(p);
  // return p.render();
  return new Buffer(0)
}

function NeighborRst () {
}

NeighborRst.prototype.cmd = msgType.NeighborRst

NeighborRst.prototype.fromRaw = function fromRaw (data) {
  return this
}

NeighborRst.fromRaw = function fromRaw (data) {
  return new NeighborRst().fromRaw(data)
}

NeighborRst.prototype.toRaw = function toRaw () {
  return new Buffer(0)
}

function NeighborUpd () {
  this.diffBuff = null // TODO: routing table diff buff
}

NeighborUpd.prototype.fromRaw = function fromRaw (data) {
  return this
}

NeighborUpd.fromRaw = function fromRaw (data) {
  return new NeighborUpd().fromRaw(data)
}

NeighborUpd.prototype.toRaw = function toRaw () {
  return new Buffer(0)
}

function RoutingTableRequest () {
  this.rt = null // TODO
}

RoutingTableRequest.prototype.cmd = msgType.RoutingTableRequest

RoutingTableRequest.prototype.fromRaw = function fromRaw (data) {
  return this
}

RoutingTableRequest.fromRaw = function fromRaw (data) {
  return new RoutingTableRequest().fromRaw(data)
}

RoutingTableRequest.prototype.toRaw = function toRaw () {
  return new Buffer(0)
}

function RoutingTableTransfer () {
}

RoutingTableTransfer.prototype.cmd = msgType.RoutingTableTransfer

RoutingTableTransfer.prototype.fromRaw = function fromRaw (data) {
  return this
}

RoutingTableTransfer.fromRaw = function fromRaw (data) {
  return new RoutingTableTransfer().fromRaw(data)
}

RoutingTableTransfer.prototype.toRaw = function toRaw () {
  return new Buffer(0)
}

function SingleFundingComplete () {
  this.channelID = 0
  this.fundingOutpoint = new bcoin.outpoint()
  this.commitSignature = ZERO_SIG
  this.revocationKey = constants.ZERO_KEY
}

SingleFundingComplete.prototype.cmd = msgType.SingleFundingComplete

SingleFundingComplete.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelID = p.readU64NBE()
  this.fundingOutpoint.fromRaw(p)
  this.commitSignature = p.readBytes(73)
  this.revocationKey = p.readBytes(33)
  assert(this.fundingOutpoint.hash !== constants.NULL_HASH)
  return this
}

SingleFundingComplete.fromRaw = function fromRaw (data) {
  return new SingleFundingComplete().fromRaw(data)
}

SingleFundingComplete.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeU64BE(this.channelID)
  this.fundingOutpoint.toRaw(p)
  p.writeBytes(this.commitSignature)
  p.writeBytes(this.revocationKey)
  return p.render()
}

function SingleFundingOpenProof () {
  this.channelID = 0
  this.spvProof = new Buffer(0)
}

SingleFundingOpenProof.prototype.cmd = msgType.SingleFundingOpenProof

SingleFundingOpenProof.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelID = p.readU64NBE()
  this.spvProof = p.readVarBytes()
  return this
}

SingleFundingOpenProof.fromRaw = function fromRaw (data) {
  return new SingleFundingOpenProof().fromRaw(data)
}

SingleFundingOpenProof.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeU64BE(this.channelID)
  p.writeVarBytes(this.spvProof)
  return p.render()
}

function SingleFundingRequest () {
  this.channelID = 0
  this.channelType = 0
  this.coinType = 0
  this.feeRate = 0
  this.fundingValue = 0
  this.csvDelay = 0
  this.commitKey = constants.ZERO_KEY
  this.channelDerivationPoint = constants.ZERO_KEY
  this.deliveryScript = new bcoin.script()
}

SingleFundingRequest.prototype.cmd = msgType.SingleFundingRequest

SingleFundingRequest.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelID = p.readU64NBE()
  this.channelType = p.readU8()
  this.coinType = p.readU64NBE()
  this.feeRate = p.readU64NBE()
  this.fundingValue = p.readU64NBE()
  this.csvDelay = p.readU32BE()
  this.commitKey = p.readBytes(33)
  this.channelDerivationPoint = p.readBytes(33)
  this.deliveryScript.fromRaw(p.readVarBytes())
  return this
}

SingleFundingRequest.fromRaw = function fromRaw (data) {
  return new SingleFundingRequest().fromRaw(data)
}

SingleFundingRequest.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeU64BE(this.channelID)
  p.writeU8(this.channelType)
  p.writeU64BE(this.coinType)
  p.writeU64BE(this.feeRate)
  p.writeU64BE(this.fundingValue)
  p.writeU32BE(this.csvDelay)
  p.writeBytes(this.commitKey)
  p.writeBytes(this.channelDerivationPoint)
  p.writeVarBytes(this.deliveryScript.toRaw())
  return p.render()
}

function SingleFundingResponse () {
  this.channelID = 0
  this.channelDerivationPoint = constants.ZERO_KEY
  this.commitKey = constants.ZERO_KEY
  this.revocationKey = constants.ZERO_KEY
  this.csvDelay = 0
  this.deliveryScript = new bcoin.script()
}

SingleFundingResponse.prototype.cmd = msgType.SingleFundingResponse

SingleFundingResponse.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelID = p.readU64NBE()
  this.channelDerivationPoint = p.readBytes(33)
  this.commitKey = p.readBytes(33)
  this.revocationKey = p.readBytes(33)
  this.csvDelay = p.readU32BE()
  this.deliveryScript.fromRaw(p.readVarBytes())
  return this
}

SingleFundingResponse.fromRaw = function fromRaw (data) {
  return new SingleFundingResponse().fromRaw(data)
}

SingleFundingResponse.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeU64BE(this.channelID)
  p.writeBytes(this.channelDerivationPoint)
  p.writeBytes(this.commitKey)
  p.writeBytes(this.revocationKey)
  p.writeU32BE(this.csvDelay)
  p.writeVarBytes(this.deliveryScript.toRaw())
  return p.render()
}

function SingleFundingSignComplete () {
  this.channelID = 0
  this.commitSignature = ZERO_SIG
}

SingleFundingSignComplete.prototype.cmd = msgType.SingleFundingSignComplete

SingleFundingSignComplete.prototype.fromRaw = function fromRaw (data) {
  var p = new bcoin.reader(data)
  this.channelID = p.readU64NBE()
  this.commitSignature = p.readBytes(73)
  return this
}

SingleFundingSignComplete.fromRaw = function fromRaw (data) {
  return new SingleFundingSignComplete().fromRaw(data)
}

SingleFundingSignComplete.prototype.toRaw = function toRaw () {
  var p = new bcoin.writer()
  p.writeU64BE(this.channelID)
  p.writeBytes(this.commitSignature)
  return p.render()
}

exports.CloseComplete = CloseComplete
exports.CloseRequest = CloseRequest
exports.CommitRevocation = CommitRevocation
exports.CommitSignature = CommitSignature
exports.ErrorGeneric = ErrorGeneric
exports.HTLCAddReject = HTLCAddReject
exports.HTLCAddRequest = HTLCAddRequest
exports.HTLCSettleRequest = HTLCSettleRequest
exports.HTLCTimeoutRequest = HTLCTimeoutRequest
exports.NeighborAck = NeighborAck
exports.NeighborHello = NeighborHello
exports.NeighborRst = NeighborRst
exports.NeighborUpd = NeighborUpd
exports.RoutingTableRequest = RoutingTableRequest
exports.RoutingTableTransfer = RoutingTableTransfer
exports.SingleFundingComplete = SingleFundingComplete
exports.SingleFundingOpenProof = SingleFundingOpenProof
exports.SingleFundingRequest = SingleFundingRequest
exports.SingleFundingResponse = SingleFundingResponse
exports.SingleFundingSignComplete = SingleFundingSignComplete
exports.msgType = msgType
exports.fromRaw = fromRaw
