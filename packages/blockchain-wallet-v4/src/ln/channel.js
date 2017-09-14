/*!
 * channel.js
 * https://github.com/bcoin-org/plasma
 *
 * References:
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwallet/channel.go
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwallet/script_utils.go
 *   https://github.com/lightningnetwork/lnd/blob/master/elkrem/elkrem.go
 *   https://github.com/lightningnetwork/lnd/blob/master/channeldb/channel.go
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwire/htlc_addrequest.go
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwallet/script_utils.go
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwallet/script_utils_test.go
 *   https://github.com/lightningnetwork/lnd/blob/master/lnwallet/channel_test.go
 */

'use strict'

var bcoin = require('bcoin/lib/bcoin-browser')
var constants = bcoin.constants
var utils = require('bcoin/lib/utils/util')
var assert = require('assert')
var hashType = constants.hashType
var util = require('./scriptutil')
var crypto = bcoin.crypto
var wire = require('./wire')
var CommitRevocation = wire.CommitRevocation
var List = require('./list')

/**
 * Channel
 */

function Channel (options) {
  this.wallet = options.wallet || null
  this.chain = options.chain || null
  this.ourLogCounter = 0
  this.theirLogCounter = 0
  this.status = Channel.states.PENDING
  this.currentHeight = options.state.numUpdates || 0
  this.revocationWindowEdge = options.state.numUpdates || 0
  this.usedRevocations = []
  this.revocationWindow = []
  this.remoteCommitChain = new CommitmentChain()
  this.localCommitChain = new CommitmentChain()
  this.state = options.state
  this.ourUpdateLog = new List()
  this.theirUpdateLog = new List()
  this.ourLogIndex = {}
  this.theirLogIndex = {}
  this.fundingInput = new bcoin.coin()
  this.fundingInput.version = 1
  this.fundingP2WSH = null
  this.db = options.db || null
  this.started = 0
  this.shutdown = 0

  this._init()
}

Channel.states = {
  PENDING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  DISPUTE: 4,
  PENDINGPAYMENT: 5
}

Channel.updateType = {
  ADD: 0,
  TIMEOUT: 1,
  SETTLE: 2
}

Channel.maxPendingPayments = 100

Channel.initialRevocationWindow = 4

Channel.prototype._init = function _init () {
  var initialCommit = new Commitment()
  var fundingScript

  initialCommit.height = this.currentHeight
  initialCommit.ourBalance = this.state.ourBalance
  initialCommit.theirBalance = this.state.theirBalance

  this.localCommitChain.add(initialCommit)
  this.remoteCommitChain.add(initialCommit)

  fundingScript = util.toWitnessScripthash(this.state.fundingScript)

  this.fundingInput.hash = this.state.fundingInput.hash
  this.fundingInput.index = this.state.fundingInput.index
  this.fundingInput.script = fundingScript
  this.fundingP2WSH = fundingScript
}

Channel.prototype.getCommitmentView = getCommitmentView

