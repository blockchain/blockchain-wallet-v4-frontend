'use strict'
var bech32 = require('bech32')
var secp256k1 = require('secp256k1')
var sha256 = require('sha256')
var utf = require('text-encoding-utf-8')
let ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'
var GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

// pre-compute lookup table
let ALPHABET_MAP = {}
for (let z = 0; z < ALPHABET.length; z++) {
  let x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

let HASH_DATA_LENGTH = 52
let DEFAULT_EXPIRY_TIME = 3600
let PUBLIC_KEY_DATA_LENGTH = 53
let P2PKH_TAG = 17
let P2SH_TAG = 18
let DEFAULT_MIN_FINAL_EXPIRY_TIME = 9

const parse = (message) => {
  var parts = message.split('1')
  var prefix = parts[0]
  var data = parts[1]
  var result = {}
  result.prefix = prefix.slice(0, 4)
  if (prefix.length > 4) {
    var amountStr = prefix.slice(4, prefix.length)
    var multiplier = 1
    switch (amountStr[amountStr.length - 1]) {
      case 'm':
        multiplier = 0.001
        amountStr = amountStr.slice(0, amountStr.length - 1)
        break
      case 'u':
        multiplier = 0.000001
        amountStr = amountStr.slice(0, amountStr.length - 1)
        break
      case 'n':
        multiplier = 0.000000001
        amountStr = amountStr.slice(0, amountStr.length - 1)
        break
      case 'p':
        multiplier = 0.000000000001
        amountStr = amountStr.slice(0, amountStr.length - 1)
        break
    }

    var amount = 0
    for (var i = 0; i < amountStr.length; i++) {
      amount = amount * 10 + amountStr[i].charCodeAt() - '0'.charCodeAt()
    }
    result.amount = amount * multiplier
  }

  parseDataPart(data, result)
  let signature = bech32.fromWords(decodeData(data.slice(data.length - 110, data.length - 6)))
  let dataToSign = getDataToSign(prefix, data.slice(0, data.length - 110))
  // TODO if n field present
  let pubKey
  if (result.public_key !== undefined) {
    pubKey = Buffer.from(result.public_key)
    if (!secp256k1.verify(dataToSign, Buffer.from(signature.slice(0, signature.length - 1)), pubKey)) {
       throw new Error('Not a valid signature')
    }
  }
  pubKey = secp256k1.recover(dataToSign, Buffer.from(signature.slice(0, signature.length - 1)), signature[signature.length - 1], true)

  let checksum  = data.slice(data.length - 6, data.length)

  if (!verifyChecksum(prefix, decodeData(data))) {
    throw new Error('Not a valid checksum')
  }
  return {
    message: result,
    pubKey: pubKey
  }
}

function polymod (values) {
  var chk = 1;
  for (var p = 0; p < values.length; ++p) {
    var top = chk >> 25;
    chk = (chk & 0x1ffffff) << 5 ^ values[p];
    for (var i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }
  return chk;
}

function hrpExpand (hrp) {
  var ret = [];
  var p;
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5);
  }
  ret.push(0);
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31);
  }
  return ret;
}

function verifyChecksum (hrp, data) {
  return polymod(hrpExpand(hrp).concat(data)) === 1;
}

function createChecksum (hrp, data) {
  var values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  var mod = polymod(values) ^ 1;
  var ret = [];
  for (var p = 0; p < 6; ++p) {
    ret.push((mod >> 5 * (5 - p)) & 31);
  }
  return ret;
}

function getDataToSign(prefix, data) {
  let dataToSign = getUTF8(prefix).concat(wordsToBytes(decodeData(data), 5, 8))
  return Buffer.from(sha256(dataToSign), 'hex')
}

function bechToInt (data) {
  var result = 0
  for (var i = 0; i < data.length; i++) {
    result = (result << 5) + ALPHABET_MAP[data[i]]
  }
  return result
}

function parseDataPart (data, result) {
  result.timestamp = bechToInt(data.slice(0, 7))
  result.tags = parseTags(data.slice(7, data.length - 110))
}

function parseTags (tags) {
  var result = {}
  while (tags.length !== 0) {
    var type = tags[0]
    if (tags.length < 3) {
      throw new Error('No data length field')
    }
    var dataLength = ALPHABET_MAP[tags[1]] * 32 + ALPHABET_MAP[tags[2]]
    if (tags.length < dataLength + 3) {
      throw new Error('Not enough bits in data field')
    }
    var data = tags.slice(3, dataLength + 3)
    tags = tags.slice(dataLength + 3, tags.length)
    parseTag(type, dataLength, data, result)
  }

  checkResult(result)
  return result
}

function encodeData (data) {
  var result = ''
  for (let i = 0; i < data.length; i++) {
    result += ALPHABET[data[i]]
  }
  return result
}
function checkResult (result) {
  if (typeof (result.payment_hash) === 'undefined') {
    throw new Error('There should be exactly one payment hash tag!')
  }
}

