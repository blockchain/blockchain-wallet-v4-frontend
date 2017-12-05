
import {BufHelper} from './bufhelper'
import TYPE from './types'

// All methods require the data to be passed in using a `BufHelper` instance
export function wrapBuffer (data) {
  return new BufHelper(data)
}

export function unwrapBuffer (data) {
  return data.buffer
}

function createBuffer (len) {
  return new BufHelper(Buffer.alloc(len))
}

function createMessageBuffer (msg, len) {
  return createBuffer(len + 2).write16(msg.type)
}

// Operational messages
// Init
export let Init = (gf, lf) =>
                 ({gf, lf, type: TYPE.INIT})

export function readInit (buf) {
  return Init(
    buf.readWithLen(),
    buf.readWithLen())
}
export function writeInit (msg) {
  return createMessageBuffer(msg, 4 + msg.gf.length + msg.lf.length)
    .writeWithLen(msg.gf)
    .writeWithLen(msg.lf)
}

// Error
export let Error = (channelId, data) =>
                  ({channelId, data, type: TYPE.ERROR})

export function readError (buf) {
  return Error(
    buf.read(32),
    buf.readWithLen())
}
export function writeError (msg) {
  return createMessageBuffer(msg, 32 + 2 + msg.data.length)
    .write(msg.channelId)
    .writeWithLen(msg.data)
}

// Ping
export let Ping = (byteslen, numPongBytes) =>
                 ({byteslen, numPongBytes, type: TYPE.PING})

export function readPing (buf) {
  let numPongBytes = buf.read16()
  let byteslen = buf.read16()

  // Just make sure there's actually enough bytes in the buffer
  buf.read(byteslen)

  return Ping(byteslen, numPongBytes)
}

export function writePing (msg) {
  return createMessageBuffer(msg, 2 + 2 + msg.byteslen)
    .write16(msg.numPongBytes)
    .write16(msg.byteslen)
    .write(Buffer.alloc(msg.byteslen))
}

// Pong
export let Pong = (byteslen) =>
                 ({byteslen, type: TYPE.PONG})

export function readPong (buf) {
  let byteslen = buf.read16()

  // Just make sure there's actually enough bytes in the buffer
  buf.read(byteslen)

  return Pong(byteslen)
}
export function writePong (msg) {
  return createMessageBuffer(msg, 2 + msg.byteslen)
    .write16(msg.byteslen)
    .write(Buffer.alloc(msg.byteslen))
}

// Opening and closing channels
// OpenChannel
export let OpenChannel =
  (chainHash,
   temporaryChannelId,
   fundingSatoshi,
   pushMsat,
   dustLimitSatoshis,
   maxHtlcValueInFlightMsat,
   channelReserveSatoshis,
   htlcMinimumMsat,
   feeratePerKw,
   toSelfDelay,
   maxAcceptedHtlcs,
   fundingPubkey,
   revocationBasepoint,
   paymentBasepoint,
   delayedPaymentBasepoint,
   firstPerCommitmentPoint,
   channelFlags) => {
    return ({
      chainHash,
      temporaryChannelId: channelId,
      fundingSatoshi,
      pushMsat,
      dustLimitSatoshis,
      maxHtlcValueInFlightMsat,
      channelReserveSatoshis,
      htlcMinimumMsat,
      feeratePerKw,
      toSelfDelay,
      maxAcceptedHtlcs,
      fundingPubkey,
      revocationBasepoint,
      paymentBasepoint,
      delayedPaymentBasepoint,
      firstPerCommitmentPoint,
      channelFlags,
      type: TYPE.OPEN_CHANNEL
    })
  }

export function readOpenChannel (buf) {
  return OpenChannel(
    buf.read(32),
    buf.read(32),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read32(),
    buf.read16(),
    buf.read16(),
    buf.read(33),
    buf.read(33),
    buf.read(33),
    buf.read(33),
    buf.read(33),
    buf.read(1))
}

export function writeOpenChannel (msg) {
  return createMessageBuffer(msg, 286)
    .write(msg.chainHash)
    .write(msg.channelId)
    .write64(msg.fundingSatoshi)
    .write64(msg.pushMsat)
    .write64(msg.dustLimitSatoshis)
    .write64(msg.maxHtlcValueInFlightMsat)
    .write64(msg.channelReserveSatoshis)
    .write64(msg.htlcMinimumMsat)
    .write32(msg.feeratePerKw)
    .write16(msg.toSelfDelay)
    .write16(msg.maxAcceptedHtlcs)
    .write(msg.fundingPubkey)
    .write(msg.revocationBasepoint)
    .write(msg.paymentBasepoint)
    .write(msg.delayedPaymentBasepoint)
    .write(msg.firstPerCommitmentPoint)
    .write(msg.channelFlags)
}

