import { head, keys, mergeRight, prop, isNil, isEmpty } from 'ramda'
import { call, put, select } from 'redux-saga/effects'
import { set } from 'ramda-lens'
import * as A from './actions'
import { Map } from 'immutable-ext'
import { KVStoreEntry } from '../../../types'
import { getMetadataXpriv } from '../root/selectors'
import { SUPPORTED_ERC20_TOKENS } from './model'
import { derivationMap, ETH } from '../config'
import * as eth from '../../../utils/eth'
import { getMnemonic } from '../../wallet/selectors'
import { callTask } from '../../../utils/functional'

export default ({ api, networks } = {}) => {
  const deriveAccount = function * (password) {
    try {
      const obtainMnemonic = state => getMnemonic(state, password)
      const mnemonicT = yield select(obtainMnemonic)
      const mnemonic = yield callTask(mnemonicT)
      const defaultIndex = 0
      const addr = eth.deriveAddress(mnemonic, defaultIndex)

      return { defaultIndex, addr }
    } catch (e) {
      throw new Error(
        '[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createEth saga'
      )
    }
  }

  const createEth = function * ({ kv, password }) {
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
      erc20: SUPPORTED_ERC20_TOKENS,
      tx_notes: {},
      last_tx: null,
      legacy_account: null,
      last_tx_timestamp: null
    }
    const newkv = set(KVStoreEntry.value, { ethereum }, kv)
    yield put(A.createMetadataEth(newkv))
  }

  const transitionFromLegacy = function * ({ newkv, password }) {
    const { defaultIndex, addr } = yield call(deriveAccount, password)
    const defaultAccount = Map(newkv.value.ethereum.accounts[defaultIndex])
    newkv.value.ethereum.legacy_account = defaultAccount.toJS()
    newkv.value.ethereum.accounts[defaultIndex].addr = addr
    newkv.value.ethereum.accounts[defaultIndex].correct = true
    newkv.value.ethereum.erc20 = SUPPORTED_ERC20_TOKENS
    yield put(A.fetchMetadataEthSuccess(newkv))
  }

  const fetchMetadataEth = function * (secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[ETH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataEthLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createEth), { kv })
      } else if (
        newkv.value.ethereum &&
        !prop('correct', head(newkv.value.ethereum.accounts))
      ) {
        yield call(secondPasswordSagaEnhancer(transitionFromLegacy), { newkv })
      } else {
        if (
          keys(newkv.value.erc20).length !== keys(SUPPORTED_ERC20_TOKENS).length
        ) {
          // missing 1 or more supported token entries, sync with model
          newkv.value.ethereum.erc20 = mergeRight(
            SUPPORTED_ERC20_TOKENS,
            newkv.value.ethereum.erc20
          )
        }
        yield put(A.fetchMetadataEthSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataEthFailure(e.message))
    }
  }

  return {
    createEth,
    deriveAccount,
    fetchMetadataEth,
    transitionFromLegacy
  }
}
