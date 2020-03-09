import * as A from './actions'
import * as eth from '../../../utils/eth'
import {
  assoc,
  filter,
  forEach,
  head,
  includes,
  isEmpty,
  isNil,
  keys,
  path,
  pathOr,
  prop,
  toLower
} from 'ramda'
import { call, put, select } from 'redux-saga/effects'
import { callTask } from '../../../utils/functional'
import { derivationMap, ETH } from '../config'
import {
  getErc20CoinList,
  getSupportedCoins
} from '../../walletOptions/selectors'
import { getMetadataXpriv } from '../root/selectors'
import { getMnemonic } from '../../wallet/selectors'
import { KVStoreEntry } from '../../../types'
import { Map } from 'immutable-ext'
import { set } from 'ramda-lens'

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

  const buildErc20Entry = (token, coinModels) => ({
    label: `My ${coinModels[token].displayName} Wallet`,
    contract: path([token, 'contractAddress'], coinModels),
    has_seen: false,
    tx_notes: {}
  })

  const createNewErc20Entry = function * () {
    const entries = {}
    const erc20List = (yield select(getErc20CoinList)).getOrFail()
    const coinModels = (yield select(getSupportedCoins)).getOrFail()
    forEach(token => {
      entries[toLower(token)] = buildErc20Entry(token, coinModels)
    }, erc20List)
    return entries
  }

  const createEth = function * ({ kv, password }) {
    const { defaultIndex, addr } = yield call(deriveAccount, password)
    const erc20Entry = yield call(createNewErc20Entry)
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
      erc20: erc20Entry,
      tx_notes: {},
      last_tx: null,
      legacy_account: null,
      last_tx_timestamp: null
    }
    const newkv = set(KVStoreEntry.value, { ethereum }, kv)
    yield put(A.createMetadataEth(newkv))
  }

  const createErc20 = function * ({ newkv }) {
    const erc20List = (yield select(getErc20CoinList)).getOrFail()
    const coinModels = (yield select(getSupportedCoins)).getOrFail()
    const erc20 = pathOr({}, ['value', 'ethereum', 'erc20'], newkv)
    const newTokens = filter(c => !includes(toLower(c), keys(erc20)), erc20List)
    forEach(token => {
      erc20[toLower(token)] = buildErc20Entry(token, coinModels)
    }, newTokens)
    const ethereum = assoc('erc20', erc20, newkv.value.ethereum)
    const newkvErc20 = set(KVStoreEntry.value, { ethereum }, newkv)
    yield put(A.fetchMetadataEthSuccess(newkvErc20))
  }

  const transitionFromLegacy = function * ({ newkv, password }) {
    const { defaultIndex, addr } = yield call(deriveAccount, password)
    const erc20Entry = yield call(createNewErc20Entry)
    const defaultAccount = Map(newkv.value.ethereum.accounts[defaultIndex])
    newkv.value.ethereum.legacy_account = defaultAccount.toJS()
    newkv.value.ethereum.accounts[defaultIndex].addr = addr
    newkv.value.ethereum.accounts[defaultIndex].correct = true
    newkv.value.ethereum.erc20 = erc20Entry
    yield put(A.fetchMetadataEthSuccess(newkv))
  }

  const updatePaxLabelToUSDDigital = function * ({ newkv }) {
    const coinModels = (yield select(getSupportedCoins)).getOrFail()

    newkv.value.ethereum.erc20.pax.label = `My ${coinModels['PAX'].displayName} Wallet`
    yield put(A.fetchMetadataEthSuccess(newkv))
  }

  const fetchMetadataEth = function * (secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[ETH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataEthLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      const erc20List = (yield select(getErc20CoinList)).getOrFail()
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createEth), { kv })
      } else if (
        newkv.value.ethereum &&
        !prop('correct', head(newkv.value.ethereum.accounts))
      ) {
        yield call(secondPasswordSagaEnhancer(transitionFromLegacy), { newkv })
      } else if (keys(newkv.value.ethereum.erc20).length !== erc20List.length) {
        // missing 1 or more supported erc20 token entries, add each to kvStore
        yield call(createErc20, { newkv })
      } else if (newkv.value.ethereum.erc20.pax.label === 'My USD Pax Wallet') {
        yield call(updatePaxLabelToUSDDigital, { newkv })
      } else {
        yield put(A.fetchMetadataEthSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataEthFailure(e.message))
    }
  }

  return {
    createEth,
    createNewErc20Entry,
    deriveAccount,
    fetchMetadataEth,
    transitionFromLegacy
  }
}
