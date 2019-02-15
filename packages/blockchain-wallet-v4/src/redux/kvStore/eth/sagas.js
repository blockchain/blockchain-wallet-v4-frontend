import { head, prop, isNil, isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'
import { set } from 'ramda-lens'
import * as A from './actions'
import { Map } from 'immutable-ext'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { derivationMap, ETHEREUM } from '../config'
import * as eth from '../../../utils/eth'
import { getMnemonic } from '../../wallet/selectors'
import { callTask } from '../../../utils/functional'

export default ({ api, networks } = {}) => {
  const deriveAccount = function*(password) {
    try {
      const obtainMnemonic = state => getMnemonic(state, password)
      const mnemonicT = yield select(obtainMnemonic)
      const mnemonic = yield callTask(mnemonicT)
      const defaultIndex = 0
      const addr = eth.deriveAddress(mnemonic, defaultIndex)

      return { defaultIndex, addr }
    } catch (e) {
      throw new Error(
        '[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createEthereum saga'
      )
    }
  }

  const createEthereum = function*({ kv, password }) {
    const { defaultIndex, addr } = yield call(deriveAccount, password)
    const ethereum = {
      has_seen: true,
      default_account_idx: defaultIndex,
      accounts: [
        {
          label: 'My Ether Wallet',
          archived: false,
          correct: true,
          addr: addr
        }
      ],
      tx_notes: {},
      last_tx: null,
      legacy_account: null,
      last_tx_timestamp: null
    }
    const newkv = set(KVStoreEntry.value, { ethereum }, kv)
    yield put(A.createMetadataEthereum(newkv))
  }

  const transitionFromLegacy = function*({ newkv, password }) {
    const { defaultIndex, addr } = yield call(deriveAccount, password)
    const defaultAccount = Map(newkv.value.ethereum.accounts[defaultIndex])
    newkv.value.ethereum.legacy_account = defaultAccount.toJS()
    newkv.value.ethereum.accounts[defaultIndex].addr = addr
    newkv.value.ethereum.accounts[defaultIndex].correct = true
    yield put(A.fetchMetadataEthereumSuccess(newkv))
  }

  const fetchMetadataEthereum = function*(secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[ETHEREUM]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataEthereumLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createEthereum), { kv })
      } else if (
        newkv.value.ethereum &&
        !prop('correct', head(newkv.value.ethereum.accounts))
      ) {
        yield call(secondPasswordSagaEnhancer(transitionFromLegacy), { newkv })
      } else {
        yield put(A.fetchMetadataEthereumSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataEthereumFailure(e.message))
    }
  }

  return {
    createEthereum,
    deriveAccount,
    fetchMetadataEthereum,
    transitionFromLegacy
  }
}
