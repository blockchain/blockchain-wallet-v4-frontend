import BigInteger from 'bigi'
import Bitcoin from 'bitcoinjs-lib'
import Base58 from 'bs58'
import scrypt from 'scrypt-js'
import Unorm from 'unorm'

import * as WalletCrypto from './utils'

const hash256 = Bitcoin.crypto.hash256

export const parseBIP38toECPair = function(
  base58Encrypted,
  passphrase,
  network
) {
  var hex

  // Unicode NFC normalization
  passphrase = Unorm.nfc(passphrase)

  try {
    hex = Base58.decode(base58Encrypted)
  } catch (e) {
    throw new Error('Invalid Private Key')
  }

  if (hex.length !== 43) {
    throw new Error('Invalid Private Key')
  } else if (hex[0] !== 0x01) {
    throw new Error('Invalid Private Key')
  }

  var expChecksum = hex.slice(-4)
  hex = hex.slice(0, -4)

  var checksum = hash256(hex)

  if (
    checksum[0] !== expChecksum[0] ||
    checksum[1] !== expChecksum[1] ||
    checksum[2] !== expChecksum[2] ||
    checksum[3] !== expChecksum[3]
  ) {
    throw new Error('Invalid Private Key')
  }

  var isCompPoint = false
  var isECMult = false
  var hasLotSeq = false
  if (hex[1] === 0x42) {
    if (hex[2] === 0xe0) {
      isCompPoint = true
    } else if (hex[2] !== 0xc0) {
      throw new Error('Invalid Private Key')
    }
  } else if (hex[1] === 0x43) {
    isECMult = true
    isCompPoint = (hex[2] & 0x20) !== 0
    hasLotSeq = (hex[2] & 0x04) !== 0
    if ((hex[2] & 0x24) !== hex[2]) {
      throw new Error('Invalid Private Key')
    }
  } else {
    throw new Error('Invalid Private Key')
  }

  var decrypted
  var AESopts = { mode: WalletCrypto.AES.ECB, padding: WalletCrypto.NoPadding }

  var verifyHashAndReturn = function() {
    var tmpkey = new Bitcoin.ECPair(decrypted, null, {
      compressed: isCompPoint,
      network: network
    })

    var base58Address = tmpkey.getAddress()

    checksum = hash256(base58Address)

    if (
      checksum[0] !== hex[3] ||
      checksum[1] !== hex[4] ||
      checksum[2] !== hex[5] ||
      checksum[3] !== hex[6]
    ) {
      throw new Error('wrong_bip38_pass')
    }
    return tmpkey
  }

  if (!isECMult) {
    var addresshash = Buffer.from(hex.slice(3, 7), 'hex')

    var derivedBytes = scrypt(passphrase, addresshash, 16384, 8, 8, 64)
    var k = derivedBytes.slice(32, 32 + 32)

    var decryptedBytes = WalletCrypto.AES.decrypt(
      Buffer.from(hex.slice(7, 7 + 32), 'hex'),
      k,
      null,
      AESopts
    )
    for (var x = 0; x < 32; x++) {
      decryptedBytes[x] ^= derivedBytes[x]
    }

    decrypted = BigInteger.fromBuffer(decryptedBytes)

    return verifyHashAndReturn()
  } else {
    var ownerentropy = hex.slice(7, 7 + 8)
    var ownersalt = Buffer.from(
      !hasLotSeq ? ownerentropy : ownerentropy.slice(0, 4),
      'hex'
    )

    var prefactorA = scrypt(passphrase, ownersalt, 16384, 8, 8, 32)
    var passfactor

    if (!hasLotSeq) {
      passfactor = prefactorA
    } else {
      var prefactorB = Buffer.concat([
        prefactorA,
        Buffer.from(ownerentropy, 'hex')
      ])
      passfactor = hash256(prefactorB)
    }

    var kp = new Bitcoin.ECPair(BigInteger.fromBuffer(passfactor), null, {
      network: network
    })

    var passpoint = kp.getPublicKeyBuffer()

    var encryptedpart2 = Buffer.from(hex.slice(23, 23 + 16), 'hex')

    var addresshashplusownerentropy = Buffer.from(hex.slice(3, 3 + 12), 'hex')

    var derived = scrypt(passpoint, addresshashplusownerentropy, 1024, 1, 1, 64)
    k = derived.slice(32)

    var unencryptedpart2Bytes = WalletCrypto.AES.decrypt(
      encryptedpart2,
      k,
      null,
      AESopts
    )

    for (var i = 0; i < 16; i++) {
      unencryptedpart2Bytes[i] ^= derived[i + 16]
    }

    var encryptedpart1 = Buffer.concat([
      Buffer.from(hex.slice(15, 15 + 8), 'hex'),
      Buffer.from(unencryptedpart2Bytes.slice(0, 0 + 8), 'hex')
    ])

    var unencryptedpart1Bytes = WalletCrypto.AES.decrypt(
      encryptedpart1,
      k,
      null,
      AESopts
    )

    for (var ii = 0; ii < 16; ii++) {
      unencryptedpart1Bytes[ii] ^= derived[ii]
    }

    var seedb = Buffer.concat([
      Buffer.from(unencryptedpart1Bytes.slice(0, 0 + 16), 'hex'),
      Buffer.from(unencryptedpart2Bytes.slice(8, 8 + 8), 'hex')
    ])

    var factorb = hash256(seedb)

    // secp256k1: N
    var N = BigInteger.fromHex(
      'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'
    )

    decrypted = BigInteger.fromBuffer(passfactor)
      .multiply(BigInteger.fromBuffer(factorb))
      .remainder(N)

    return verifyHashAndReturn()
  }
}
