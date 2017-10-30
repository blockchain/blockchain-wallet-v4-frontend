import { expect } from 'chai'
import * as dr from '../../src/ln/key_derivation.js'
import {Map} from 'immutable'

describe('Key Derivation Test', () => {
  function TestCase () {
    this.I = Math.pow(2, 48)
    this.storedSecrets = Map()

    this.addSecret = (secret, expectResult = true) => {
      this.I--
      expect(dr.isCorrectNewSecret(this.storedSecrets, secret, this.I)).to.equal(expectResult)
      this.storedSecrets = dr.insertSecret(this.storedSecrets, secret, this.I)
    }
  }
  describe('Secret generation tests', () => {
    it('0 final node', () => {
      let seed = []
      for (let i = 0; i < 32; i++) {
        seed[i] = 0
      }

      let I = [255, 255, 255, 255, 255, 255]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('02a40c85b6f28da08dfdbe0926c53fab2de6d28c10301f8f7c4073d5e42e3148')
    })

    it('FF final node', () => {
      let seed = []
      for (let i = 0; i < 32; i++) {
        seed[i] = 255
      }

      let I = [255, 255, 255, 255, 255, 255]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc')
    })

    it('FF alternate bits', () => {
      let seed = []
      for (let i = 0; i < 32; i++) {
        seed[i] = 255
      }

      let I = [10, 170, 170, 170, 170, 170]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('56f4008fb007ca9acf0e15b054d5c9fd12ee06cea347914ddbaed70d1c13a528')
    })

    it('FF alternate bits 2', () => {
      let seed = []
      for (let i = 0; i < 32; i++) {
        seed[i] = 255
      }

      let I = [85, 85, 85, 85, 85, 85]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('9015daaeb06dba4ccc05b91b2f73bd54405f2be9f217fbacd3c5ac2e62327d31')
    })

    it('01 last nontrivial node', () => {
      let seed = []
      for (let i = 0; i < 32; i++) {
        seed[i] = 1
      }

      let I = [0, 0, 0, 0, 0, 1]

      expect(Buffer.from(dr.generatePerCommitmentSecret(seed, I)).toString('hex'))
        .to.equal('915c75942a26bb3a433a8ce2cb0427c29ec6c1775cfc78328b57f6ba7bfeaa9c')
    })
  })

  describe('revocation key derivation', () => {
    it('0 final node', () => {
      let baseSecret = Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', 'hex')

      let perCommitmentSecret = Buffer.from('1f1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100', 'hex')
      let basePoint = Buffer.from('036d6caac248af96f6afa7f904f550253a0f3ef3f5aa2fe6838a95b216691468e2', 'hex')

      let perCommitmentPoint = Buffer.from('025f7117a78150fe2ef97db7cfc83bd57b2e2c0d0dd25eaf467a4a1c2a45ce1486', 'hex')

      expect(Buffer.from(dr.derivePubKey(basePoint, perCommitmentPoint)).toString('hex')).to.equal('0235f2dbfaa89b57ec7b055afe29849ef7ddfeb1cefdb9ebdc43f5494984db29e5')
      expect(Buffer.from(dr.derivePrivKey(baseSecret, basePoint, perCommitmentPoint)).toString('hex')).to.equal('cbced912d3b21bf196a766651e436aff192362621ce317704ea2f75d87e7be0f')
      expect(Buffer.from(dr.deriveRevocationPubKey(basePoint, perCommitmentPoint)).toString('hex')).to.equal('02916e326636d19c33f13e8c0c3a03dd157f332f3e99c317c141dd865eb01f8ff0')
      expect(Buffer.from(dr.deriveRevocationPrivKey(baseSecret, perCommitmentSecret, basePoint, perCommitmentPoint)).toString('hex')).to.equal('d09ffff62ddb2297ab000cc85bcb4283fdeb6aa052affbc9dddcf33b61078110')
    })
  })
  describe('storage test', () => {
    it('insert secret correct sequence', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'))
      testCase.addSecret(Buffer.from('c65716add7aa98ba7acb236352d665cab17345fe45b55fb879ff80e6bd0c41dd', 'hex'))
      testCase.addSecret(Buffer.from('969660042a28f32d9be17344e09374b379962d03db1574df5a8a5a47e19ce3f2', 'hex'))
      testCase.addSecret(Buffer.from('a5a64476122ca0925fb344bdc1854c1c0a59fc614298e50a33e331980a220f32', 'hex'))
      testCase.addSecret(Buffer.from('05cde6323d949933f7f7b78776bcc1ea6d9b31447732e3802e1f7ac44b650e17', 'hex'))
    })
    it('insert secret incorrect sequence #1', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('02a40c85b6f28da08dfdbe0926c53fab2de6d28c10301f8f7c4073d5e42e3148', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'), false)
    })

    it('insert secret incorrect sequence #2', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('02a40c85b6f28da08dfdbe0926c53fab2de6d28c10301f8f7c4073d5e42e3148', 'hex'))
      testCase.addSecret(Buffer.from('dddc3a8d14fddf2b68fa8c7fbad2748274937479dd0f8930d5ebb4ab6bd866a3', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'), false)
    })

    it('insert secret incorrect sequence #3', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('c51a18b13e8527e579ec56365482c62f180b7d5760b46e9477dae59e87ed423a', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'), false)
    })

    it('insert secret incorrect sequence #4', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('02a40c85b6f28da08dfdbe0926c53fab2de6d28c10301f8f7c4073d5e42e3148', 'hex'))
      testCase.addSecret(Buffer.from('dddc3a8d14fddf2b68fa8c7fbad2748274937479dd0f8930d5ebb4ab6bd866a3', 'hex'))
      testCase.addSecret(Buffer.from('c51a18b13e8527e579ec56365482c62f180b7d5760b46e9477dae59e87ed423a', 'hex'))
      testCase.addSecret(Buffer.from('ba65d7b0ef55a3ba300d4e87af29868f394f8f138d78a7011669c79b37b936f4', 'hex'))
      testCase.addSecret(Buffer.from('c65716add7aa98ba7acb236352d665cab17345fe45b55fb879ff80e6bd0c41dd', 'hex'))
      testCase.addSecret(Buffer.from('969660042a28f32d9be17344e09374b379962d03db1574df5a8a5a47e19ce3f2', 'hex'))
      testCase.addSecret(Buffer.from('a5a64476122ca0925fb344bdc1854c1c0a59fc614298e50a33e331980a220f32', 'hex'))
      testCase.addSecret(Buffer.from('05cde6323d949933f7f7b78776bcc1ea6d9b31447732e3802e1f7ac44b650e17', 'hex'), false)
    })

    it('insert secret incorrect sequence #5', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'))
      testCase.addSecret(Buffer.from('631373ad5f9ef654bb3dade742d09504c567edd24320d2fcd68e3cc47e2ff6a6', 'hex'))
      testCase.addSecret(Buffer.from('969660042a28f32d9be17344e09374b379962d03db1574df5a8a5a47e19ce3f2', 'hex'), false)
    })

    it('insert secret incorrect sequence #6', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'))
      testCase.addSecret(Buffer.from('631373ad5f9ef654bb3dade742d09504c567edd24320d2fcd68e3cc47e2ff6a6', 'hex'))
      testCase.addSecret(Buffer.from('b7e76a83668bde38b373970155c868a653304308f9896692f904a23731224bb1', 'hex'))
      testCase.addSecret(Buffer.from('a5a64476122ca0925fb344bdc1854c1c0a59fc614298e50a33e331980a220f32', 'hex'))
      testCase.addSecret(Buffer.from('05cde6323d949933f7f7b78776bcc1ea6d9b31447732e3802e1f7ac44b650e17', 'hex'), false)
    })

    it('insert secret incorrect sequence #7', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'))
      testCase.addSecret(Buffer.from('c65716add7aa98ba7acb236352d665cab17345fe45b55fb879ff80e6bd0c41dd', 'hex'))
      testCase.addSecret(Buffer.from('969660042a28f32d9be17344e09374b379962d03db1574df5a8a5a47e19ce3f2', 'hex'))
      testCase.addSecret(Buffer.from('e7971de736e01da8ed58b94c2fc216cb1dca9e326f3a96e7194fe8ea8af6c0a3', 'hex'))
      testCase.addSecret(Buffer.from('05cde6323d949933f7f7b78776bcc1ea6d9b31447732e3802e1f7ac44b650e17', 'hex'), false)
    })

    it('insert secret incorrect sequence #8', () => {
      let testCase = new TestCase()
      testCase.addSecret(Buffer.from('7cc854b54e3e0dcdb010d7a3fee464a9687be6e8db3be6854c475621e007a5dc', 'hex'))
      testCase.addSecret(Buffer.from('c7518c8ae4660ed02894df8976fa1a3659c1a8b4b5bec0c4b872abeba4cb8964', 'hex'))
      testCase.addSecret(Buffer.from('2273e227a5b7449b6e70f1fb4652864038b1cbf9cd7c043a7d6456b7fc275ad8', 'hex'))
      testCase.addSecret(Buffer.from('27cddaa5624534cb6cb9d7da077cf2b22ab21e9b506fd4998a51d54502e99116', 'hex'))
      testCase.addSecret(Buffer.from('c65716add7aa98ba7acb236352d665cab17345fe45b55fb879ff80e6bd0c41dd', 'hex'))
      testCase.addSecret(Buffer.from('969660042a28f32d9be17344e09374b379962d03db1574df5a8a5a47e19ce3f2', 'hex'))
      testCase.addSecret(Buffer.from('a5a64476122ca0925fb344bdc1854c1c0a59fc614298e50a33e331980a220f32', 'hex'))
      testCase.addSecret(Buffer.from('a7efbc61aac46d34f77778bac22c8a20c6a46ca460addc49009bda875ec88fa4', 'hex'), false)
    })
  })
})
