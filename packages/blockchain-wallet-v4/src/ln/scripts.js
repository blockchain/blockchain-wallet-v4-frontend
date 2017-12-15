import * as SCRIPT from 'bitcoinjs-lib/src/script'
import * as hash from 'bcoin/lib/crypto/digest'

import * as OPS from 'bitcoin-ops'
import {sigToBitcoin, assertNumber, assertPubKey, assertSignature, wrapHex} from './helper'

const assert = require('assert')

let OP_CSV = 178

let intToNum = num => {
  assertNumber(num)
  let b = null

  if (num < 65536) {
    b = Buffer.alloc(2)
    b.writeInt16LE(num)
  } else if (num < 4294967296) {
    b = Buffer.alloc(4)
    b.writeInt32LE(num)
  } else {
    throw new Error('Number too big: ' + num)
  }

  return b
}

export let getP2PKHScript = pubkey => {
  assertPubKey(pubkey)
  let chunks = []
  chunks.push(OPS.OP_DUP)
  chunks.push(OPS.OP_HASH160)
  chunks.push(hash.ripemd160(hash.sha256(pubkey)))
  chunks.push(OPS.OP_EQUALVERIFY)
  chunks.push(OPS.OP_CHECKSIG)
  return SCRIPT.compile(chunks)
}

export let getP2WPKHScript = pubkey => {
  assertPubKey(pubkey)

  let chunks = []
  chunks.push(OPS.OP_0)
  chunks.push(hash.ripemd160(hash.sha256(pubkey)))
  return SCRIPT.compile(chunks)
}

export let getP2WPKHRedeemScript = (pubkey, signature) => {
  assertPubKey(pubkey)
  assertSignature(signature)

  return [sigToBitcoin(signature), pubkey]
}

export let getFundingOutputScript = (fundingKeyLocal, fundingKeyRemote) => {
  // 2 <key1> <key2> 2 OP_CHECKMULTISIG
  assertPubKey(fundingKeyLocal)
  assertPubKey(fundingKeyRemote)

  let chunks = []
  chunks.push(OPS.OP_2)

  if (Buffer.compare(fundingKeyLocal, fundingKeyRemote) < 0) {
    chunks.push(fundingKeyLocal)
    chunks.push(fundingKeyRemote)
  } else {
    chunks.push(fundingKeyRemote)
    chunks.push(fundingKeyLocal)
  }

  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)
  return SCRIPT.compile(chunks)
}

export let getFundingRedeemScript = (key1, key2, sig1, sig2) => {
  assertPubKey(key1)
  assertPubKey(key2)
  assertSignature(sig1)
  assertSignature(sig2)

  sig1 = sigToBitcoin(sig1)
  sig2 = sigToBitcoin(sig2)

  let chunks = []
  chunks.push([])

  if (Buffer.compare(key1, key2) < 0) {
    chunks.push(sig1)
    chunks.push(sig2)
  } else {
    chunks.push(sig2)
    chunks.push(sig1)
  }

  chunks.push(getFundingOutputScript(key1, key2))
  return chunks
}

export let getToLocalOutputScript = (revocationKey, toSelfDelay, localDelayedKey) => {
  // OP_IF
  //   # Penalty transaction
  //   <revocationkey>
  // OP_ELSE
  //   `to_self_delay`
  //   OP_CSV
  //   OP_DROP
  //   <local_delayedkey>
  // OP_ENDIF
  // OP_CHECKSIG
  assertPubKey(revocationKey)
  assertPubKey(localDelayedKey)
  assertNumber(toSelfDelay)

  let chunks = []

  chunks.push(OPS.OP_IF)
  chunks.push(revocationKey)
  chunks.push(OPS.OP_ELSE)
  chunks.push(intToNum(toSelfDelay))
  chunks.push(OP_CSV)
  chunks.push(OPS.OP_DROP)
  chunks.push(localDelayedKey)
  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_CHECKSIG)

  return SCRIPT.compile(chunks)
}

export let getToRemoteOutputScript = (remoteKey) => {
  // This output sends funds to the other peer, thus is a simple P2WPKH to remotekey.
  assertPubKey(remoteKey)

  let chunks = []

  let sha = hash.sha256(remoteKey)
  let rip = hash.ripemd160(sha)

  chunks.push(OPS.OP_0)
  chunks.push(rip)

  return SCRIPT.compile(chunks)
}

export let hash160 = (data) => {
  let sha = hash.sha256(data)
  return hash.ripemd160(sha)
}

