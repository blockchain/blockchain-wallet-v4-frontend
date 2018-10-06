import { call, put, select } from 'redux-saga/effects'
import { compose, isNil, isEmpty } from 'ramda'
import { set } from 'ramda-lens'
import * as A from './actions'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, XLM } from '../config'
import { getMnemonic } from '../../wallet/selectors'

import BIP39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'
import * as StellarSdk from 'stellar-sdk'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api, networks } = {}) => {
  const callTask = function*(task) {
    return yield call(
      compose(
        taskToPromise,
        () => task
      )
    )
  }

  const createXlm = function*({ kv, password }) {
    try {
      const mnemonicT = yield select(getMnemonic, password)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      const seed = yield call(BIP39.mnemonicToSeed, mnemonic)
      const seedHex = seed.toString('hex')
      const masterKey = yield call(ed25519.derivePath, "m/44'/148'/0'", seedHex)
      const keypair = StellarSdk.Keypair.fromRawEd25519Seed(masterKey.key)
      const xlm = {
        default_account_idx: 0,
        accounts: [
          {
            publicKey: keypair.publicKey(),
            secret: keypair.secret(),
            label: 'My Stellar Wallet',
            archived: false
          }
        ]
      }
      const newkv = set(KVStoreEntry.value, xlm, kv)
      yield put(A.createMetadataXlm(newkv))
    } catch (e) {
      throw new Error(
        '[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createXlm saga'
      )
    }
  }

  const fetchMetadataXlm = function*(secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[XLM]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataXlmLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createXlm), { kv })
      } else {
        yield put(A.fetchMetadataXlmSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataXlmFailure(e.message))
    }
  }

  return {
    createXlm,
    fetchMetadataXlm
  }
}
