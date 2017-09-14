'use strict'

var bcoin = require('bcoin/lib/bcoin-browser')
var bn = bcoin.bn
var constants = bcoin.constants
var utils = require('bcoin/lib/utils/util')
var crypto = require('bcoin/lib/crypto/crypto')
var assert = require('assert')
var opcodes = constants.opcodes
var hashType = constants.hashType
var util = exports

util.toWitnessScripthash = function (redeem) {
  return bcoin.script.fromProgram(0, redeem.sha256())
}

util.toMultisig = function (k1, k2) {
  var script = new bcoin.script()
  var k

  // Note: It looks like lnd orders these in reverse.
  if (utils.cmp(k1, k2) < 0) {
    k = k1
    k1 = k2
    k2 = k
  }

  script.push(opcodes.OP_2)
  script.push(k1)
  script.push(k2)
  script.push(opcodes.OP_2)
  script.push(opcodes.OP_CHECKMULTISIG)
  script.compile()

  return script
}

util.fundingRedeem = function (k1, k2, value) {
  var redeem = util.toMultisig(k1, k2)
  var output = new bcoin.output()

  output.script = util.toWitnessScripthash(redeem)
  output.value = value

  assert(value > 0)

  return {
    redeem: redeem,
    output: output
  }
}

util.spendMultisig = function (redeem, k1, s1, k2, s2) {
  var witness = new bcoin.witness()

  witness.push(new Buffer(0))

  // Note: It looks like lnd orders these in reverse.
  if (utils.cmp(k1, k2) < 0) {
    witness.push(s2)
    witness.push(s1)
  } else {
    witness.push(s1)
    witness.push(s2)
  }

  witness.push(redeem.toRaw())
  witness.compile()

  return witness
}

util.findOutput = function (tx, script) {
  var i, output

  for (i = 0; i < tx.outputs.length; i++) {
    output = tx.outputs[i]
    if (utils.equal(output.script.toRaw(), script.toRaw())) { return i }
  }

  return -1
}

util.createSenderHTLC = function (absTimeout, relTimeout, senderKey, recKey, revHash, payHash) {
  var script = new bcoin.script()
  script.push(opcodes.OP_IF)
  script.push(opcodes.OP_IF)
  script.push(revHash)
  script.push(opcodes.OP_ELSE)
  script.push(opcodes.OP_SIZE)
  script.push(new bn(32))
  script.push(opcodes.OP_EQUALVERIFY)
  script.push(payHash)
  script.push(opcodes.OP_ENDIF)
  script.push(opcodes.OP_SWAP)
  script.push(opcodes.OP_SHA256)
  script.push(opcodes.OP_EQUALVERIFY)
  script.push(recKey)
  script.push(opcodes.OP_CHECKSIG)
  script.push(opcodes.OP_ELSE)
  script.push(new bn(absTimeout))
  script.push(opcodes.OP_CHECKLOCKTIMEVERIFY)
  script.push(new bn(relTimeout))
  script.push(opcodes.OP_CHECKSEQUENCEVERIFY)
  script.push(opcodes.OP_2DROP)
  script.push(senderKey)
  script.push(opcodes.OP_CHECKSIG)
  script.push(opcodes.OP_ENDIF)
  script.compile()
  return script
}

util.senderSpendRedeem = function (commitScript, recKey, sweep, payImage) {
  var sig = sweep.signature(0, commitScript, recKey, hashType.ALL, 1)
  var witness = new bcoin.witness()
  witness.push(sig)
  witness.push(payImage)
  witness.push(new bn(0))
  witness.push(new bn(1))
  witness.push(commitScript.toRaw())
  witness.compile()
  return witness
}

util.senderSpendRevoke = function (commitScript, recKey, sweep, revImage) {
  var sig = sweep.signature(0, commitScript, recKey, hashType.ALL, 1)
  var witness = new bcoin.witness()
  witness.push(sig)
  witness.push(revImage)
  witness.push(new bn(1))
  witness.push(new bn(1))
  witness.push(commitScript.toRaw())
  witness.compile()
  return witness
}

util.senderSpendTimeout = function (commitScript, senderKey, sweep, absTimeout, relTime) {
  var sig, witness

  sweep.setSequence(0, relTime)
  sweep.setLocktime(absTimeout)

  sig = sweep.signature(0, commitScript, senderKey, hashType.ALL, 1)

  witness = new bcoin.witness()
  witness.push(sig)
  witness.push(new bn(0))
  witness.push(commitScript.toRaw())
  witness.compile()

  return witness
}

util.createReceiverHTLC = function (absTimeout, relTimeout, senderKey, recKey, revHash, payHash) {
  var script = new bcoin.script()
  script.push(opcodes.OP_IF)
  script.push(opcodes.OP_SIZE)
  script.push(new bn(32))
  script.push(opcodes.OP_EQUALVERIFY)
  script.push(opcodes.OP_SHA256)
  script.push(payHash)
  script.push(opcodes.OP_EQUALVERIFY)
  script.push(new bn(relTimeout))
  script.push(opcodes.OP_CHECKSEQUENCEVERIFY)
  script.push(opcodes.OP_DROP)
  script.push(recKey)
  script.push(opcodes.OP_CHECKSIG)
  script.push(opcodes.OP_ELSE)
  script.push(opcodes.OP_IF)
  script.push(opcodes.OP_SHA256)
  script.push(revHash)
  script.push(opcodes.OP_EQUALVERIFY)
  script.push(opcodes.OP_ELSE)
  script.push(new bn(absTimeout))
  script.push(opcodes.OP_CHECKLOCKTIMEVERIFY)
  script.push(opcodes.OP_DROP)
  script.push(opcodes.OP_ENDIF)
  script.push(senderKey)
  script.push(opcodes.OP_CHECKSIG)
  script.push(opcodes.OP_ENDIF)
  script.compile()
  return script
}

