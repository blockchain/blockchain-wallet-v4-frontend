'use strict'

let ec = require('secp256k1')
let sha = require('sha256')
let chacha20 = require('chacha20')
let crypto = require('crypto')

const NUM_MAX_HOPS = 20
const HOP_DATA_SIZE = 65
const ROUTING_INFO_SIZE = NUM_MAX_HOPS * HOP_DATA_SIZE

const INVALID_ONION_VERSION = 4
const INVALID_ONION_HMAC = 5
const INVALID_ONION_KEY = 6

function computeBlindingFactor (ephemeralPubKey, sharedSecret) {
  return Buffer.from(sha(Buffer.concat([ephemeralPubKey, sharedSecret])), 'hex')
}

function blindGroupElements (ephemeralPubKey, prevBlindingFactor) {
  return ec.publicKeyTweakMul(ephemeralPubKey, prevBlindingFactor)
}

function generateKey (key, sharedSecret) {
  return generateHmac(key, sharedSecret)
}

function generateCipherStream (streamKey, cipherSize) {
  let nonce = Buffer.alloc(8)
  let data = Buffer.alloc(cipherSize)
  return chacha20.encrypt(streamKey, nonce, data)
}

function generateHeaderPadding (key, numHops, hopsSharedSecret) {
  let fillerSize = (numHops - 1) * HOP_DATA_SIZE
  let filler = Buffer.alloc(fillerSize)
  let cipherStreamSize = (NUM_MAX_HOPS + 1) * HOP_DATA_SIZE

  for (let i = 1; i < numHops; i++) {
    let streamKey = generateKey(key, hopsSharedSecret[i - 1])
    let streamBytes = generateCipherStream(streamKey, cipherStreamSize)
    let pos = (NUM_MAX_HOPS - i + 1) * HOP_DATA_SIZE
    xorBytes(filler, filler, streamBytes.slice(pos), streamBytes.length - pos)
  }
  return filler
}

function xorBytes (dst, src1, src2, size) {
  for (let i = 0; i < size; i++) {
    dst[i] = src1[i] ^ src2[i]
  }
}

function generateHopsParams (hopEphemeralPubKeys, hopSharedSecrets, hopBlindingFactors, paymentPath, sessionKey) {
  hopEphemeralPubKeys.push(ec.publicKeyCreate(sessionKey))
  hopSharedSecrets.push(ec.ecdh(paymentPath[0], sessionKey))
  hopBlindingFactors.push(computeBlindingFactor(hopEphemeralPubKeys[0], hopSharedSecrets[0]))

  for (let i = 1; i < paymentPath.length; i++) {
    hopEphemeralPubKeys.push(blindGroupElements(hopEphemeralPubKeys[i - 1], hopBlindingFactors[i - 1]))
    let tmp = blindGroupElements(paymentPath[i], sessionKey)
    for (let j = 0; j < i; j++) {
      tmp = blindGroupElements(tmp, hopBlindingFactors[j])
    }
    hopSharedSecrets.push(Buffer.from(sha(tmp), 'hex'))
    hopBlindingFactors.push(computeBlindingFactor(hopEphemeralPubKeys[i], hopSharedSecrets[i]))
  }
}
// HopsData is array of structs with fields:
// type : 1 byte
// data {
//   short_channel_id : 8 bytes
//   amt_to_forward: 8 bytes
//   outgoing_cltv_value: 4 bytes
//   padding: 12 bytes
// }
// hmac: 32 bytes
// this field is not filled in before the method called
// we generate this here.
// total 65 bytes == HOP_DATA_SIZE
function constructPacket (paymentPath, sessionKey, hopsData, associatedData) {
  let hopEphemeralPubKeys = []
  let hopSharedSecrets = []
  let hopBlindingFactors = []
  generateHopsParams(hopEphemeralPubKeys, hopSharedSecrets, hopBlindingFactors, paymentPath, sessionKey)

  let filler = generateHeaderPadding('rho', paymentPath.length, hopSharedSecrets)

  let nextHmac = Buffer.alloc(32)
  let hmacData = Buffer.alloc(ROUTING_INFO_SIZE)
  let routingInfo = Buffer.alloc(ROUTING_INFO_SIZE)
  for (let i = paymentPath.length - 1; i >= 0; i--) {
    let rhoKey = generateKey('rho', hopSharedSecrets[i])
    let muKey = generateKey('mu', hopSharedSecrets[i])

    hopsData[i].hmac = nextHmac

    let streamBytes = generateCipherStream(rhoKey, ROUTING_INFO_SIZE)
    let hmacDataLength = ROUTING_INFO_SIZE - hopsData[i].payload.length - hopsData[i].hmac.length
    routingInfo = Buffer.concat([hopsData[i].payload, hopsData[i].hmac, hmacData.slice(0, hmacDataLength)])

    xorBytes(routingInfo, routingInfo, streamBytes, ROUTING_INFO_SIZE)
    if (i === paymentPath.length - 1) {
      let len = (NUM_MAX_HOPS - paymentPath.length + 1) * HOP_DATA_SIZE
      for (let j = len; j < ROUTING_INFO_SIZE; j++) {
        routingInfo[j] = filler[j - len]
      }
    }

    hmacData = Buffer.concat([routingInfo, associatedData])
    nextHmac = Buffer.from(crypto.createHmac('SHA256', Buffer.from(muKey)).update(Buffer.from(hmacData)).digest('hex'), 'hex')
  }

  let packet = Buffer.concat([Buffer.alloc(1), hopEphemeralPubKeys[0], routingInfo, nextHmac])

  return packet
}

