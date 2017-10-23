import { expect } from 'chai'
import * as dr from '../../src/ln/key_derivation.js'

describe('Key Derivation Test', () => {
  describe('Secret generation tests', () => {
    it('0 final node', () => {
      var seed = []
      for (var i = 0; i < 32; i++) {
        seed[i] = 0
      }

      var I = [255, 255, 255, 255, 255, 255]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('02a40c85b6f28da08dfdbe0926c53fab2de6d28c10301f8f7c4073d5e42e3148')
    })

    it('FF final node', () => {
      var seed = []
      for (var i = 0; i < 32; i++) {
        seed[i] = 255
      }

      var I = [255, 255, 255, 255, 255, 255]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc')
    })

    it('FF alternate bits', () => {
      var seed = []
      for (var i = 0; i < 32; i++) {
        seed[i] = 255
      }

      var I = [10, 170, 170, 170, 170, 170]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('56f4008fb007ca9acf0e15b054d5c9fd12ee06cea347914ddbaed70d1c13a528')
    })

    it('FF alternate bits 2', () => {
      var seed = []
      for (var i = 0; i < 32; i++) {
        seed[i] = 255
      }

      var I = [85, 85, 85, 85, 85, 85]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('9015daaeb06dba4ccc05b91b2f73bd54405f2be9f217fbacd3c5ac2e62327d31')
    })

    it('01 last nontrivial node', () => {
      var seed = []
      for (var i = 0; i < 32; i++) {
        seed[i] = 1
      }

      var I = [0, 0, 0, 0, 0, 1]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('915c75942a26bb3a433a8ce2cb0427c29ec6c1775cfc78328b57f6ba7bfeaa9c')
    })
  })

  describe('revocation key derivation', () => {
    it('0 final node', () => {
      var baseSecret = Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', 'hex')

      var perCommitmentSecret = Buffer.from('1f1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100', 'hex')
      var basePoint = Buffer.from('036d6caac248af96f6afa7f904f550253a0f3ef3f5aa2fe6838a95b216691468e2', 'hex')

      var perCommitmentPoint = Buffer.from('025f7117a78150fe2ef97db7cfc83bd57b2e2c0d0dd25eaf467a4a1c2a45ce1486', 'hex')

      expect(Buffer.from(dr.deriveLocalKey(basePoint, perCommitmentPoint)).toString('hex')).to.equal('0235f2dbfaa89b57ec7b055afe29849ef7ddfeb1cefdb9ebdc43f5494984db29e5')
      expect(Buffer.from(dr.deriveLocalPrivateKey(baseSecret, basePoint, perCommitmentPoint)).toString('hex')).to.equal('cbced912d3b21bf196a766651e436aff192362621ce317704ea2f75d87e7be0f')
      expect(Buffer.from(dr.deriveRevocationKey(basePoint, perCommitmentPoint)).toString('hex')).to.equal('02916e326636d19c33f13e8c0c3a03dd157f332f3e99c317c141dd865eb01f8ff0')
      expect(Buffer.from(dr.deriveRevocationPrivateKey(baseSecret, perCommitmentSecret, basePoint, perCommitmentPoint)).toString('hex')).to.equal('d09ffff62ddb2297ab000cc85bcb4283fdeb6aa052affbc9dddcf33b61078110')
    })
  })
})