function getDataLength (data) {
  return convert(data, 2)
}
function convert (data, fixedDataSize) {
  var shift = 30
  var result = ''
  while (shift >= 0) {
    if (result.length > 0 || shift === 0 || (data >> shift) & 31 > 0) {
      result += ALPHABET[(data >> shift) & 31]
    }
    shift -= 5
  }
  if (typeof (fixedDataSize) !== 'undefined') {
    for (var i = 0; i < fixedDataSize - result.length; i++) {
      result = 'q' + result
    }
  }
  return result
}

function encode (payment, privateKey) {
  var prefixPart = payment.prefix

  var amountStr = ''
  let multiplierStr = ''
  if (typeof (payment.amount) !== 'undefined') {
    var multiplier = 1
    while (Math.floor(multiplier * payment.amount) < payment.amount * multiplier) {
      multiplier *= 1000
    }

    switch (multiplier) {
      case 1: break
      case 1000:
        multiplierStr = 'm'
        break
      case 1000000:
        multiplierStr = 'u'
        break
      case 1000000000:
        multiplierStr = 'n'
        break
      case 1000000000000:
        multiplierStr = 'p'
        break
      default:
        console.error('wrong multipler value')
    }

    var value = multiplier * payment.amount
    while (value > 0) {
      amountStr = value % 10 + amountStr
      value = Math.floor(value / 10)
    }
  }

  prefixPart = prefixPart.concat(amountStr + multiplierStr)
  let result = prefixPart.concat('1')

  let dataPart = convert(payment.timestamp)
  dataPart = dataPart.concat(encodeTags(payment.tags))

  let signature = secp256k1.sign(getDataToSign(prefixPart, dataPart), privateKey)
  dataPart = dataPart.concat(encodeData(bech32.toWords(signature.signature)) + ALPHABET[signature.recovery])

  let checksum = createChecksum(prefixPart, decodeData(dataPart))

  result = result.concat(dataPart)
  result = result.concat(encodeData(checksum))
  return result
}
function wordsToBytes (data, inBits, outBits) {
  let value = 0
  let bits = 0
  let maxV = (1 << outBits) - 1

  let result = []
  for (let i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }

  return result
}

function getUTF8(prefix) {
  let result = []
  for (let i in prefix) {
    result.push(prefix[i].charCodeAt())
  }
  return result
}

function encodeTags (tags) {
  var result = ''

  if (typeof (tags.payment_hash) === 'undefined') {
    console.error('There should be exactly one payment hash tag')
  }

  if (typeof (tags.purpose_of_payment) !== 'undefined') {
    result = result.concat('h' + getDataLength(HASH_DATA_LENGTH) +
      encodeData(bech32.toWords(tags.purpose_of_payment)))
  }

  result = result.concat('p' + getDataLength(HASH_DATA_LENGTH))
  result = result.concat(encodeData(bech32.toWords(tags.payment_hash)))

  if (typeof (tags.description) !== 'undefined') {
    var description = encodeData(bech32.toWords(utf.TextEncoder('utf-8').encode(tags.description)))
    result = result.concat('d' + getDataLength(description.length) + description)
  }

  if (typeof (tags.public_key) !== 'undefined') {
    result = result.concat('n' + getDataLength(PUBLIC_KEY_DATA_LENGTH) +
      encodeData(bech32.toWords(tags.public_key)))
  }

  if (typeof (tags.expiry_time) !== 'undefined' && tags.expiry_time !== DEFAULT_EXPIRY_TIME) {
    let expiryTime = convert(tags.expiry_time)
    result = result.concat('x' + getDataLength(expiryTime.length) + expiryTime)
  }

  if (typeof (tags.min_cltv_expiry_time) !== 'undefined' && tags.min_cltv_expiry_time !== DEFAULT_MIN_FINAL_EXPIRY_TIME) {
    let minExpiryTime = convert(tags.min_cltv_expiry_time)
    result = result.concat('c' + getDataLength(minExpiryTime.length) + minExpiryTime)
  }

  if (typeof (tags.P2PKH) !== 'undefined') {
    let pkh = encodeData(bech32.toWords(tags.P2PKH))
    result = result.concat('f' + getDataLength(pkh.length + 1) + '3' + pkh)
  }

  if (typeof (tags.P2SH) !== 'undefined') {
    let sh = encodeData(bech32.toWords(tags.P2SH))
    result = result.concat('f' + getDataLength(sh.length + 1) + 'j' + sh)
  }

  if (typeof (tags.segwit) !== 'undefined') {
    let segwit = encodeData(bech32.toWords(tags.segwit.payload))
    result = result.concat('f' + getDataLength(segwit.length + 1) +
                            ALPHABET[tags.segwit.version] + segwit)
  }

  if (typeof (tags.route) !== 'undefined') {
    var bytes = Buffer.from([])
    for (var i = 0; i < tags.route.length; i++) {
      let node = tags.route[i]
      bytes = Buffer.concat([bytes, node.pubkey, node.short_channel_id])
      let a = []
      for (let i = 3; i >= 0; i--) {
        a.push((node.fee_base_msat >> (8 * i)) & 255)
      }
      for (let i = 3; i >= 0; i--) {
        a.push((node.fee_proportional_millionths >> (8 * i)) & 255)
      }
      for (let i = 1; i >= 0; i--) {
        a.push((node.cltv_expiry_delta >> (8 * i)) & 255)
      }
      bytes = Buffer.concat([bytes, Buffer.from(a)])
    }
    var routeStr = encodeData(bech32.toWords(bytes))
    result = result.concat('r', getDataLength(routeStr.length) + routeStr)
  }

  return result
}