function getCommitmentView (ourLogIndex, theirLogIndex, revKey, revHash, remoteChain) {
  var commitChain, ourBalance, theirBalance, nextHeight
  var view, filtered
  var selfKey, remoteKey, delay, delayBalance, p2wpkhBalance
  var i, ourCommit, commit, htlc, commitment

  if (remoteChain) { commitChain = this.remoteCommitChain } else { commitChain = this.localCommitChain }

  if (!commitChain.tip()) {
    ourBalance = this.state.ourBalance
    theirBalance = this.state.theirBalance
    nextHeight = 1
  } else {
    ourBalance = commitChain.tip().ourBalance
    theirBalance = commitChain.tip().theirBalance
    nextHeight = commitChain.tip().height + 1
  }

  view = this.getHTLCView(theirLogIndex, ourLogIndex)

  filtered = this.evalHTLCView(
    view, ourBalance, theirBalance,
    nextHeight, remoteChain)

  if (remoteChain) {
    selfKey = this.state.theirCommitKey
    remoteKey = this.state.ourCommitPub
    delay = this.state.remoteCSVDelay
    delayBalance = filtered.theirBalance
    p2wpkhBalance = filtered.ourBalance
  } else {
    selfKey = this.state.ourCommitPub
    remoteKey = this.state.theirCommitKey
    delay = this.state.localCSVDelay
    delayBalance = filtered.ourBalance
    p2wpkhBalance = filtered.theirBalance
  }

  ourCommit = !remoteChain

  commit = util.createCommitTX(
    this.fundingInput, selfKey, remoteKey,
    revKey, delay, delayBalance, p2wpkhBalance)

  for (i = 0; i < filtered.ourUpdates.length; i++) {
    htlc = filtered.ourUpdates[i]
    this.pushHTLC(commit, ourCommit, htlc, revHash, delay, false)
  }

  for (i = 0; i < filtered.theirUpdates.length; i++) {
    htlc = filtered.theirUpdates[i]
    this.pushHTLC(commit, ourCommit, htlc, revHash, delay, true)
  }

  commit.sortMembers()

  commitment = new Commitment()
  commitment.tx = commit
  commitment.height = nextHeight
  commitment.ourBalance = filtered.ourBalance
  commitment.ourMessageIndex = ourLogIndex
  commitment.theirMessageIndex = theirLogIndex
  commitment.theirBalance = filtered.theirBalance

  return commitment
}

Channel.prototype.getHTLCView = function getHTLCView (theirLogIndex, ourLogIndex) {
  var ours = []
  var theirs = []
  var item, htlc

  for (item = this.ourUpdateLog.head; item; item = item.next) {
    htlc = item.value
    if (htlc.index < ourLogIndex) { ours.push(htlc) }
  }

  for (item = this.theirUpdateLog.head; item; item = item.next) {
    htlc = item.value
    if (htlc.index < theirLogIndex) { theirs.push(htlc) }
  }

  return new HTLCView(ours, theirs)
}

Channel.prototype.evalHTLCView = evalHTLCView

function evalHTLCView (view, ourBalance, theirBalance, nextHeight, remoteChain) {
  var filtered = new HTLCView()
  var skipUs = {}
  var skipThem = {}
  var i, entry, addEntry, isAdd

  filtered.ourBalance = ourBalance
  filtered.theirBalance = theirBalance

  for (i = 0; i < view.ourUpdates.length; i++) {
    entry = view.ourUpdates[i]
    if (entry.entryType === Channel.updateType.ADD) { continue }
    addEntry = this.theirLogIndex[entry.parentIndex]
    skipThem[addEntry.value.index] = true
    processRemoveEntry(entry, filtered, nextHeight, remoteChain, true)
  }

  for (i = 0; i < view.theirUpdates.length; i++) {
    entry = view.theirUpdates[i]
    if (entry.entryType === Channel.updateType.ADD) { continue }
    addEntry = this.ourLogIndex[entry.parentIndex]
    skipUs[addEntry.value.index] = true
    processRemoveEntry(entry, filtered, nextHeight, remoteChain, false)
  }

  for (i = 0; i < view.ourUpdates.length; i++) {
    entry = view.ourUpdates[i]
    isAdd = entry.entryType === Channel.updateType.ADD
    if (!isAdd || skipUs[entry.index]) { continue }
    processAddEntry(entry, filtered, nextHeight, remoteChain, false)
    filtered.ourUpdates.push(entry)
  }

  for (i = 0; i < view.theirUpdates.length; i++) {
    entry = view.theirUpdates[i]
    isAdd = entry.entryType === Channel.updateType.ADD
    if (!isAdd || skipThem[entry.index]) { continue }
    processAddEntry(entry, filtered, nextHeight, remoteChain, true)
    filtered.theirUpdates.push(entry)
  }

  return filtered
}

function processAddEntry (htlc, filtered, nextHeight, remoteChain, isIncoming) {
  var addHeight

  if (remoteChain) { addHeight = htlc.addCommitHeightRemote } else { addHeight = htlc.addCommitHeightLocal }

  if (addHeight !== 0) { return }

  if (isIncoming) { filtered.theirBalance -= htlc.value } else { filtered.ourBalance -= htlc.value }

  if (remoteChain) { htlc.addCommitHeightRemote = nextHeight } else { htlc.addCommitHeightLocal = nextHeight }
}

