import { expect } from 'chai'
import Parser from '../../src/ln/crypto/payment_parser.js'

const assert = require('assert')

describe('Payment parser', () => {
  describe('Parse Messages', () => {
    it('parses payment hash and short description', () => {
      var testMsg = 'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'description': 'Please consider supporting this project'
        },
        'signature': [56, 236, 104, 145, 52, 94, 32, 65, 69, 190, 138, 58, 153, 222, 56, 233, 138, 57, 214, 165, 105, 67, 78, 24, 69, 200, 175, 114, 5, 175, 207, 204, 127, 66, 95, 205, 20, 99, 233, 60, 50, 136, 30, 173, 13, 110, 53, 109, 70, 126, 200, 192, 37, 83, 249, 170, 177, 94, 87, 56, 177, 31, 18, 127, 0],
        'checksum': 'ca784w'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
    })

    it('parses expiry time', () => {
      var testMsg = 'lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.0025,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'description': '1 cup coffee',
          'expiry_time': 60
        },
        'signature': [232, 150, 57, 186, 104, 20, 227, 102, 137, 212, 185, 27, 241, 37, 241, 3, 81, 181, 93, 160, 87, 176, 6, 71, 168, 218, 186, 235, 138, 144, 201, 95, 22, 15, 157, 90, 110, 15, 121, 209, 252, 43, 150, 66, 56, 185, 68, 226, 250, 74, 166, 119, 198, 240, 32, 212, 102, 71, 42, 184, 66, 189, 117, 14, 1],
        'checksum': 'fj9srp'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
    })

    it('parses min final exprity time', () => {
      var testMsg = 'lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jscqptaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.0025,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'description': '1 cup coffee',
          'min_cltv_expiry_time': 11
        },
        'signature': [232, 150, 57, 186, 104, 20, 227, 102, 137, 212, 185, 27, 241, 37, 241, 3, 81, 181, 93, 160, 87, 176, 6, 71, 168, 218, 186, 235, 138, 144, 201, 95, 22, 15, 157, 90, 110, 15, 121, 209, 252, 43, 150, 66, 56, 185, 68, 226, 250, 74, 166, 119, 198, 240, 32, 212, 102, 71, 42, 184, 66, 189, 117, 14, 1],
        'checksum': 'fj9srp'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
    })

    it('parses hash of description', () => {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqscc6gd6ql3jrc5yzme8v4ntcewwz5cnw92tz0pc8qcuufvq7khhr8wpald05e92xw006sq94mg8v2ndf4sefvf9sygkshp5zfem29trqq2yxxz7'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193]
        },
        'signature': [198, 52, 134, 232, 31, 140, 135, 138, 16, 91, 201, 217, 89, 175, 25, 115, 133, 76, 77, 197, 82, 196, 240, 224, 224, 199, 56, 150, 3, 214, 189, 198, 119, 7, 191, 107, 233, 146, 168, 206, 123, 245, 0, 22, 187, 65, 216, 169, 181, 53, 134, 82, 196, 150, 4, 69, 161, 112, 208, 73, 206, 212, 85, 140, 0],
        'checksum': '2yxxz7'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
    })

    it('parses p2pkh', () => {
      var testMsg = 'lntb20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfpp3x9et2e20v6pu37c5d9vax37wxq72un98kmzzhznpurw9sgl2v0nklu2g4d0keph5t7tj9tcqd8rexnd07ux4uv2cjvcqwaxgj7v4uwn5wmypjd5n69z2xm3xgksg28nwht7f6zspwp3f9t'
      var expectedResult = {
        'prefix': 'lntb',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'P2PKH': [49, 114, 181, 101, 79, 102, 131, 200, 251, 20, 105, 89, 211, 71, 206, 48, 60, 174, 76, 167],
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193]
        },
        'signature': [182, 196, 43, 138, 97, 224, 220, 88, 35, 234, 99, 231, 111, 241, 72, 171, 95, 108, 134, 244, 95, 151, 34, 175, 0, 105, 199, 147, 77, 175, 247, 13, 94, 49, 88, 147, 48, 7, 116, 200, 151, 153, 94, 58, 116, 118, 200, 25, 54, 147, 209, 68, 163, 110, 38, 69, 160, 133, 30, 110, 186, 252, 157, 10, 1],
        'checksum': 'wp3f9t'
      }
      expect(Parser.parse(Parser.encode(expectedResult))).to.deep.equal(expectedResult)
    })
    it('parses routing info', () => {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfpp3qjmp7lwpagxun9pygexvgpjdc4jdj85fr9yq20q82gphp2nflc7jtzrcazrra7wwgzxqc8u7754cdlpfrmccae92qgzqvzq2ps8pqqqqqqqqqqqq9qqqvpeuqafqxu92d8lr6fvg0r5gv0heeeqgcrqlnm6jhphu9y00rrhy4grqszsvpcgpy9qqqqqqqqqqqq7qqzqfnlkwydm8rg30gjku7wmxmk06sevjp53fmvrcfegvwy7d5443jvyhxsel0hulkstws7vqv400q4j3wgpk4crg49682hr4scqvmad43cqd5m7tf'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'P2PKH': [4, 182, 31, 125, 193, 234, 13, 201, 148, 36, 70, 76, 196, 6, 77, 197, 100, 217, 30, 137],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193],
          'route': [{
            'pubkey': [2, 158, 3, 169, 1, 184, 85, 52, 255, 30, 146, 196, 60, 116, 67, 31, 124, 231, 32, 70, 6, 15, 207, 122, 149, 195, 126, 20, 143, 120, 199, 114, 85],
            'short_channel_id': [1, 2, 3, 4, 5, 6, 7, 8],
            'fee': [0, 0, 0, 0, 0, 0, 0, 20],
            'cltv_expiry_delta': 3
          },
            {
              'pubkey': [3, 158, 3, 169, 1, 184, 85, 52, 255, 30, 146, 196, 60, 116, 67, 31, 124, 231, 32, 70, 6, 15, 207, 122, 149, 195, 126, 20, 143, 120, 199, 114, 85],
              'short_channel_id': [3, 4, 5, 6, 7, 8, 9, 10],
              'fee': [0, 0, 0, 0, 0, 0, 0, 30],
              'cltv_expiry_delta': 4
            }]
        },
        'signature': [76, 255, 103, 17, 187, 56, 209, 23, 162, 86, 231, 157, 179, 110, 207, 212, 50, 201, 6, 145, 78, 216, 60, 39, 40, 99, 137, 230, 210, 181, 140, 152, 75, 154, 25, 251, 239, 207, 218, 11, 116, 60, 192, 50, 175, 120, 43, 40, 185, 1, 181, 112, 52, 84, 186, 58, 174, 58, 195, 0, 102, 250, 218, 199, 0],
        'checksum': 'd5m7tf'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
    })
    it('parses p2sh', () => {
      var testMsg = 'lnbc20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfppj3a24vwu6r8ejrss3axul8rxldph2q7z9kmrgvr7xlaqm47apw3d48zm203kzcq357a4ls9al2ea73r8jcceyjtya6fu5wzzpe50zrge6ulk4nvjcpxlekvmxl6qcs9j3tz0469gq5g658y'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193],
          'P2SH': [143, 85, 86, 59, 154, 25, 243, 33, 194, 17, 233, 185, 243, 140, 223, 104, 110, 160, 120, 69]
        },
        'signature': [182, 198, 134, 15, 198, 255, 65, 186, 251, 161, 116, 91, 83, 139, 106, 124, 108, 44, 2, 52, 247, 107, 248, 23, 191, 86, 123, 232, 140, 242, 198, 50, 73, 44, 157, 210, 121, 71, 8, 65, 205, 30, 33, 163, 58, 231, 237, 89, 178, 88, 9, 191, 155, 51, 102, 254, 129, 136, 22, 81, 88, 159, 93, 21, 0],
        'checksum': '5g658y'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.parse(Parser.encode(expectedResult))).to.deep.equal(expectedResult)
    })
    it('parses P2WPKH', () => {
      var testMsg = 'lnbc20m1pvjluezhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqfppqw508d6qejxtdg4y5r3zarvary0c5xw7kepvrhrm9s57hejg0p662ur5j5cr03890fa7k2pypgttmh4897d3raaq85a293e9jpuqwl0rnfuwzam7yr8e690nd2ypcq9hlkdwdvycqa0qza8'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193],
          'segwit': {
            'version': 0,
            'payload': [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214]
          },
        },
        'signature': [200, 88, 59, 143, 101, 133, 61, 124, 201, 15, 14, 180, 174, 14, 146, 166, 6, 248, 156, 175, 79, 125, 101, 4, 129, 66, 215, 187, 212, 229, 243, 98, 62, 244, 7, 167, 84, 88, 228, 178, 15, 0, 239, 188, 115, 79, 28, 46, 239, 196, 25, 243, 162, 190, 109, 81, 3, 128, 22, 255, 179, 92, 214, 19, 0],
        'checksum': 'a0qza8'
      }
      expect(Parser.parse(Parser.encode(expectedResult))).to.deep.equal(expectedResult)
    })
    it('parses P2WSH', () => {
      var testMsg = 'lnbc20m1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqhp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsfp4qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q28j0v3rwgy9pvjnd48ee2pl8xrpxysd5g44td63g6xcjcu003j3qe8878hluqlvl3km8rm92f5stamd3jw763n3hck0ct7p8wwj463cql26ava'
      var expectedResult = {
        'prefix': 'lnbc',
        'timestamp': 1496314658,
        'amount': 0.02,
        'tags': {
          'payment_hash': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
          'purpose_of_payment': [57, 37, 182, 246, 126, 44, 52, 0, 54, 237, 18, 9, 61, 212, 78, 3, 104, 223, 27, 110, 162, 108, 83, 219, 228, 129, 31, 88, 253, 93, 184, 193],
          'segwit': {
            'version': 0,
            'payload': [24, 99, 20, 60, 20, 197, 22, 104, 4, 189, 25, 32, 51, 86, 218, 19, 108, 152, 86, 120, 205, 77, 39, 161, 184, 198, 50, 150, 4, 144, 50, 98]
          },
        },
        'signature': [81, 228, 246, 68, 110, 65, 10, 22, 74, 109, 169, 243, 149, 7, 231, 48, 194, 98, 65, 180, 69, 106, 182, 234, 40, 209, 177, 44, 113, 239, 140, 162, 12, 156, 254, 61, 255, 192, 125, 159, 141, 182, 113, 236, 170, 77, 32, 190, 237, 177, 147, 189, 168, 206, 55, 197, 159, 133, 248, 39, 115, 165, 93, 71, 0],
        'checksum': 'l26ava'
      }
      expect(Parser.parse(testMsg)).to.deep.equal(expectedResult)
      expect(Parser.encode(expectedResult)).to.equal(testMsg)
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
  })
})
