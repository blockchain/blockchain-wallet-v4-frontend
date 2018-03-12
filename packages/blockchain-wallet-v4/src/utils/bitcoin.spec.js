import * as utils from './bitcoin'
import { all } from 'ramda'

const fromHex = (hex) => Buffer.from(hex, 'hex')

describe('Bitcoin Utils', () => {
  const validAddresses = [
    '1CsYGw3DbpiscVE1LdoCNYp22wukFuRZmN',
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe7',
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksv',
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej']

  const invalidAddresses = [
    '1CsYGw3DbpiscVE1LdoCNYp22wukFuRZmM',
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe8',
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksw',
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzek']

  const scriptMapping = {
    '1Jx89A4TcLVUNwdfrGXv7w7WasJ3HDqQ28': fromHex('76a914c4e6fa17222f7ce3b2461fb4a73b26ac5255b04e88ac'),
    '1Jx89A4TcLVUNwdfrGXv7w7WasJ3HDqQ29': undefined,
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe7': fromHex('a914fa67c6cfa1803d0621d2eca35099b2ea38e9719f87'),
    '3QX3B2UqEiQ8kZPwAoySuzFCLawH8GbRe8': undefined,
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksv': fromHex('0014e34e68ef931c93e7af5f2b5b46ae8d2226102982'),
    'bc1qud8x3munrjf70t6l9dd5dt5dygnpq2vz3u8ksw': undefined,
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej': fromHex('0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d'),
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzek': undefined
  }

  describe('Address', () => {
    it('Should validate addresses', () => {
      validAddresses
        .map(utils.isValidBitcoinAddress)
        .forEach(v => expect(v).toEqual(true))
    })

    it('Should find checksum errors', () => {
      invalidAddresses
        .map(utils.isValidBitcoinAddress)
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
})