function processRemoveEntry (htlc, filtered, nextHeight, remoteChain, isIncoming) {
  var removeHeight

  if (remoteChain) { removeHeight = htlc.removeCommitHeightRemote } else { removeHeight = htlc.removeCommitHeightLocal }

  if (removeHeight !== 0) { return }

  if (isIncoming) {
    if (htlc.entryType === Channel.updateType.SETTLE) { filtered.ourBalance += htlc.value } else if (htlc.entryType === Channel.updateType.TIMEOUT) { filtered.theirBalance += htlc.value }
  } else {
    if (htlc.entryType === Channel.updateType.SETTLE) { filtered.theirBalance += htlc.value } else if (htlc.entryType === Channel.updateType.TIMEOUT) { filtered.ourBalance += htlc.value }
  }

  if (remoteChain) { htlc.removeCommitHeightRemote = nextHeight } else { htlc.removeCommitHeightLocal = nextHeight }
}

Channel.prototype.signNextCommitment = function signNextCommitment () {
  var nextRev, remoteRevKey, remoteRevHash, view, sig

  if (this.revocationWindow.length === 0 ||
      this.usedRevocations.length === Channel.initialRevocationWindow) {
    throw new Error('No revocation window.')
  }

  nextRev = this.revocationWindow[0]
  remoteRevKey = nextRev.nextRevKey
  remoteRevHash = nextRev.nextRevHash

  view = this.getCommitmentView(
    this.ourLogCounter, this.theirLogCounter,
    remoteRevKey, remoteRevHash, true)

  view.tx.inputs[0].coin.value = this.state.capacity

  sig = view.tx.signature(0,
    this.state.fundingScript,
    this.state.ourMultisigKey,
    hashType.ALL,
    1)

  this.remoteCommitChain.add(view)

  this.usedRevocations.push(nextRev)
  this.revocationWindow.shift()

  return {
    sig: sig.slice(0, -1),
    index: this.theirLogCounter
  }
}

Channel.prototype.receiveNewCommitment = function receiveNewCommitment (sig, ourLogIndex) {
  var theirCommitKey = this.state.theirCommitKey
  var theirMultisigKey = this.state.theirMultisigKey
  var nextHeight = this.currentHeight + 1
  var revocation = this.state.localElkrem.getIndex(nextHeight)
  var revKey = util.deriveRevPub(theirCommitKey, revocation)
  var revHash = crypto.sha256(revocation)
  var view, localCommit, multisigScript
  var msg, result

  view = this.getCommitmentView(
    ourLogIndex, this.theirLogCounter,
    revKey, revHash, false)

  localCommit = view.tx
  multisigScript = this.state.fundingScript

  localCommit.inputs[0].coin.value = this.state.capacity

  msg = localCommit.signatureHash(0, multisigScript, hashType.ALL, 1)
  result = bcoin.ec.verify(msg, sig, theirMultisigKey)

  if (!result) { throw new Error('Invalid commitment signature.') }

  view.sig = sig

  this.localCommitChain.add(view)
}

Channel.prototype.pendingUpdates = function pendingUpdates () {
  var localTip = this.localCommitChain.tip()
  var remoteTip = this.remoteCommitChain.tip()
  return localTip.ourMessageIndex !== remoteTip.ourMessageIndex
}

Channel.prototype.revokeCurrentCommitment = function revokeCurrentCommitment () {
  var theirCommitKey = this.state.theirCommitKey
  var revMsg = new CommitRevocation()
  var currentRev, revEdge, tail

  revMsg.channelPoint = this.state.id

  currentRev = this.state.localElkrem.getIndex(this.currentHeight)
  revMsg.revocation = currentRev

  this.revocationWindowEdge++

  revEdge = this.state.localElkrem.getIndex(this.revocationWindowEdge)
  revMsg.nextRevKey = util.deriveRevPub(theirCommitKey, revEdge)
  revMsg.nextRevHash = crypto.sha256(revEdge)

  this.localCommitChain.advanceTail()
  this.currentHeight++

  tail = this.localCommitChain.tail()
  this.state.ourCommitTX = tail.tx
  this.state.ourBalance = tail.ourBalance
  this.state.theirBalance = tail.theirBalance
  this.state.ourCommitSig = tail.sig
  this.state.numUpdates++

  this.state.fullSync()

  return revMsg
}