function generateSharedSecret (privateKey, publicKey) {
  return ec.ecdh(publicKey, privateKey)
}

function generateErrorMessage(errorCode, onionPacket) {
  let errorMessage = Buffer.alloc(1)
  errorMessage[0] = errorCode
  errorMessage = Buffer.concat([errorMessage, Buffer.from(sha(onionPacket))])
  return {
    'error': errorMessage
  }
}
function unwrapPacket (packet, privateKey, associatedData) {
  let version = packet[0]

  if (version !== 0) {
    return generateErrorMessage(INVALID_ONION_VERSION, packet)
  }


  let pubKey = packet.slice(1, 34)
  if (!ec.publicKeyVerify(pubKey)) { //  check pub key
    return generateErrorMessage(INVALID_ONION_KEY, packet)
  }

  let sharedSecret = generateSharedSecret(privateKey, pubKey)

  let routingInfo = packet.slice(34, 34 + ROUTING_INFO_SIZE)

  let hmac = packet.slice(34 + ROUTING_INFO_SIZE)

  let muKey = generateKey('mu', sharedSecret)

  let hmacExpected = generateHmac(muKey, Buffer.concat([routingInfo, associatedData]))

  if (Buffer.compare(hmac, hmacExpected) !== 0) {
    return generateErrorMessage(INVALID_ONION_HMAC, packet)
  }

  let rhoKey = generateKey('rho', sharedSecret)
  let streamBytes = generateCipherStream(rhoKey, (NUM_MAX_HOPS + 1) * HOP_DATA_SIZE)

  routingInfo = Buffer.concat([routingInfo, Buffer.alloc(HOP_DATA_SIZE)])
  xorBytes(routingInfo, routingInfo, streamBytes, (NUM_MAX_HOPS + 1) * HOP_DATA_SIZE)

  let payload = routingInfo.slice(0, 33)
  let newHmac = routingInfo.slice(33, 65)
  routingInfo = routingInfo.slice(65)

  let blindingFactor = computeBlindingFactor(pubKey, sharedSecret)
  let nextEphemeralKey = blindGroupElements(pubKey, blindingFactor)

  let nextRoutingInfo = Buffer.concat([Buffer.alloc(1), nextEphemeralKey, routingInfo, newHmac])

  let result = {
    nextPacket: nextRoutingInfo,
    hopsData: payload
  }

  return result
}

function generateHmac (key, data) {
  return Buffer.from(crypto.createHmac('SHA256', Buffer.from(key)).update(Buffer.from(data)).digest('hex'), 'hex')
}

function constructErrorPacket (payload, sharedSecret) {
  let umKey = generateKey('um', sharedSecret)
  let hmac = generateHmac(umKey, payload)

  let packet = Buffer.concat([hmac, payload])

  wrapErrorPacket(packet, sharedSecret)
  return packet
}

function wrapErrorPacket (packet, sharedSecret) {
  let ammagKey = generateKey('ammag', sharedSecret)
  let stream = generateCipherStream(ammagKey, 292)
  xorBytes(packet, packet, stream, packet.length)
}

function unwrapErrorPacket (packet, sharedSecrets) {
  for (let i = 0; i < sharedSecrets.length; i++) {
    wrapErrorPacket(packet, sharedSecrets[i])
  }
}

module.exports = {constructPacket: constructPacket,
  unwrapPacket: unwrapPacket,
  constructErrorPacket: constructErrorPacket,
  wrapErrorPacket: wrapErrorPacket,
  unwrapErrorPacket: unwrapErrorPacket,
  generateHopsParams: generateHopsParams,
  generateSharedSecret: generateSharedSecret,
  INVALID_ONION_VERSION: INVALID_ONION_VERSION,
  INVALID_ONION_HMAC: INVALID_ONION_HMAC,
  INVALID_ONION_KEY: INVALID_ONION_KEY}
