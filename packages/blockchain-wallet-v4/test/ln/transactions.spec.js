import chai from 'chai'
import * as Script from '../../src/ln/scripts'
import {fromJS} from 'immutable'
import {ChannelParams, ChannelState, Direction, Funded, Payment, PaymentWrapper} from '../../src/ln/state'
import {addWitness, getCommitmentTransaction, signCommitmentTransaction} from '../../src/ln/transactions'
import {obscureHash, wrapPubKey} from '../../src/ln/channel'
import * as hash from 'bcoin/lib/crypto/digest'

const { expect } = chai
const Long = require('long')
const bcoin = require('bcoin/lib/bcoin-browser')

describe('LN Transaction Generation', () => {
  let paramsLocal
  let paramsRemote
  let stateLocal

  let obscuredHash = obscureHash(
    Buffer.from('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa', 'hex'),
    Buffer.from('032c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991', 'hex')
  )

  let fundingKeySet = {
    localKey: {
      pub: Buffer.from('023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb', 'hex'),
      priv: Buffer.from('30ff4956bbdd3222d44cc5e8a1261dab1e07957bdac5ae88fe3261ef321f3749', 'hex')
    },
    remoteKey: wrapPubKey(Buffer.from('030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c1', 'hex'))
  }

  let keySet = {
    localKey: {
      pub: Buffer.from('030d417a46946384f88d5f3337267c5e579765875dc4daca813e21734b140639e7', 'hex'),
      priv: Buffer.from('bb13b121cdc357cd2e608b0aea294afca36e2b34cf958e2e6451a2f274694491', 'hex')
    },
    remoteKey: wrapPubKey(Buffer.from('0394854aa6eab5b2a8122cc726e9dded053a2184d88256816826d6231c068d4a5b', 'hex')),
    delayedKey: wrapPubKey(Buffer.from('03fd5960528dc152014952efdb702a88f71e3c1653b2314431701ec77e57fde83c', 'hex')),
    revocationKey: wrapPubKey(Buffer.from('0212a140cd0c6539d07cd08dfe09984dec3251ea808b892efeac3ede9402bf2b19', 'hex'))
  }

  let input = fromJS({
    outpoint: {
      hash: Buffer.from('8984484a580b825b9972d7adb15050b3ab624ccd731946b3eeddb92f4e7ef6be', 'hex'),
      n: 0
    },
    script: Buffer.from('5221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae', 'hex')
  })
  let inputValue = 10000000

  let preImageToHash = (preImageHex) => hash.ripemd160(hash.sha256(Buffer.from(preImageHex, 'hex')))
  let testPayments = [
    PaymentWrapper(Direction.RECEIVED, 0, Payment(Long.fromInt(1000000), preImageToHash('0000000000000000000000000000000000000000000000000000000000000000'), Buffer.alloc(0), 500)),
    PaymentWrapper(Direction.RECEIVED, 1, Payment(Long.fromInt(2000000), preImageToHash('0101010101010101010101010101010101010101010101010101010101010101'), Buffer.alloc(0), 501)),
    PaymentWrapper(Direction.OFFERED, 2, Payment(Long.fromInt(2000000), preImageToHash('0202020202020202020202020202020202020202020202020202020202020202'), Buffer.alloc(0), 502)),
    PaymentWrapper(Direction.OFFERED, 3, Payment(Long.fromInt(3000000), preImageToHash('0303030303030303030303030303030303030303030303030303030303030303'), Buffer.alloc(0), 503)),
    PaymentWrapper(Direction.RECEIVED, 4, Payment(Long.fromInt(4000000), preImageToHash('0404040404040404040404040404040404040404040404040404040404040404'), Buffer.alloc(0), 504))
  ]

  let createTestCase = (name, valueLocal, valueRemote, feeRate, payments, remoteSig, result) => ({
    name,
    valueLocal,
    valueRemote,
    feeRate,
    payments: payments.map(i => testPayments[i]),
    signature: Buffer.from(remoteSig, 'hex'),
    txResult: Buffer.from(result, 'hex')
  })

  let testCases = [
    createTestCase(
    'simple commitment tx with no HTLCs',
    7000000000, 3000000000, 15000, [],
    '3045022100f51d2e566a70ba740fc5d8c0f07b9b93d2ed741c3c0860c613173de7d39e7968022041376d520e9c0e1ad52248ddf4b22e12be8763007df977253ef45a4ca3bdb7c001',
    '02000000000101bef67e4e2fb9ddeeb3461973cd4c62abb35050b1add772995b820b584a488489000000000038b02b8002c0c62d0000000000160014ccf1af2f2aabee14bb40fa3851ab2301de84311054a56a00000000002200204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e0400473044022051b75c73198c6deee1a875871c3961832909acd297c6b908d59e3319e5185a46022055c419379c5051a78d00dbbce11b5b664a0c22815fbcc6fcef6b1937c383693901483045022100f51d2e566a70ba740fc5d8c0f07b9b93d2ed741c3c0860c613173de7d39e7968022041376d520e9c0e1ad52248ddf4b22e12be8763007df977253ef45a4ca3bdb7c001475221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae3e195220'),
    createTestCase(
    'commitment tx with all 5 HTLCs untrimmed (minimum feerate)',
     6988000000, 3000000000, 0, [0, 1, 2, 3, 4],
    '304402204fd4928835db1ccdfc40f5c78ce9bd65249b16348df81f0c44328dcdefc97d630220194d3869c38bc732dd87d13d2958015e2fc16829e74cd4377f84d215c0b7060601',
    '02000000000101bef67e4e2fb9ddeeb3461973cd4c62abb35050b1add772995b820b584a488489000000000038b02b8007e80300000000000022002052bfef0479d7b293c27e0f1eb294bea154c63a3294ef092c19af51409bce0e2ad007000000000000220020403d394747cae42e98ff01734ad5c08f82ba123d3d9a620abda88989651e2ab5d007000000000000220020748eba944fedc8827f6b06bc44678f93c0f9e6078b35c6331ed31e75f8ce0c2db80b000000000000220020c20b5d1f8584fd90443e7b7b720136174fa4b9333c261d04dbbd012635c0f419a00f0000000000002200208c48d15160397c9731df9bc3b236656efb6665fbfe92b4a6878e88a499f741c4c0c62d0000000000160014ccf1af2f2aabee14bb40fa3851ab2301de843110e0a06a00000000002200204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e04004730440220275b0c325a5e9355650dc30c0eccfbc7efb23987c24b556b9dfdd40effca18d202206caceb2c067836c51f296740c7ae807ffcbfbf1dd3a0d56b6de9a5b247985f060147304402204fd4928835db1ccdfc40f5c78ce9bd65249b16348df81f0c44328dcdefc97d630220194d3869c38bc732dd87d13d2958015e2fc16829e74cd4377f84d215c0b7060601475221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae3e195220'),
    createTestCase(
    'commitment tx with 7 outputs untrimmed (maximum feerate)',
     6988000000, 3000000000, 647, [0, 1, 2, 3, 4],
    '3045022100a5c01383d3ec646d97e40f44318d49def817fcd61a0ef18008a665b3e151785502203e648efddd5838981ef55ec954be69c4a652d021e6081a100d034de366815e9b01',
    '02000000000101bef67e4e2fb9ddeeb3461973cd4c62abb35050b1add772995b820b584a488489000000000038b02b8007e80300000000000022002052bfef0479d7b293c27e0f1eb294bea154c63a3294ef092c19af51409bce0e2ad007000000000000220020403d394747cae42e98ff01734ad5c08f82ba123d3d9a620abda88989651e2ab5d007000000000000220020748eba944fedc8827f6b06bc44678f93c0f9e6078b35c6331ed31e75f8ce0c2db80b000000000000220020c20b5d1f8584fd90443e7b7b720136174fa4b9333c261d04dbbd012635c0f419a00f0000000000002200208c48d15160397c9731df9bc3b236656efb6665fbfe92b4a6878e88a499f741c4c0c62d0000000000160014ccf1af2f2aabee14bb40fa3851ab2301de843110e09c6a00000000002200204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e040048304502210094bfd8f5572ac0157ec76a9551b6c5216a4538c07cd13a51af4a54cb26fa14320220768efce8ce6f4a5efac875142ff19237c011343670adf9c7ac69704a120d116301483045022100a5c01383d3ec646d97e40f44318d49def817fcd61a0ef18008a665b3e151785502203e648efddd5838981ef55ec954be69c4a652d021e6081a100d034de366815e9b01475221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae3e195220'),
    createTestCase(
    'commitment tx with 6 outputs untrimmed (minimum feerate)',
     6988000000, 3000000000, 648, [0, 1, 2, 3, 4],
    '3044022072714e2fbb93cdd1c42eb0828b4f2eff143f717d8f26e79d6ada4f0dcb681bbe02200911be4e5161dd6ebe59ff1c58e1997c4aea804f81db6b698821db6093d7b05701',
    '02000000000101bef67e4e2fb9ddeeb3461973cd4c62abb35050b1add772995b820b584a488489000000000038b02b8006d007000000000000220020403d394747cae42e98ff01734ad5c08f82ba123d3d9a620abda88989651e2ab5d007000000000000220020748eba944fedc8827f6b06bc44678f93c0f9e6078b35c6331ed31e75f8ce0c2db80b000000000000220020c20b5d1f8584fd90443e7b7b720136174fa4b9333c261d04dbbd012635c0f419a00f0000000000002200208c48d15160397c9731df9bc3b236656efb6665fbfe92b4a6878e88a499f741c4c0c62d0000000000160014ccf1af2f2aabee14bb40fa3851ab2301de8431104e9d6a00000000002200204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e0400483045022100a2270d5950c89ae0841233f6efea9c951898b301b2e89e0adbd2c687b9f32efa02207943d90f95b9610458e7c65a576e149750ff3accaacad004cd85e70b235e27de01473044022072714e2fbb93cdd1c42eb0828b4f2eff143f717d8f26e79d6ada4f0dcb681bbe02200911be4e5161dd6ebe59ff1c58e1997c4aea804f81db6b698821db6093d7b05701475221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae3e195220'),
    createTestCase(
    'commitment tx with 6 outputs untrimmed (maximum feerate)',
     6988000000, 3000000000, 2069, [0, 1, 2, 3, 4],
    '3044022001d55e488b8b035b2dd29d50b65b530923a416d47f377284145bc8767b1b6a75022019bb53ddfe1cefaf156f924777eaaf8fdca1810695a7d0a247ad2afba8232eb401',
    '02000000000101bef67e4e2fb9ddeeb3461973cd4c62abb35050b1add772995b820b584a488489000000000038b02b8006d007000000000000220020403d394747cae42e98ff01734ad5c08f82ba123d3d9a620abda88989651e2ab5d007000000000000220020748eba944fedc8827f6b06bc44678f93c0f9e6078b35c6331ed31e75f8ce0c2db80b000000000000220020c20b5d1f8584fd90443e7b7b720136174fa4b9333c261d04dbbd012635c0f419a00f0000000000002200208c48d15160397c9731df9bc3b236656efb6665fbfe92b4a6878e88a499f741c4c0c62d0000000000160014ccf1af2f2aabee14bb40fa3851ab2301de84311077956a00000000002200204adb4e2f00643db396dd120d4e7dc17625f5f2c11a40d857accc862d6b7dd80e040047304402203ca8f31c6a47519f83255dc69f1894d9a6d7476a19f498d31eaf0cd3a85eeb63022026fd92dc752b33905c4c838c528b692a8ad4ced959990b5d5ee2ff940fa90eea01473044022001d55e488b8b035b2dd29d50b65b530923a416d47f377284145bc8767b1b6a75022019bb53ddfe1cefaf156f924777eaaf8fdca1810695a7d0a247ad2afba8232eb401475221023da092f6980e58d2c037173180e9a465476026ee50f96695963e8efe436f54eb21030e9f7b623d2ccc7c9bd44d66d5ce21ce504c0acf6385a132cec6d3c39fa711c152ae3e195220')
  ]

  beforeEach(() => {
    paramsLocal = ChannelParams()
    stateLocal = ChannelState().set('commitmentNumber', 42)
    paramsRemote = ChannelParams()

    paramsLocal = paramsLocal
      .set('paymentBasepoint', {
        priv: null,
        pub: Buffer.from('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa', 'hex')
      })

    paramsRemote = paramsRemote
      .set('paymentBasepoint', {
        priv: null,
        pub: Buffer.from('032c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991', 'hex')}
    )
  })

  describe('Commitments', () => {
    testCases.forEach(test => {
      it(test.name, () => {
        stateLocal = stateLocal
          .set('amountMsatLocal', Long.fromNumber(test.valueLocal))
          .set('amountMsatRemote', Long.fromNumber(test.valueRemote))
          .set('committed', test.payments)
        paramsLocal = paramsLocal
          .set('feeRatePerKw', test.feeRate)

        let tx = getCommitmentTransaction(
          input,
          obscuredHash,
          stateLocal,
          test.feeRate,
          546,
          144,
          keySet,
          Funded.LOCAL_FUNDED
        )

        let sig = signCommitmentTransaction(inputValue, tx, fundingKeySet.localKey, fundingKeySet.remoteKey)

        let inputScript = Script.getFundingRedeemScript(
          fundingKeySet.localKey.pub,
          fundingKeySet.remoteKey.pub,
          sig,
          test.signature
        )

        tx = addWitness(tx, 0, inputScript)

        let tx1 = bcoin.tx.fromRaw(tx)
        let tx2 = bcoin.tx.fromRaw(test.txResult)

        expect(tx1.toJSON()).to.deep.equal(tx2.toJSON())
      })
    })
  })
})
