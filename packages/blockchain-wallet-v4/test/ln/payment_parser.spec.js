import { expect } from 'chai'
import Parser from '../../src/ln/crypto/payment_parser.js'

var secp256k1 = require('secp256k1')
const bech32 = require('bech32')
var sha = require('sha256')
var base58 = require('bs58')
const assert = require('assert')

describe('Payment parser', () => {
  let privateKey = Buffer.from('e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734', 'hex')
  let pubKey = secp256k1.publicKeyCreate(privateKey)

  describe('Parse Messages', () => {
    it('parses payment hash and short description', () => {
      var testMsg = 'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'description': 'Please consider supporting this project'
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult, privateKey)).to.equal(testMsg)
    })

    it('parses expiry time', () => {
      var testMsg = 'lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.0025,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'description': '1 cup coffee',
          'expiry_time': 60
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult, privateKey)).to.equal(testMsg)
    })

    it('parses min final exprity time', () => {
      var testMsg = 'lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpquwpc4curk03c9wlrswe78q4eyqc7d8d0xqzpuyk0sg5g70me25alkluzd2x62aysf2pyy8edtjeevuv4p2d5p76r4zkmneet7uvyakky2zr4cusd45tftc9c5fh0nnqpnl2jfll544esqchsrny'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.0025,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'description': 'ナンセンス 1杯',
          'expiry_time': 60
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult, privateKey)).to.equal(testMsg)
    })

    it('parses hash of description', () => {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqscc6gd6ql3jrc5yzme8v4ntcewwz5cnw92tz0pc8qcuufvq7khhr8wpald05e92xw006sq94mg8v2ndf4sefvf9sygkshp5zfem29trqq2yxxz7'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.parse(Parser.encode(expectedResult, privateKey))).to.deep.equal(Parser.parse(testMsg))
    })

    it('parses p2pkh', () => {
      var testMsg = 'lntb20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfpp3x9et2e20v6pu37c5d9vax37wxq72un98kmzzhznpurw9sgl2v0nklu2g4d0keph5t7tj9tcqd8rexnd07ux4uv2cjvcqwaxgj7v4uwn5wmypjd5n69z2xm3xgksg28nwht7f6zspwp3f9t'
      var p2pkh = base58.decode("mk2QpYatsKicvFVuTAQLBryyccRXMUaGHP")
      p2pkh = p2pkh.slice(1, p2pkh.length - 4)
      var expectedResult = {
        'prefix': 'lntb',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'P2PKH': p2pkh,
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult, privateKey)).to.equal(testMsg)
    })

    it('parses routing info', () => {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfpp3qjmp7lwpagxun9pygexvgpjdc4jdj85fr9yq20q82gphp2nflc7jtzrcazrra7wwgzxqc8u7754cdlpfrmccae92qgzqvzq2ps8pqqqqqqpqqqqq9qqqvpeuqafqxu92d8lr6fvg0r5gv0heeeqgcrqlnm6jhphu9y00rrhy4grqszsvpcgpy9qqqqqqgqqqqq7qqzqj9n4evl6mr5aj9f58zp6fyjzup6ywn3x6sk8akg5v4tgn2q8g4fhx05wf6juaxu9760yp46454gpg5mtzgerlzezqcqvjnhjh8z3g2qqdhhwkj'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'P2PKH': Buffer.from([4, 182, 31, 125, 193, 234, 13, 201, 148, 36, 70, 76, 196, 6, 77, 197, 100, 217, 30, 137]),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
          'route': [{
            'pubkey': Buffer.from('029e03a901b85534ff1e92c43c74431f7ce72046060fcf7a95c37e148f78c77255', 'hex'),
            'short_channel_id': Buffer.from("0102030405060708", 'hex'),
            'fee_base_msat': 1,
            'fee_proportional_millionths': 20,
            'cltv_expiry_delta': 3
          },
            {
              'pubkey': Buffer.from('039e03a901b85534ff1e92c43c74431f7ce72046060fcf7a95c37e148f78c77255', 'hex'),
              'short_channel_id': Buffer.from('030405060708090a', 'hex'),
              'fee_base_msat': 2,
              'fee_proportional_millionths': 30,
              'cltv_expiry_delta': 4
            }]
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.parse(Parser.encode(expectedResult, privateKey))).to.deep.equal(Parser.parse(testMsg))
    })
    it('parses p2sh', () => {
      var testMsg = 'lnbc20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfppj3a24vwu6r8ejrss3axul8rxldph2q7z9kmrgvr7xlaqm47apw3d48zm203kzcq357a4ls9al2ea73r8jcceyjtya6fu5wzzpe50zrge6ulk4nvjcpxlekvmxl6qcs9j3tz0469gq5g658y'
      var p2sh = base58.decode("3EktnHQD7RiAE6uzMj2ZifT9YgRrkSgzQX")
      p2sh = p2sh.slice(1, p2sh.length - 4)
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
          'P2SH': p2sh
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.parse(Parser.encode(expectedResult, privateKey))).to.deep.equal(Parser.parse(testMsg))
    })
    it('parses P2WPKH', () => {
      var testMsg = 'lnbc20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfppqw508d6qejxtdg4y5r3zarvary0c5xw7kepvrhrm9s57hejg0p662ur5j5cr03890fa7k2pypgttmh4897d3raaq85a293e9jpuqwl0rnfuwzam7yr8e690nd2ypcq9hlkdwdvycqa0qza8'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
          'segwit': {
            'version': 0,
            'payload': Buffer.from(bech32.fromWords(bech32.decode("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4").words.slice(1)))
          }
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.parse(Parser.encode(expectedResult, privateKey))).to.deep.equal(Parser.parse(testMsg))
    })
    it('parses P2WSH', () => {
      var testMsg = 'lnbc20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfp4qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q28j0v3rwgy9pvjnd48ee2pl8xrpxysd5g44td63g6xcjcu003j3qe8878hluqlvl3km8rm92f5stamd3jw763n3hck0ct7p8wwj463cql26ava'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': Buffer.from('0001020304050607080900010203040506070809000102030405060708090102', 'hex'),
          'purpose_of_payment': Buffer.from(sha("One piece of chocolate cake, one icecream cone, one pickle, one slice of swiss cheese, one slice of salami, one lollypop, one piece of cherry pie, one sausage, one cupcake, and one slice of watermelon"), 'hex'),
          'segwit': {
            'version': 0,
            'payload': Buffer.from(bech32.fromWords(bech32.decode("bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3").words.slice(1)))
          }
        }
      }
      var result = Parser.parse(testMsg)
      expect(result.tags.public_key).to.deep.equal(pubKey)
      delete result.tags.public_key
      expect(result).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult, privateKey)).to.equal(testMsg)
    })
  })

  describe('Check requirements', () => {
    it ('fails when no public key hash', ()=> {
      var testMsg = 'lnbc1pvjluezdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w'
      assert.throws(() => Parser.parse(testMsg), Error)
    })

    it ('fails when two public key hash', ()=> {
      var testMsg = 'lnbc1pvjluezlnbc1pvjluezdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784wlnbc1pvjluezdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784wdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w'
      assert.throws(() => Parser.parse(testMsg), Error)
    })

    it ('skips over bad tags', ()=> {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp98yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqscc6gd6ql3jrc5yzme8v4ntcewwz5cnw92tz0pc8qcuufvq7khhr8wpald05e92xw006sq94mg8v2ndf4sefvf9sygkshp5zfem29trqq2yxxz7'
      assert.throws(() => Parser.parse(testMsg), Error)
    })

    it ('fails when tags have incorrect padding', ()=> {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqpcc6gd6ql3jrc5yzme8v4ntcewwz5cnw92tz0pc8qcuufvq7khhr8wpald05e92xw006sq94mg8v2ndf4sefvf9sygkshp5zfem29trqq2yxxz7'
      assert.throws(() => Parser.parse(testMsg), Error)
    })

    it ('has short description and hash of description both', ()=> {
      var testMsg = 'lnbc1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w'
      assert.throws(() => Parser.parse(testMsg), Error)
    })
    it ('signature is invalid', ()=> {
      var testMsg = 'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03lcqca784w'
      assert.throws(() => Parser.parse(testMsg), Error)
    })
    it ('checksum is invalid', ()=> {
      var testMsg = 'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784a'
      assert.throws(() => Parser.parse(testMsg), Error)
    })

  })
})