// Accept channel
export let AcceptChannel =
(temporaryChannelId,
 dustLimitSatoshis,
 maxHtlcValueInFlightMsat,
 channelReserveSatoshis,
 htlcMinimumMsat,
 minimumDepth,
 toSelfDelay,
 maxAcceptedHtlcs,
 fundingPubkey,
 revocationBasepoint,
 paymentBasepoint,
 delayedPaymentBasepoint,
 firstPerCommitmentPoint) => ({
   temporaryChannelId,
   dustLimitSatoshis,
   maxHtlcValueInFlightMsat,
   channelReserveSatoshis,
   htlcMinimumMsat,
   minimumDepth,
   toSelfDelay,
   maxAcceptedHtlcs,
   fundingPubkey,
   revocationBasepoint,
   paymentBasepoint,
   delayedPaymentBasepoint,
   firstPerCommitmentPoint,
   type: TYPE.ACCEPT_CHANNEL})

export function readAcceptChannel (buf) {
  return AcceptChannel(
    buf.read(32),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read64(),
    buf.read32(),
    buf.read16(),
    buf.read16(),
    buf.read(33),
    buf.read(33),
    buf.read(33),
    buf.read(33),
    buf.read(33))
}
export function writeAcceptChannel (msg) {
  return createMessageBuffer(msg, 237)
    .write(msg.channelId)
    .write64(msg.dustLimitSatoshis)
    .write64(msg.maxHtlcValueInFlightMsat)
    .write64(msg.channelReserveSatoshis)
    .write64(msg.htlcMinimumMsat)
    .write32(msg.minimumDepth)
    .write16(msg.toSelfDelay)
    .write16(msg.maxAcceptedHtlcs)
    .write(msg.fundingPubkey)
    .write(msg.revocationBasepoint)
    .write(msg.paymentBasepoint)
    .write(msg.delayedPaymentBasepoint)
    .write(msg.firstPerCommitmentPoint)
}

// FundingCreated
export let FundingCreated = (temporaryChannelId, fundingTxid, fundingOutputIndex, signature) =>
                           ({temporaryChannelId, fundingTxid, fundingOutputIndex, signature, type: TYPE.FUNDING_CREATED})

export function readFundingCreated (buf) {
  return FundingCreated(
    buf.read(32),
    buf.read(32),
    buf.read16(),
    buf.read(64))
}
export function writeFundingCreated (msg) {
  return createMessageBuffer(msg, 130)
    .write(msg.channelId)
    .write(msg.fundingTxid)
    .write16(msg.fundingOutputIndex)
    .write(msg.signature)
}

// FundingSigned
export let FundingSigned = (channelId, signature) =>
                          ({channelId, signature, type: TYPE.FUNDING_SIGNED})

export function readFundingSigned (buf) {
  return new FundingSigned(
    buf.read(32),
    buf.read(64))
}

export function writeFundingSigned (msg) {
  return createMessageBuffer(msg, 96)
    .write(msg.channelId)
    .write(msg.signature)
}

// FundingLocked
export let FundingLocked = (channelId, nextPerCommitmentPoint) =>
                          ({channelId, nextPerCommitmentPoint, type: TYPE.FUNDING_LOCKED})

export function readFundingLocked (buf) {
  return FundingLocked(
    buf.read(32),
    buf.read(33))
}

export function writeFundingLocked (msg) {
  return createMessageBuffer(msg, 65)
    .write(msg.channelId)
    .write(msg.nextPerCommitmentPoint)
}

// Shutdown
export let Shutdown = (channelId, scriptPubKey) =>
                     ({channelId, scriptPubKey, type: TYPE.SHUTDOWN})

export function readShutdown (buf) {
  return Shutdown(
    buf.read(32),
    buf.readWithLen()
  )
}
export function writeShutdown (msg) {
  return createMessageBuffer(msg, 32 + msg.scriptPubKey.length)
    .write(msg.channelId)
    .writeWithLen(msg.scriptPubKey)
}

// ClosingSigned
export let ClosingSigned = (channelId, feeSatoshi, signature) =>
                          ({channelId, feeSatoshi, signature, type: TYPE.CLOSING_SIGNED})

export function readClosingSigned (buf) {
  return ClosingSigned(
    buf.read(32),
    buf.read64(),
    buf.read(64)
  )
}
export function writeClosingSigned (msg) {
  return createMessageBuffer(msg, 104)
    .write(msg.channelId)
    .write64(msg.feeSatoshi)
    .write(msg.signature)
}

// Payments
// UpdateAddHtlc
export let UpdateAddHtlc = (channelId, id, amountMsat, paymentHash, cltvTimeout, onionRoutingPackage) =>
                          ({channelId, id, amountMsat, paymentHash, cltvTimeout, onionRoutingPackage, type: TYPE.UPDATE_ADD_HTLC})