function decodeData (data) {
  var result = []
  for (let i = 0; i < data.length; i++) {
    result.push(ALPHABET_MAP[data[i]])
  }
  return result
}

function parseTag (type, dataLength, data, result) {
  switch (type) {
    case 'p':
      if (dataLength !== HASH_DATA_LENGTH) {
        //console.error('data length should be 52 for payment hash, skipping')
        throw new Error("whawtever")
        return
      }
      if (typeof (result.payment_hash) !== 'undefined') {
        throw new Error('There should be exactly one payment hash tag, found two!')
      }
      if (data[51] !== 's' && data[51] !== 'q') {
        throw new Error('No padding 0')
      }
      result.payment_hash = Buffer.from(bech32.fromWords(decodeData(data)))
      break
    case 'd':
      if (typeof (result.description) !== 'undefined' ||
          typeof (result.purpose_of_payment) !== 'undefined') {
        throw new Error('There should be either exactly one d or one h field')
      }
      var a = bech32.fromWords(decodeData(data))
      result.description = utf.TextDecoder('utf-8').decode(Buffer.from(a))
      break
    case 'n':
      if (dataLength !== PUBLIC_KEY_DATA_LENGTH) {
        console.error('data length should be 53 for public key field, skipping')
        break
      }
      if (typeof (result.public_key) !== 'undefined') {
        console.error("already foudn 'n' field")
        return
      }
      if (ALPHABET_MAP[data[PUBLIC_KEY_DATA_LENGTH - 1]] % 2 !== 0) {
        throw new Error('No padding 0')
      }
      result.public_key = Buffer.from(bech32.fromWords(decodeData(data)))
      break
    case 'h':
      if (typeof (result.description) !== 'undefined' ||
          typeof (result.purpose_of_payment) !== 'undefined') {
        throw new Error('There should be either exactly one d or one h field')
      }
      if (dataLength !== HASH_DATA_LENGTH) {
        console.error('data length should be 52 for purpose of payment field, skipping')
        return
      }
      if (data[51] !== 's' && data[HASH_DATA_LENGTH - 1] !== 'q') {
        throw new Error('No padding 0')
      }
      result.purpose_of_payment = Buffer.from(bech32.fromWords(decodeData(data)))
      break
    case 'x':
      if (typeof (result.expiry_time) !== 'undefined') {
        throw new Error('Expiry time already set!')
      }
      if (data[0] === 'q') {
        throw new Error('Expiry time field should use minimum data length possible')
      }
      var expiryTime = 0
      for (var i = 0; i < data.length; i++) {
        expiryTime = expiryTime * 32 + ALPHABET_MAP[data[i]]
      }
      result.expiry_time = expiryTime
      break
    case 'f':
      var version = ALPHABET_MAP[data[0]]
      var payload = Buffer.from(bech32.fromWords(decodeData(data.slice(1, data.length))))
      switch (version) {
        case 0:
          result.segwit = {}
          result.segwit.version = version
          result.segwit.payload = payload
          break
        case P2PKH_TAG:
          result.P2PKH = payload
          break
        case P2SH_TAG:
          result.P2SH = payload
          break
        default:
          // TODO witness version 1-16?
      }
      break
    case 'r':
      var dataIn = bech32.fromWords(decodeData(data))
      while (dataIn.length > 0) {
        var next = dataIn.slice(0, 51)
        dataIn = dataIn.slice(51, dataIn.length)
        if (typeof (result.route) === 'undefined') {
          result.route = []
        }
        let fee_base_msat = 0
        for (let i = 41; i < 45; i++) {
          fee_base_msat = (fee_base_msat << 5) + next[i]
        }
        let fee_proportional_millionths = 0
        for (let i = 45; i < 49; i++) {
          fee_proportional_millionths = (fee_proportional_millionths << 5) + next[i]
        }
        result.route.push({
          'pubkey': Buffer.from(next.slice(0, 33)),
          'short_channel_id': Buffer.from(next.slice(33, 41)),
          'fee_base_msat': fee_base_msat,
          'fee_proportional_millionths': fee_proportional_millionths,
          'cltv_expiry_delta': (next[49] << 5) + next[50]
        })
      }
      break
    case 'c':
      if (typeof (result.min_final_cltv_expiry) !== 'undefined') {
        throw new Error('Expiry time already set!')
      }
      if (data[0] === 'q') {
        throw new Error('Min final expiry time field should use minimum data length possible')
      }
      var minCltvExpiryTime = 0
      for (var i = 0; i < data.length; i++) {
        minCltvExpiryTime = minCltvExpiryTime * 32 + ALPHABET_MAP[data[i]]
      }
      result.min_cltv_expiry_time = minCltvExpiryTime
      break
    default: console.error('Unknown tag type' + type + ' skipping')
  }
}

module.exports = {parse, encode}
