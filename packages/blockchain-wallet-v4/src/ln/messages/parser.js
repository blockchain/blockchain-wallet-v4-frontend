import TYPE from './types'
import * as Reader from './serializer'

export function appendType (data, message) {
  return {
    type: getType(data),
    message
  }
}

export function readMessage (data) {
  return getDeserializer(data)(Reader.wrapBuffer(getPayload(data)))
}

export function writeMessage (msg) {
  return Reader.unwrapBuffer(getSerializer(msg)(msg))
}

export let getDeserializer = (data) => {
  switch (getType(data)) {
    case TYPE.INIT: return Reader.readInit
    case TYPE.ERROR: return Reader.readError
    case TYPE.PING: return Reader.readPing
    case TYPE.PONG: return Reader.readPong

    case TYPE.OPEN_CHANNEL: return Reader.readOpenChannel
    case TYPE.ACCEPT_CHANNEL: return Reader.readAcceptChannel
    case TYPE.FUNDING_CREATED: return Reader.readFundingCreated
    case TYPE.FUNDING_SIGNED: return Reader.readFundingSigned
    case TYPE.FUNDING_LOCKED: return Reader.readFundingLocked

    case TYPE.SHUTDOWN: return Reader.readShutdown
    case TYPE.CLOSING_SIGNED: return Reader.readClosingSigned

    case TYPE.UPDATE_ADD_HTLC: return Reader.readUpdateAddHtlc
    case TYPE.UPDATE_FULFILL_HTLC: return Reader.readUpdateFulfillHtlc
    case TYPE.UPDATE_FAIL_HTLC: return Reader.readUpdateFailHtlc
    case TYPE.UPDATE_FAIL_MALFORMED_HTLC: return Reader.readUpdateFailMalformedHtlc

    case TYPE.COMMITMENT_SIGNED: return Reader.readCommitmentSigned
    case TYPE.REVOKE_AND_ACK: return Reader.readRevokeAndAck

    case TYPE.UPDATE_FEE: return Reader.readUpdateFee
    case TYPE.CHANNEL_REESTABLISH: return Reader.readChannelReestablish

    default: throw new Error('Unknown message: ' + getType(data) + ':' + getPayload(data).toString('hex'))
  }
}

export let getSerializer = (data) => {
  switch (data.type) {
    case TYPE.INIT: return Reader.writeInit
    case TYPE.ERROR: return Reader.writeError
    case TYPE.PING: return Reader.writePing
    case TYPE.PONG: return Reader.writePong

    case TYPE.OPEN_CHANNEL: return Reader.writeOpenChannel
    case TYPE.ACCEPT_CHANNEL: return Reader.writeAcceptChannel
    case TYPE.FUNDING_CREATED: return Reader.writeFundingCreated
    case TYPE.FUNDING_SIGNED: return Reader.writeFundingSigned
    case TYPE.FUNDING_LOCKED: return Reader.writeFundingLocked

    case TYPE.SHUTDOWN: return Reader.writeShutdown
    case TYPE.CLOSING_SIGNED: return Reader.writeClosingSigned

    case TYPE.UPDATE_ADD_HTLC: return Reader.writeUpdateAddHtlc
    case TYPE.UPDATE_FULFILL_HTLC: return Reader.writeUpdateFulfillHtlc
    case TYPE.UPDATE_FAIL_HTLC: return Reader.writeUpdateFailHtlc
    case TYPE.UPDATE_FAIL_MALFORMED_HTLC: return Reader.writeUpdateFailMalformedHtlc

    case TYPE.COMMITMENT_SIGNED: return Reader.writeCommitmentSigned
    case TYPE.REVOKE_AND_ACK: return Reader.writeRevokeAndAck

    case TYPE.UPDATE_FEE: return Reader.writeUpdateFee
    case TYPE.CHANNEL_REESTABLISH: return Reader.writeChannelReestablish

    default: throw new Error('Unknown message: ' + data.type + ':' + JSON.stringify(data))
  }
}

function getType (data) {
  return data.readInt16BE(0)
}

function getPayload (data) {
  return data.slice(2)
}
