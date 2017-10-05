'use strict'
var bech32 = require('bech32')
let ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

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
  return result
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
  result.signature = bech32.fromWords(decodeData(data.slice(data.length - 110, data.length - 6)))
  result.checksum = data.slice(data.length - 6, data.length)
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

function encode (payment) {
  var result = payment.prefix
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

  result = result.concat(amountStr + multiplierStr + '1')

  result = result.concat(convert(payment.timestamp))
  result = result.concat(encodeTags(payment.tags))
  result = result.concat(encodeData(bech32.toWords(payment.signature)))
  result = result.concat(payment.checksum)
  return result
}

function encodeTags (tags) {
  var result = ''

  if (typeof (tags.payment_hash) === 'undefined') {
    console.error('There should be exactly one payment hash tag')
  }
  result = result.concat('p' + getDataLength(HASH_DATA_LENGTH))
  result = result.concat(encodeData(bech32.toWords(tags.payment_hash)))

  if (typeof (tags.description) !== 'undefined') {
    var bytes = []
    for (let i = 0; i < tags.description.length; i++) {
      bytes.push(tags.description[i].charCodeAt())
    }
    var description = encodeData(bech32.toWords(bytes))
    result = result.concat('d' + getDataLength(description.length) + description)
  }

  if (typeof (tags.expiry_time) !== 'undefined' && tags.expiry_time !== DEFAULT_EXPIRY_TIME) {
    let expiryTime = convert(tags.expiry_time)
    result = result.concat('x' + getDataLength(expiryTime.length) + expiryTime)
  }

  if (typeof (tags.public_key) !== 'undefined') {
    result = result.concat('n' + getDataLength(PUBLIC_KEY_DATA_LENGTH) +
                           encodeData(bech32.toWords(tags.public_key)))
  }

  if (typeof (tags.purpose_of_payment) !== 'undefined') {
    result = result.concat('h' + getDataLength(HASH_DATA_LENGTH) +
                           encodeData(bech32.toWords(tags.purpose_of_payment)))
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
    var bytes = []
    for (var i = 0; i < tags.route.length; i++) {
      let node = tags.route[i]
      bytes = bytes.concat(node.pubkey)
      bytes = bytes.concat(node.short_channel_id)
      bytes = bytes.concat(node.fee)
      bytes.push(node.cltv_expiry_delta >> 8)
      bytes.push(node.cltv_expiry_delta & 255)
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
      result.payment_hash = bech32.fromWords(decodeData(data))
      break
    case 'd':
      if (typeof (result.description) !== 'undefined' ||
          typeof (result.purpose_of_payment) !== 'undefined') {
        throw new Error('There should be either exactly one d or one h field')
      }
      result.description = ''
      var a = bech32.fromWords(decodeData(data))
      for (var i = 0; i < a.length; i++) {
        result.description = result.description.concat(String.fromCharCode(a[i]))
      }
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
      result.public_key = bech32.fromWords(decodeData(data))
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
      result.purpose_of_payment = bech32.fromWords(decodeData(data))
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
      var payload = bech32.fromWords(decodeData(data.slice(1, data.length)))
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
        result.route.push({
          'pubkey': next.slice(0, 33),
          'short_channel_id': next.slice(33, 41),
          'fee': next.slice(41, 49),
          'cltv_expiry_delta': (next[49] << 5) + next[50]
        })
      }
      break
    default: console.error('Unknown tag type' + type + ' skipping')
  }
}

module.exports = {parse, encode}
