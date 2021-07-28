import { Map } from 'immutable-ext'
import { forEach, head, isEmpty, isNil, path, pathOr, prop, toLower } from 'ramda'
import { set } from 'ramda-lens'
import { call, put, select } from 'redux-saga/effects'

import { KVStoreEntry } from '../../../types'
import * as eth from '../../../utils/eth'
import { callTask } from '../../../utils/functional'
import { getMnemonic } from '../../wallet/selectors'
import { derivationMap, ETH } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import * as A from './actions'

const ACCT_NAME = 'Private Key Wallet'

export default ({ api, networks } = {}) => {
  const deriveAccount = function* (password) {
    try {
      const obtainMnemonic = (state) => getMnemonic(state, password)
      const mnemonicT = yield select(obtainMnemonic)
      const mnemonic = yield callTask(mnemonicT)
      const defaultIndex = 0
      const addr = eth.deriveAddress(mnemonic, defaultIndex)

      return { addr, defaultIndex }
    } catch (e) {
      throw new Error('[NOT IMPLEMENTED] MISSING_SECOND_PASSWORD in core.createEth saga')
    }
  }

  const buildErc20Entry = (token, contract, existingNotes) => ({
    contract,
    has_seen: false,
    label: ACCT_NAME,
    tx_notes: existingNotes || {}
  })

  const createNewErc20Entry = function () {
    const entries = {}
    // TODO: erc20 phase 2, remove this whitelist
    const coins = ['AAVE', 'PAX', 'USDT', 'WDGLD', 'YFI']
    forEach((token) => {
      const { coinfig } = window.coins[token]
      const contract = coinfig.type.erc20Address
      entries[toLower(token)] = buildErc20Entry(token, contract)
    }, coins)
    return entries
  }

  const createEth = function* ({ kv, password }) {
    const { addr, defaultIndex } = yield call(deriveAccount, password)
    const erc20Entry = yield call(createNewErc20Entry)
    const ethereum = {
      accounts: [
        {
          addr,
          archived: false,
          correct: true,
          label: ACCT_NAME
        }
      ],
      default_account_idx: defaultIndex,
      erc20: erc20Entry,
      has_seen: true,
      last_tx: null,
      last_tx_timestamp: null,
      legacy_account: null,
      tx_notes: {}
    }
    const newkv = set(KVStoreEntry.value, { ethereum }, kv)
    yield put(A.createMetadataEth(newkv))
  }

  const transitionFromLegacy = function* ({ newkv, password }) {
    const { addr, defaultIndex } = yield call(deriveAccount, password)
    const erc20Entry = yield call(createNewErc20Entry)
    const defaultAccount = Map(newkv.value.ethereum.accounts[defaultIndex])
    newkv.value.ethereum.legacy_account = defaultAccount.toJS()
    newkv.value.ethereum.accounts[defaultIndex].addr = addr
    newkv.value.ethereum.accounts[defaultIndex].correct = true
    newkv.value.ethereum.erc20 = erc20Entry
    yield put(A.fetchMetadataEthSuccess(newkv))
  }

  const fetchMetadataEth = function* (secondPasswordSagaEnhancer) {
    try {
      const typeId = derivationMap[ETH]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataEthLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(secondPasswordSagaEnhancer(createEth), { kv })
      } else if (newkv.value.ethereum && !prop('correct', head(newkv.value.ethereum.accounts))) {
        yield call(secondPasswordSagaEnhancer(transitionFromLegacy), { newkv })
      } else {
        // TODO: erc20 phase 2, remove this whitelist, figure out plan
        // for storing transaction notes per hash
        const erc20List = ['AAVE', 'PAX', 'USDT', 'WDGLD', 'YFI']
        // use new ETH account label
        newkv.value.ethereum.accounts[0].label = ACCT_NAME
        // create fake metadata entries for erc20 assets
        const erc20 = pathOr({}, ['value', 'ethereum', 'erc20'], newkv)
        forEach((token) => {
          const { coinfig } = window.coins[token]
          const contract = coinfig.type.erc20Address
          erc20[toLower(token)] = buildErc20Entry(token, contract, erc20[toLower(token)]?.tx_notes)
        }, erc20List)
        const { ethereum } = newkv.value
        const updatedKv = set(KVStoreEntry.value, { ethereum }, newkv)
        yield put(A.fetchMetadataEthSuccess(updatedKv))
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