util.recSpendRedeem = function (commitScript, recKey, sweep, payImage, relTime) {
  var sig, witness

  sweep.setSequence(0, relTime)

  sig = sweep.signature(0, commitScript, recKey, hashType.ALL, 1)

  witness = new bcoin.witness()
  witness.push(sig)
  witness.push(payImage)
  witness.push(new bn(1))
  witness.push(commitScript.toRaw())
  witness.compile()

  return witness
}

util.recSpendRevoke = function (commitScript, senderKey, sweep, revImage) {
  var sig = sweep.signature(0, commitScript, senderKey, hashType.ALL, 1)
  var witness = new bcoin.witness()
  witness.push(sig)
  witness.push(revImage)
  witness.push(new bn(1))
  witness.push(new bn(0))
  witness.push(commitScript.toRaw())
  witness.compile()
  return witness
}

util.recSpendTimeout = function (commitScript, senderKey, sweep, absTimeout) {
  var sig, witness

  sweep.setLocktime(absTimeout)

  sig = sweep.signature(0, commitScript, senderKey, hashType.ALL, 1)

  witness = new bcoin.witness()
  witness.push(sig)
  witness.push(new bn(0))
  witness.push(new bn(0))
  witness.push(commitScript.toRaw())
  witness.compile()

  return witness
}

util.commitSelf = function commitSelf (csvTime, selfKey, revKey) {
  var script = new bcoin.script()
  script.push(opcodes.OP_IF)
  script.push(revKey)
  script.push(opcodes.OP_CHECKSIG)
  script.push(opcodes.OP_ELSE)
  script.push(selfKey)
  script.push(opcodes.OP_CHECKSIGVERIFY)
  script.push(new bn(csvTime))
  script.push(opcodes.OP_CHECKSEQUENCEVERIFY)
  script.push(opcodes.OP_ENDIF)
  script.compile()
  return script
}

util.commitUnencumbered = function commitUnencumbered (key) {
  return bcoin.script.fromProgram(0, crypto.hash160(key))
}

util.commitSpendTimeout = function commitSpendTimeout (commitScript, blockTimeout, selfKey, sweep) {
  var sig, witness

  sweep.setSequence(0, blockTimeout)

  sig = sweep.signature(0, commitScript, selfKey, hashType.ALL, 1)
  witness = new bcoin.witness()
  witness.push(sig)
  witness.push(new bn(0))
  witness.push(commitScript.toRaw())
  witness.compile()

  return witness
}

util.commitSpendRevoke = function commitSpendRevoke (commitScript, revPriv, sweep) {
  var sig = sweep.signature(0, commitScript, revPriv, hashType.ALL, 1)
  var witness = new bcoin.witness()
  witness.push(sig)
  witness.push(new bn(1))
  witness.push(commitScript.toRaw())
  witness.compile()
  return witness
}

util.commitSpendNoDelay = function commitSpendNoDelay (commitScript, commitPriv, sweep) {
  var pkh = bcoin.script.fromPubkeyhash(commitScript.get(1))
  var sig = sweep.signature(0, pkh, commitPriv, hashType.ALL, 1)
  var witness = new bcoin.witness()
  witness.push(sig)
  witness.push(bcoin.ec.publicKeyCreate(commitPriv, true))
  witness.compile()
  return witness
}

util.deriveRevPub = function (commitPub, revImage) {
  return bcoin.ec.publicKeyTweakAdd(commitPub, revImage, true)
}

util.deriveRevPriv = function (commitPriv, revImage) {
  return bcoin.ec.privateKeyTweakAdd(commitPriv, revImage)
}

util.deriveElkremRoot = function (localKey, remoteKey) {
  var secret = localKey // private
  var salt = remoteKey // public
  var info = new Buffer('elkrem', 'ascii')
  var prk = crypto.hkdfExtract(secret, salt, 'sha256')
  var root = crypto.hkdfExpand(prk, info, 32, 'sha256')
  return root
}

util.createCommitTX = function (
  fundingOutput, selfKey, theirKey, revKey,
  csvTimeout, valueToSelf, valueToThem
) {
  var ourRedeem = util.commitSelf(csvTimeout, selfKey, revKey)
  var payToUs = util.toWitnessScripthash(ourRedeem)
  var payToThem = util.commitUnencumbered(theirKey)
  var tx = new bcoin.mtx()
  var output

  tx.version = 2
  tx.addInput(fundingOutput)

  if (valueToSelf > 0) {
    output = new bcoin.output()
    output.value = valueToSelf
    output.script = payToUs
    tx.addOutput(output)
  }

  if (valueToThem > 0) {
    output = new bcoin.output()
    output.value = valueToThem
    output.script = payToThem
    tx.addOutput(output)
  }

  return tx
}

util.createCooperativeClose = function createCooperativeClose (
  fundingInput, ourBalance, theirBalance,
  ourDeliveryScript, theirDeliveryScript,
  initiator
) {
  var tx = new bcoin.mtx()
  var output

  tx.addInput(fundingInput)

  if (initiator) { ourBalance -= 5000 } else { theirBalance -= 5000 }

  if (ourBalance > 0) {
    output = new bcoin.output()
    output.script = ourDeliveryScript
    output.value = ourBalance
    tx.addOutput(output)
  }

  if (theirBalance > 0) {
    output = new bcoin.output()
    output.script = theirDeliveryScript
    output.value = theirBalance
    tx.addOutput(output)
  }

  tx.sortMembers()

  return tx
}