export let getOfferedHTLCOutput = (revocationKey, remoteHtlcKey, localHtlcKey, paymentHash) => {
  // # To you with revocation key
  //   OP_DUP OP_HASH160 <RIPEMD160(SHA256(revocationkey))> OP_EQUAL
  //   OP_IF
  //     OP_CHECKSIG
  //   OP_ELSE
  //     <remote_htlckey> OP_SWAP OP_SIZE 32 OP_EQUAL
  //     OP_NOTIF
  //       # To me via HTLC-timeout transaction (timelocked).
  //       OP_DROP 2 OP_SWAP <local_htlckey> 2 OP_CHECKMULTISIG
  //     OP_ELSE
  //       # To you with preimage.
  //       OP_HASH160 <RIPEMD160(payment_hash)> OP_EQUALVERIFY
  //       OP_CHECKSIG
  //     OP_ENDIF
  //   OP_ENDIF
  assertPubKey(remoteHtlcKey)
  assertPubKey(localHtlcKey)
  assertPubKey(revocationKey)
  assert.equal(paymentHash.length, 20)

  let chunks = []

  chunks.push(OPS.OP_DUP)
  chunks.push(OPS.OP_HASH160)
  chunks.push(hash160(revocationKey))
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(remoteHtlcKey)
  chunks.push(OPS.OP_SWAP)
  chunks.push(OPS.OP_SIZE)
  chunks.push(wrapHex('20')) // Push <32> onto the stack
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_NOTIF)

  chunks.push(OPS.OP_DROP)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_SWAP)
  chunks.push(localHtlcKey)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(OPS.OP_HASH160)
  chunks.push(paymentHash)
  chunks.push(OPS.OP_EQUALVERIFY)
  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_ENDIF)

  return SCRIPT.compile(chunks)
}

export let getReceivedHTLCOutput = (revocationKey, remoteHtlcKey, localHtlcKey, paymentHash, cltvTimeout) => {
  // # To you with revocation key
  // OP_DUP OP_HASH160 <RIPEMD160(SHA256(revocationkey))> OP_EQUAL
  // OP_IF
  //   OP_CHECKSIG
  // OP_ELSE
  //   <remotekey> OP_SWAP
  //   OP_SIZE 32 OP_EQUAL
  //   OP_IF
  //     # To me via HTLC-success transaction.
  //     OP_HASH160 <RIPEMD160(payment_hash)> OP_EQUALVERIFY
  //     2 OP_SWAP <localkey> 2 OP_CHECKMULTISIG
  //   OP_ELSE
  //     # To you after timeout.
  //     OP_DROP <cltv_expiry> OP_CHECKLOCKTIMEVERIFY OP_DROP
  //     OP_CHECKSIG
  //   OP_ENDIF
  // OP_ENDIF
  assertPubKey(remoteHtlcKey)
  assertPubKey(localHtlcKey)
  assertPubKey(revocationKey)
  assertNumber(cltvTimeout)
  assert.equal(paymentHash.length, 20)

  let chunks = []

  chunks.push(OPS.OP_DUP)
  chunks.push(OPS.OP_HASH160)
  chunks.push(hash160(revocationKey))
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(remoteHtlcKey)
  chunks.push(OPS.OP_SWAP)
  chunks.push(OPS.OP_SIZE)
  chunks.push(wrapHex('20')) // Push <32> onto the stack
  chunks.push(OPS.OP_EQUAL)

  chunks.push(OPS.OP_IF)

  chunks.push(OPS.OP_HASH160)
  chunks.push(paymentHash)
  chunks.push(OPS.OP_EQUALVERIFY)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_SWAP)
  chunks.push(localHtlcKey)
  chunks.push(OPS.OP_2)
  chunks.push(OPS.OP_CHECKMULTISIG)

  chunks.push(OPS.OP_ELSE)

  chunks.push(OPS.OP_DROP)
  chunks.push(intToNum(cltvTimeout))
  chunks.push(OPS.OP_CHECKLOCKTIMEVERIFY)
  chunks.push(OPS.OP_DROP)
  chunks.push(OPS.OP_CHECKSIG)

  chunks.push(OPS.OP_ENDIF)
  chunks.push(OPS.OP_ENDIF)

  return SCRIPT.compile(chunks)
}

export let getHTLCFollowUpTx = (revocationKey, toSelfDelay, delayedKeyLocal) => {
  // OP_IF
  //   # Penalty transaction
  //   <revocationkey>
  // OP_ELSE
  //   `to_self_delay`
  //   OP_CSV
  //   OP_DROP
  //   <local_delayedkey>
  // OP_ENDIF
  // OP_CHECKSIG
  assertPubKey(revocationKey)
  assertPubKey(delayedKeyLocal)
  assertNumber(toSelfDelay)

  let chunks = []

  chunks.push(OPS.OP_IF)

  chunks.push(revocationKey)

  chunks.push(OPS.OP_ELSE)

  chunks.push(intToNum(toSelfDelay))
  chunks.push(OP_CSV)
  chunks.push(OPS.OP_DROP)
  chunks.push(delayedKeyLocal)

  chunks.push(OPS.OP_ENDIF)

  chunks.push(OPS.OP_CHECKSIG)

  return SCRIPT.compile(chunks)
}

export let wrapP2WSH = (script) => {
  let sha = hash.sha256(script)

  let chunks = []

  chunks.push(OPS.OP_0)
  chunks.push(sha)

  return SCRIPT.compile(chunks)
}