export function readUpdateAddHtlc (buf) {
  return UpdateAddHtlc(
    buf.read(32),
    buf.read64(),
    buf.read64(),
    buf.read(32),
    buf.read32(),
    buf.read(1366))
}
export function writeUpdateAddHtlc (msg) {
  return createMessageBuffer(msg, 1450)
    .write(msg.channelId)
    .write64(msg.id)
    .write64(msg.amountMsat)
    .write(msg.paymentHash)
    .write32(msg.cltvTimeout)
    .write(msg.onionRoutingPacket)
}

// UpdateFulfillHtlc
export let UpdateFulfillHtlc = (channelId, id, paymentPreimage) =>
                              ({channelId, id, paymentPreimage, type: TYPE.UPDATE_FULFILL_HTLC})

export function readUpdateFulfillHtlc (buf) {
  return UpdateFulfillHtlc(
    buf.read(32),
    buf.read64(),
    buf.read(32))
}
export function writeUpdateFulfillHtlc (msg) {
  return createMessageBuffer(msg, 1450)
    .write(msg.channelId)
    .write64(msg.id)
    .write(msg.paymentPreimage)
}

// UpdateFailHtlc
export let UpdateFailHtlc = (channelId, id, reason) =>
                           ({channelId, id, reason, type: TYPE.UPDATE_FAIL_HTLC})

export function readUpdateFailHtlc (buf) {
  return UpdateFailHtlc(
    buf.read(32),
    buf.read64(),
    buf.readWithLen())
}
export function writeUpdateFailHtlc (msg) {
  return createMessageBuffer(msg, 40 + msg.reason.length)
    .write(msg.channelId)
    .write64(msg.id)
    .writeWithLen(msg.reason)
}

// UpdateMalformedHtlc
export let UpdateMalformedHtlc = (channelId, id, sha256OfOnion, failureCode) =>
                                ({channelId, id, sha256OfOnion, failureCode, type: TYPE.UPDATE_FAIL_MALFORMED_HTLC})

export function readUpdateFailMalformedHtlc (buf) {
  return new UpdateMalformedHtlc(
    buf.read(32),
    buf.read64(),
    buf.read(32),
    buf.read16())
}
export function writeUpdateMalformedHtlc (msg) {
  return createMessageBuffer(msg, 74)
    .write(msg.channelId)
    .write64(msg.id)
    .write(msg.sha256OfOnion)
    .write16(msg.failureCode)
}

// CommitmentSigned
export let CommitmentSigned = (channelId, signature, numHtlcs, htlcSignature) =>
                             ({channelId, signature, numHtlcs, htlcSignature, type: TYPE.COMMITMENT_SIGNED})

export function readCommitmentSigned (buf) {
  let channelId = buf.read(32)
  let signature = buf.read(64)
  let len = buf.read16()
  let signatures = buf.read(len * 64)

  return CommitmentSigned(
    channelId,
    signature,
    len,
    signatures)
}
export function writeCommitSigned (msg) {
  return createMessageBuffer(msg, 98 + msg.numHtlcs * 64)
    .write(msg.channelId)
    .write(msg.signature)
    .write16(msg.numHtlcs)
    .write(msg.htlcSignature)
}

// RevokeAndAck
export let RevokeAndAck = (channelId, perCommitmentSecret, nextPerCommitmentPoint) =>
                        ({ channelId, perCommitmentSecret, nextPerCommitmentPoint, type: TYPE.REVOKE_AND_ACK })

export function readRevokeAndAck (buf) {
  return RevokeAndAck(
    buf.read(32),
    buf.read(32),
    buf.read(33))
}
export function writeRevokeAndAck (msg) {
  return createMessageBuffer(msg, 97)
    .write(msg.channelId)
    .write(msg.perCommitmentSecret)
    .write(msg.nextPerCommitmentPoint)
}

// UpdateFee
export let UpdateFee = (channelId, feeratePerKw) =>
                     ({ channelId, feeratePerKw, type: TYPE.UPDATE_FEE })
export function readUpdateFee (buf) {
  return UpdateFee(
    buf.read(32),
    buf.read32())
}
export function writeUpdateFee (msg) {
  return createMessageBuffer(msg, 36)
    .write(msg.channelId)
    .write32(msg.feeratePerKw)
}

// ChannelReestablish
export let ChannelReestablish = (channelId, nextLocalCommitmentNumber, nextRemoteRevocationNumber) =>
                              ({ channelId, nextLocalCommitmentNumber, nextRemoteRevocationNumber, type: TYPE.CHANNEL_REESTABLISH })

export function readChannelReestablish (buf) {
  return ChannelReestablish(
    buf.read(32),
    buf.read64(),
    buf.read64())
}

export function writeChannelReestablish (msg) {
  return createMessageBuffer(msg, 48)
    .write(msg.channelId)
    .write(msg.nextLocalCommitmentNumber)
    .write(msg.nextRemoteRevocationNumber)
}
