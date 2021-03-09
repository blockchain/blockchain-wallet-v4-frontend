import { networks } from 'bitcoinjs-lib'

import * as utils from './btc'

const fromHex = hex => Buffer.from(hex, 'hex')

describe('Btc Utils', () => {
  const validAddresses = [
    '1CsYGw3DbpiscVE1LdoCNYp22wukFuRZmN',
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe7',
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksv',
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej'
  ]

  const invalidAddresses = [
    '1CsYGw3DbpiscVE1LdoCNYp22wukFuRZmM',
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe8',
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksw',
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzek'
  ]

  const scriptMapping = {
    '1Jx89A4TcLVUNwdfrGXv7w7WasJ3HDqQ28': fromHex(
      '76a914c4e6fa17222f7ce3b2461fb4a73b26ac5255b04e88ac'
    ),
    '1Jx89A4TcLVUNwdfrGXv7w7WasJ3HDqQ29': undefined,
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe7': fromHex(
      'a914fa67c6cfa1803d0621d2eca35099b2ea38e9719f87'
    ),
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe8': undefined,
    bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksv: fromHex(
      '0014e34e68ef931c93e7af5f2b5b46ae8d2226102982'
    ),
    bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksw: undefined,
    bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej: fromHex(
      '0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d'
    ),
    bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzek: undefined
  }

  const child = {
    publicKey:
      '0407b481a081a3e297aaafc432141247aeb441ba948b3df1db07760e677ff5387a84eb0d7b00d858746d18d436d07d2e4759dfb848d3ff689b9142f0dfe5153352',
    chainCode:
      '119a9dab3772c309593f6c26767a10f6c6356489fd50477ef164af7d6fd129f1'
  }
  const parent = {
    publicKey:
      '04d68a4a499ba232fcf48f3de42706cf14ac13e210a62915cec0b6ef0c39027892aa6b612cdddce822dc702d03b1b0d0ba9f3a902e3d2ffd371f54a7c336de8ccd',
    chainCode:
      'a4edb4ef51d72c30033f0bab3eec27d6392a8b649a39687141714f39b096b5af'
  }

  describe('Address', () => {
    it('Should validate addresses', () => {
      validAddresses
        .map(addr => utils.isValidBtcAddress(addr, networks.bitcoin))
        .forEach(v => expect(v).toEqual(true))
    })

    it('Should find checksum errors', () => {
      invalidAddresses
        .map(addr => utils.isValidBtcAddress(addr, networks.bitcoin))
        .forEach(v => expect(v).toEqual(false))
    })

    it('Should create correct scripts', () => {
      for (let addr in scriptMapping) {
        const actualScript = utils.addressToScript(addr)
        const expectedScript = scriptMapping[addr]
        expect(actualScript).toEqual(expectedScript)
      }
    })

    // TODO tests for bech32 addresses with other errors
  })

  describe('createXpubFromChildAndParent', () => {
    it('Should create the proper xpub', () => {
      const expectedXpub =
        'xpub6BwFGQ41Zi14LdeBtF42CBxaFeH84HBTAR9adRHbWWL53iTaRF5WNUzK2ojRQ3feH7Mx3bi2tAuBXV4qemaPrAAJjpUGgp3aAj3xVDMp8p2'
      const path = "44'/0'/0'"
      expect(utils.createXpubFromChildAndParent(path, child, parent)).toEqual(
        expectedXpub
      )
    })
  })

  describe('Fingerprint', () => {
    it('Should compute the proper fingerprint for a public key', () => {
      const fingerprint = 3818823506
      const pk = utils.compressPublicKey(Buffer.from(child.publicKey, 'hex'))
      expect(utils.fingerprint(pk)).toEqual(fingerprint)
    })
  })

  describe('getParentPath', () => {
    it('Should compute the parent path', () => {
      const path = "m/44'/0'/0'"
      const parent = "m/44'/0'"
      expect(utils.getParentPath(path)).toEqual(parent)
    })
  })

  describe('compressPublicKey', () => {
    it('Should compress a public key', () => {
      const cpk =
        '0207b481a081a3e297aaafc432141247aeb441ba948b3df1db07760e677ff5387a'
      const pk = Buffer.from(child.publicKey, 'hex')
      expect(utils.compressPublicKey(pk).toString('hex')).toEqual(cpk)
    })
  })
})
