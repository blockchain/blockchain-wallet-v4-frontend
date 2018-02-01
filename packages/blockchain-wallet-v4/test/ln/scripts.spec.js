import chai from 'chai'
import * as Script from '../../src/ln/scripts'
const { expect } = chai

describe('LN Script Generation', () => {
  describe('Outputs', () => {
    it('FUNDING', () => {
      let fundingKeyLocal = Buffer.from('023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb', 'hex')
      let fundingKeyRemote = Buffer.from('030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c1', 'hex')

      let script = Script.getFundingOutputScript(fundingKeyLocal, fundingKeyRemote)
      let p2wsh = Script.wrapP2WSH(script)

      expect(p2wsh).to.deep.equal(Buffer.from('0020c015c4a6be010e21657068fc2e6a9d02b27ebe4d490a25846f7237f104d1a3cd', 'hex'))
    })

    it('COMMITMENT_LOCAL', () => {
      let delayedKeyLocal = Buffer.from('03fd5960528dc152014952efdb702a88f71e3c1653b2314431701ec77e57fde83c', 'hex')
      let revocationPubKeyLocal = Buffer.from('0212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b19', 'hex')

      let script = Script.getToLocalOutputScript(revocationPubKeyLocal, 144, delayedKeyLocal)

      expect(script).to.deep.equal(Buffer.from('63210212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b1967029000b2752103fd5960528dc152014952efdb702a88f71e3c1653b2314431701ec77e57fde83c68ac', 'hex'))
    })
    it('COMMITMENT_REMOTE', () => {
      let keyRemote = Buffer.from('0394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b', 'hex')

      let script = Script.getToRemoteOutputScript(keyRemote)

      expect(script).to.deep.equal(Buffer.from('0014ccf1af2f2aabee14bb40fa3851ab2301de843110', 'hex'))
    })

    it('HTLC_OFFER', () => {
      let keyLocal = Buffer.from('030d417a46946384f88d5f3337267c5e579765875dc4daca813e21734b140639e7', 'hex')
      let keyRemote = Buffer.from('0394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b', 'hex')
      let revocationPubKeyLocal = Buffer.from('0212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b19', 'hex')
      let paymentHash = Script.hash160(Buffer.from('0202020202020202020202020202020202020202020202020202020202020202', 'hex'))

      let script = Script.getOfferedHTLCOutput(revocationPubKeyLocal, keyRemote, keyLocal, paymentHash)

      expect(script).to.deep.equal(Buffer.from('76a91414011f7254d96b819c76986c277d115efce6f7b58763ac67210394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b7c820120876475527c21030d417a46946384f88d5f3337267c5e579765875dc4daca813e21734b140639e752ae67a914b43e1b38138a41b37f7cd9a1d274bc63e3a9b5d188ac6868', 'hex'))
    })

    it('HTLC_RECEIVE', () => {
      let keyLocal = Buffer.from('030d417a46946384f88d5f3337267c5e579765875dc4daca813e21734b140639e7', 'hex')
      let keyRemote = Buffer.from('0394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b', 'hex')
      let revocationPubKeyLocal = Buffer.from('0212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b19', 'hex')
      let paymentHash = Script.hash160(Buffer.from('0101010101010101010101010101010101010101010101010101010101010101', 'hex'))

      let script = Script.getReceivedHTLCOutput(revocationPubKeyLocal, keyRemote, keyLocal, paymentHash, 501)

      expect(script).to.deep.equal(Buffer.from('76a91414011f7254d96b819c76986c277d115efce6f7b58763ac67210394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b7c8201208763a9144b6b2e5444c2639cc0fb7bcea5afba3f3cdce23988527c21030d417a46946384f88d5f3337267c5e579765875dc4daca813e21734b140639e752ae677502f501b175ac6868', 'hex'))
    })

    it('HTLC_ACCEPT', () => {
      let revocationPubKeyLocal = Buffer.from('0212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b19', 'hex')
      let delayedKeyLocal = Buffer.from('03fd5960528dc152014952efdb702a88f71e3c1653b2314431701ec77e57fde83c', 'hex')

      let script = Script.getHTLCFollowUpTx(revocationPubKeyLocal, 144, delayedKeyLocal)
      let p2wsh = Script.wrapP2WSH(script)

      expect(p2wsh).to.deep.equal(Buffer.from('00204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e', 'hex'))
    })
  })
})