Channel.prototype.receiveRevocation = function receiveRevocation (revMsg) {
  var ourCommitKey, currentRevKey, pendingRev
  var revPriv, revPub, revHash, nextRev
  var remoteChainTail, localChainTail
  var item, htlcsToForward, htlc, uncommitted

  if (utils.equal(revMsg.revocation, constants.ZERO_HASH)) {
    this.revocationWindow.push(revMsg)
    return
  }

  ourCommitKey = this.state.ourCommitKey
  currentRevKey = this.state.theirCurrentRevocation
  pendingRev = revMsg.revocation

  this.state.remoteElkrem.addNext(pendingRev)

  revPriv = util.deriveRevPriv(ourCommitKey, pendingRev)
  revPub = bcoin.ec.publicKeyCreate(revPriv, true)

  if (!utils.equal(revPub, currentRevKey)) { throw new Error('Revocation key mistmatch.') }

  if (!utils.equal(this.state.theirCurrentRevHash, constants.ZERO_HASH)) {
    revHash = crypto.sha256(pendingRev)
    if (!utils.equal(this.state.theirCurrentRevHash, revHash)) { throw new Error('Revocation hash mismatch.') }
  }

  nextRev = this.usedRevocations[0]

  this.state.theirCurrentRevocation = nextRev.nextRevKey
  this.state.theirCurrentRevHash = nextRev.nextRevHash
  this.usedRevocations.shift()
  this.revocationWindow.push(revMsg)

  this.state.syncRevocation()
  this.remoteCommitChain.advanceTail()

  remoteChainTail = this.remoteCommitChain.tail().height
  localChainTail = this.localCommitChain.tail().height

  htlcsToForward = []

  for (item = this.theirUpdateLog.head; item; item = item.next) {
    htlc = item.value

    if (htlc.isForwarded) { continue }

    uncommitted = htlc.addCommitHeightRemote === 0 ||
      htlc.addCommitHeightLocal === 0

    if (htlc.entryType === Channel.updateType.ADD && uncommitted) { continue }

    if (htlc.entryType === Channel.updateType.ADD &&
        remoteChainTail >= htlc.addCommitHeightRemote &&
        localChainTail >= htlc.addCommitHeightLocal) {
      htlc.isForwarded = true
      htlcsToForward.push(htlc)
      continue
    }

    if (htlc.entryType !== Channel.updateType.ADD &&
      remoteChainTail >= htlc.removeCommitHeightRemote &&
      localChainTail >= htlc.removeCommitHeightLocal) {
      htlc.isForwarded = true
      htlcsToForward.push(htlc)
    }
  }

  this.compactLogs(
    this.ourUpdateLog, this.theirUpdateLog,
    localChainTail, remoteChainTail)

  return htlcsToForward
}

Channel.prototype.compactLogs = compactLogs

function compactLogs (ourLog, theirLog, localChainTail, remoteChainTail) {
  function compact (logA, logB, indexB, indexA) {
    var item, next, htlc, parentLink, parentIndex

    for (item = logA.head; item; item = next) {
      htlc = item.value
      next = item.next

      if (htlc.entryType === Channel.updateType.ADD) { continue }

      if (htlc.removeCommitHeightRemote === 0 ||
          htlc.removeCommitHeightLocal === 0) {
        continue
      }

      if (remoteChainTail >= htlc.removeCommitHeightRemote &&
          localChainTail >= htlc.removeCommitHeightLocal) {
        parentLink = indexB[htlc.parentIndex]
        assert(htlc.parentIndex === parentLink.value.index)
        parentIndex = parentLink.value.index
        logB.removeItem(parentLink)
        logA.removeItem(item)
        delete indexB[parentIndex]
        delete indexA[htlc.index]
      }
    }
  }

  compact(ourLog, theirLog, this.theirLogIndex, this.ourLogIndex)
  compact(theirLog, ourLog, this.ourLogIndex, this.theirLogIndex)
};

