import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import Task from 'data.task'
import BIP39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'
import { set } from 'ramda-lens'

import { getMnemonic } from '../../wallet/selectors'
import { KVStoreEntry } from '../../../types'
import { derivationMap, XLM } from '../config'
import * as A from './actions'
import sagas from './sagas'

jest.spyOn(BIP39, 'mnemonicToSeed')
jest.spyOn(ed25519, 'derivePath')

const TEST_DATA = [
  {
    mnemonic:
      'illness spike retreat truth genius clock brain pass fit cave bargain toe',
    seedHex:
      'e4a5a632e70943ae7f07659df1332160937fad82587216a4c64315a0fb39497ee4a01f76ddab4cba68147977f3a147b6ad584c41808e8238a07f6cc4b582f186',
    publicKey: 'GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6',
    secret: 'SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN'
  },
  {
    mnemonic:
      'resource asthma orphan phone ice canvas fire useful arch jewel impose vague theory cushion top',
    seedHex:
      '7b36d4e725b48695c3ffd2b4b317d5552cb157c1a26c46d36a05317f0d3053eb8b3b6496ba39ebd9312d10e3f9937b47a6790541e7c577da027a564862e92811',
    publicKey: 'GAVXVW5MCK7Q66RIBWZZKZEDQTRXWCZUP4DIIFXCCENGW2P6W4OA34RH',
    secret: 'SAKS7I2PNDBE5SJSUSU2XLJ7K5XJ3V3K4UDFAHMSBQYPOKE247VHAGDB'
  },
  {
    mnemonic:
      'bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better',
    seedHex:
      '937ae91f6ab6f12461d9936dfc1375ea5312d097f3f1eb6fed6a82fbe38c85824da8704389831482db0433e5f6c6c9700ff1946aa75ad8cc2654d6e40f567866',
    publicKey: 'GC3MMSXBWHL6CPOAVERSJITX7BH76YU252WGLUOM5CJX3E7UCYZBTPJQ',
    secret: 'SAEWIVK3VLNEJ3WEJRZXQGDAS5NVG2BYSYDFRSH4GKVTS5RXNVED5AX7'
  },
  {
    mnemonic:
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    seedHex:
      '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
    publicKey: 'GB3JDWCQJCWMJ3IILWIGDTQJJC5567PGVEVXSCVPEQOTDN64VJBDQBYX',
    secret: 'SBUV3MRWKNS6AYKZ6E6MOUVF2OYMON3MIUASWL3JLY5E3ISDJFELYBRZ'
  }
]

const api = {}
const { createXlm } = sagas({ api })

const password = 'pAssword1<>!'
const kv = KVStoreEntry.createEmpty(derivationMap[XLM])

describe('Create XLM', () => {
  beforeEach(() => {
    BIP39.mnemonicToSeed.mockClear()
    ed25519.derivePath.mockClear()
  })
  TEST_DATA.forEach((testData, index) => {
    it(`Test data ${index}: should select mnemonic`, () => {
      const xlm = {
        default_account_idx: 0,
        accounts: [
          {
            publicKey: testData.publicKey,
            label: 'My Stellar Wallet',
            archived: false
          }
        ],
        tx_notes: {}
      }
      const newkv = set(KVStoreEntry.value, xlm, kv)

      return expectSaga(createXlm, { kv, password })
        .provide([[select(getMnemonic, password), Task.of(testData.mnemonic)]])
        .put(A.createMetadataXlm(newkv))
        .run()
        .then(() => {
          expect(BIP39.mnemonicToSeed).toHaveBeenCalledTimes(1)
          expect(BIP39.mnemonicToSeed).toHaveBeenCalledWith(testData.mnemonic)
          expect(ed25519.derivePath).toHaveBeenCalledTimes(1)
          expect(ed25519.derivePath).toHaveBeenCalledWith(
            "m/44'/148'/0'",
            testData.seedHex
          )
        })
    })
  })
})
