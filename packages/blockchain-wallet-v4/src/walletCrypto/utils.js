import assert from 'assert'
import * as crypto from 'crypto'

export const SALT_BYTES = 16
export const AUTH_TAG_BYTES = 16
export const KEY_BIT_LEN = 256
export const BLOCK_BIT_LEN = 128

export const NoPadding = {
  /*
   *   Does nothing
   */

  pad(dataBytes) {
    return dataBytes
  },

  unpad(dataBytes) {
    return dataBytes
  }
}

export const ZeroPadding = {
  /*
   *   Fills remaining block space with 0x00 bytes
   *   May cause issues if data ends with any 0x00 bytes
   */

  pad(dataBytes, nBytesPerBlock) {
    const nPaddingBytes = nBytesPerBlock - (dataBytes.length % nBytesPerBlock)
    const zeroBytes = Buffer.from(nPaddingBytes).fill(0x00)
    return Buffer.concat([dataBytes, zeroBytes])
  },

  unpad(dataBytes) {
    const unpaddedHex = dataBytes.toString('hex').replace(/(00)+$/, '')
    return Buffer.from(unpaddedHex, 'hex')
  }
}

export const Iso10126 = {
  /*
   *   Fills remaining block space with random byte values, except for the
   *   final byte, which denotes the byte length of the padding
   */
  pad(dataBytes, nBytesPerBlock) {
    const nPaddingBytes = nBytesPerBlock - (dataBytes.length % nBytesPerBlock)
    const paddingBytes = crypto.randomBytes(nPaddingBytes - 1)
    const endByte = Buffer.from([nPaddingBytes])

    return Buffer.concat([dataBytes, paddingBytes, endByte])
  },
  unpad(dataBytes) {
    const nPaddingBytes = dataBytes[dataBytes.length - 1]

    return dataBytes.slice(0, -nPaddingBytes)
  }
}

export const Iso97971 = {
  /*
   *   Fills remaining block space with 0x00 bytes following a 0x80 byte,
   *   which serves as a mark for where the padding begins
   */

  pad(dataBytes, nBytesPerBlock) {
    const withStartByte = Buffer.concat([dataBytes, Buffer.from([0x80])])
    return ZeroPadding.pad(withStartByte, nBytesPerBlock)
  },

  unpad(dataBytes) {
    const zeroBytesRemoved = ZeroPadding.unpad(dataBytes)
    return zeroBytesRemoved.slice(0, zeroBytesRemoved.length - 1)
  }
}

export const AES = {
  CBC: 'aes-256-cbc',
  ECB: 'aes-256-ecb',
  GCM: 'aes-256-gcm',
  OFB: 'aes-256-ofb',

  decrypt(dataBytes, key, salt, options) {
    options = options || {}
    assert(Buffer.isBuffer(dataBytes), 'expected `dataBytes` to be a Buffer')
    assert(Buffer.isBuffer(key), 'expected `key` to be a Buffer')
    assert(Buffer.isBuffer(salt) || salt === null, 'expected `salt` to be a Buffer or null')

    const decipher = crypto.createDecipheriv(options.mode || AES.CBC, key, salt || '')
    decipher.setAutoPadding(!options.padding)

    let data = dataBytes
    if (options.mode === AES.GCM) {
      const tag = dataBytes.slice(dataBytes.length - 16)
      decipher.setAuthTag(tag)
      data = dataBytes.slice(0, dataBytes.length - 16)
    }

    let decryptedBytes = Buffer.concat([decipher.update(data), decipher.final()])

    if (options.padding) decryptedBytes = options.padding.unpad(decryptedBytes)
    return decryptedBytes
  },

  /*
   *   Encrypt / Decrypt with aes-256
   *   - dataBytes, key, and salt are expected to be buffers
   *   - default options are mode=CBC and padding=auto (PKCS7)
   */
  encrypt(dataBytes, key, salt, options) {
    options = options || {}
    assert(Buffer.isBuffer(dataBytes), 'expected `dataBytes` to be a Buffer')
    assert(Buffer.isBuffer(key), 'expected `key` to be a Buffer')
    assert(Buffer.isBuffer(salt) || salt === null, 'expected `salt` to be a Buffer or null')

    const cipher = crypto.createCipheriv(options.mode || AES.CBC, key, salt || '')
    cipher.setAutoPadding(!options.padding)

    if (options.padding) {
      dataBytes = options.padding.pad(dataBytes, BLOCK_BIT_LEN / 8)
    }
    const encryptedBytes = Buffer.concat([cipher.update(dataBytes), cipher.final()])

    return options.mode === AES.GCM
      ? Buffer.concat([encryptedBytes, cipher.getAuthTag()])
      : { encryptedBytes }
  }
}