Channel.prototype.extendRevocationWindow = function extendRevocationWindow () {
  var revMsg = new CommitRevocation()
  var nextHeight = this.revocationWindowEdge + 1
  var revocation = this.state.localElkrem.getIndex(nextHeight)
  var theirCommitKey = this.state.theirCommitKey

  revMsg.channelPoint = this.state.id
  revMsg.nextRevKey = util.deriveRevPub(theirCommitKey, revocation)
  revMsg.nextRevHash = crypto.sha256(revocation)

  this.revocationWindowEdge++

  return revMsg
}

Channel.prototype.addHTLC = function addHTLC (htlc) {
  var pd = new PaymentDescriptor()
  var item

  pd.entryType = Channel.updateType.ADD
  pd.paymentHash = htlc.redemptionHashes[0]
  pd.timeout = htlc.expiry
  pd.value = htlc.value
  pd.index = this.ourLogCounter

  item = this.ourUpdateLog.push(pd)
  this.ourLogIndex[pd.index] = item
  this.ourLogCounter++

  return pd.index
}

Channel.prototype.receiveHTLC = function receiveHTLC (htlc) {
  var pd = new PaymentDescriptor()
  var item

  pd.entryType = Channel.updateType.ADD
  pd.paymentHash = htlc.redemptionHashes[0]
  pd.timeout = htlc.expiry
  pd.value = htlc.value
  pd.index = this.theirLogCounter

  item = this.theirUpdateLog.push(pd)
  this.theirLogIndex[pd.index] = item
  this.theirLogCounter++

  return pd.index
}

Channel.prototype.settleHTLC = function settleHTLC (preimage) {
  var paymentHash = crypto.sha256(preimage)
  var item, htlc, target, pd

  for (item = this.theirUpdateLog.head; item; item = item.next) {
    htlc = item.value

    if (htlc.entryType !== Channel.updateType.ADD) { continue }

    if (htlc.settled) { continue }

    if (utils.equal(htlc.paymentHash, paymentHash)) {
      htlc.settled = true
      target = htlc
      break
    }
  }

  if (!target) { throw new Error('Invalid payment hash.') }

  pd = new PaymentDescriptor()
  pd.value = target.value
  pd.index = this.ourLogCounter
  pd.parentIndex = target.index
  pd.entryType = Channel.updateType.SETTLE

  this.ourUpdateLog.push(pd)
  this.ourLogCounter++

  return target.index
}

Channel.prototype.receiveHTLCSettle = function receiveHTLCSettle (preimage, logIndex) {
  var paymentHash = crypto.sha256(preimage)
  var addEntry = this.ourLogIndex[logIndex]
  var htlc, pd

  if (!addEntry) { throw new Error('Non existent log entry.') }

  htlc = addEntry.value

  if (!utils.equal(htlc.paymentHash, paymentHash)) { throw new Error('Invalid payment hash.') }

  pd = new PaymentDescriptor()
  pd.value = htlc.value
  pd.parentIndex = htlc.index
  pd.index = this.theirLogCounter
  pd.entryType = Channel.updateType.SETTLE

  this.theirUpdateLog.push(pd)
  this.theirLogCounter++
}

Channel.prototype.channelPoint = function channelPoint () {
  return this.state.id
}

Channel.prototype.pushHTLC = pushHTLC

function pushHTLC (commitTX, ourCommit, pd, revocation, delay, isIncoming) {
  var localKey = this.state.ourCommitPub
  var remoteKey = this.state.theirCommitKey
  var timeout = pd.timeout
  var payHash = pd.paymentHash
  var redeem, script, pending, output

  if (isIncoming) {
    if (ourCommit) {
      redeem = util.createReceiverHTLC(
        timeout, delay, remoteKey,
        localKey, revocation, payHash)
    } else {
      redeem = util.createSenderHTLC(
        timeout, delay, remoteKey,
        localKey, revocation, payHash)
    }
  } else {
    if (ourCommit) {
      redeem = util.createSenderHTLC(
        timeout, delay, localKey,
        remoteKey, revocation, payHash)
    } else {
      redeem = util.createReceiverHTLC(
        timeout, delay, localKey,
        remoteKey, revocation, payHash)
    }
  }

  script = util.toWitnessScripthash(redeem)
  pending = pd.value

  output = new bcoin.output()
  output.script = script
  output.value = pending

  commitTX.addOutput(output)
}

