import * as Bitcoin from 'bitcoinjs-lib'

import * as KVStoreEntry from './KVStoreEntry.js'

describe('KVStoreEntry', () => {
  describe('removeZeroPadding', () => {
    it('removes leading 0s', () => {
      const chaincode = Buffer.from(
        '52ac2d2f90c0408f38fa34b1da69af54bba8153c2f4cd6b9bd68ad76494f530e',
        'hex'
      )
      const privateKey = Buffer.from(
        'a91bf9af9cbf9dbd1de0a3a4867a42cb0bd398251b807c84a6b6ac68828a02d9',
        'hex'
      )

      const bip32 = Bitcoin.bip32.fromPrivateKey(privateKey, chaincode)
      const pk = bip32.deriveHardened(233).deriveHardened(1).privateKey
      const sanitizedPk = KVStoreEntry.removeZeroPadding(pk)

      expect(sanitizedPk.toString('hex')).toBe(
        '445566da8887f8b030d3e8a357a6d58b29538449e642cfe7a5c20a87a973b2'
      )
      expect(pk?.toString('hex')).toBe(
        '00445566da8887f8b030d3e8a357a6d58b29538449e642cfe7a5c20a87a973b2'
      )
    })
  })

  describe('fromMetadataHDNode', () => {
    it('sets both the correct and incorrect enc keys', () => {
      const chaincode = Buffer.from(
        '52ac2d2f90c0408f38fa34b1da69af54bba8153c2f4cd6b9bd68ad76494f530e',
        'hex'
      )
      const privateKey = Buffer.from(
        'a91bf9af9cbf9dbd1de0a3a4867a42cb0bd398251b807c84a6b6ac68828a02d9',
        'hex'
      )

      const bip32 = Bitcoin.bip32.fromPrivateKey(privateKey, chaincode)
      const metadata = KVStoreEntry.fromMetadataHDNode(bip32, 233)

      expect(metadata.encKeyBuffer.toString('hex')).toBe(
        'd3d34a69c68bb0eee9bad63b204c5e0ff00b1a48f17bfabe73a7b6df58e6281a'
      )
      expect(metadata.encKeyBufferUnpadded.toString('hex')).toBe(
        'e5a3804f14a79a69d2396c2e2359fa2439079d44379ab86d2a517533cc83a5d4'
      )
    })
  })
})