Channel.prototype.forceClose = function forceClose () {
}

Channel.prototype.initCooperativeClose = function initCooperativeClose () {
  var closeTX, sig

  if (this.status === Channel.states.CLOSING ||
      this.status === Channel.states.CLOSED) {
    throw new Error('Channel is already closed.')
  }

  this.status = Channel.states.CLOSING

  closeTX = util.createCooperativeClose(
    this.fundingInput,
    this.state.ourBalance,
    this.state.theirBalance,
    this.state.ourDeliveryScript,
    this.state.theirDeliveryScript,
    true)

  closeTX.inputs[0].coin.value = this.state.capacity

  sig = closeTX.signature(0,
    this.state.fundingScript,
    this.state.ourMultisigKey,
    hashType.ALL, 1)

  return {
    sig: sig,
    hash: closeTX.hash()
  }
}

Channel.prototype.completeCooperativeClose = function completeCooperativeClose (remoteSig) {
  var closeTX, redeem, sig, ourKey, theirKey, witness

  if (this.status === Channel.states.CLOSING ||
      this.status === Channel.states.CLOSED) {
    throw new Error('Channel is already closed.')
  }

  this.status = Channel.states.CLOSED

  closeTX = util.createCooperativeClose(
    this.fundingInput,
    this.state.ourBalance,
    this.state.theirBalance,
    this.state.ourDeliveryScript,
    this.state.theirDeliveryScript,
    false)

  closeTX.inputs[0].coin.value = this.state.capacity

  redeem = this.state.fundingScript

  sig = closeTX.signature(0,
    redeem,
    this.state.ourMultisigKey,
    hashType.ALL, 1)

  ourKey = this.state.ourMultisigPub
  theirKey = this.state.theirMultisigKey
  witness = util.spendMultisig(redeem, ourKey, sig, theirKey, remoteSig)

  closeTX.inputs[0].witness = witness

  if (!closeTX.verify()) { throw new Error('TX did not verify.') }

  return closeTX
}

/**
 * Payment Descriptor
 */

function PaymentDescriptor () {
  this.paymentHash = constants.ZERO_HASH
  this.timeout = 0
  this.value = 0
  this.index = 0
  this.parentIndex = 0
  this.payload = null
  this.entryType = Channel.updateType.ADD
  this.addCommitHeightRemote = 0
  this.addCommitHeightLocal = 0
  this.removeCommitHeightRemote = 0
  this.removeCommitHeightLocal = 0
  this.isForwarded = false
  this.settled = false
}

/**
 * Commitment
 */

function Commitment () {
  this.height = 0
  this.ourMessageIndex = 0
  this.theirMessageIndex = 0
  this.tx = new bcoin.mtx()
  this.sig = constants.ZERO_SIG
  this.ourBalance = 0
  this.theirBalance = 0
}

/**
 * Commitment Chain
 */

function CommitmentChain (height) {
  this.list = new List()
  this.startingHeight = height || 0
}

CommitmentChain.prototype.add = function (c) {
  this.list.push(c)
}

CommitmentChain.prototype.advanceTail = function () {
  this.list.shift()
}

CommitmentChain.prototype.tip = function () {
  if (!this.list.tail) { return }
  return this.list.tail.value
}

CommitmentChain.prototype.tail = function () {
  if (!this.list.head) { return }
  return this.list.head.value
}

/**
 * HTLC View
 */

function HTLCView (ourUpdates, theirUpdates) {
  this.ourUpdates = ourUpdates || []
  this.theirUpdates = theirUpdates || []
  this.ourBalance = 0
  this.theirBalance = 0
}

/*
 * Expose
 */

module.exports = Channel
