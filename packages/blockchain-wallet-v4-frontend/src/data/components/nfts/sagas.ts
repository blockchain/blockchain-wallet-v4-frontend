import { ethers } from 'ethers'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { cancelNftListings, fulfillNftOrder, fulfillNftSellOrder } from '@core/redux/payment/nfts'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

import { actions as A } from './slice'
import { orderFromJSON } from './utils'

const provider = ethers.providers.getDefaultProvider()
export const logLocation = 'components/nfts/sagas'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const fetchNftAssets = function* () {
    try {
      yield put(A.fetchNftAssetsLoading())
      const ethAddrR = selectors.core.kvStore.eth.getDefaultAddress(yield select())
      const ethAddr = ethAddrR.getOrFail('No ETH address.')
      const nfts: ReturnType<typeof api.getNftAssets> = yield call(api.getNftAssets, ethAddr)

      yield put(A.fetchNftAssetsSuccess(nfts.assets))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftAssetsFailure(error))
    }
  }

  const fetchNftOrders = function* () {
    try {
      yield put(A.fetchNftOrdersLoading())
      const nfts: ReturnType<typeof api.getNftOrders> = yield call(
        api.getNftOrders,
        50,
        0,
        '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e'
      )

      yield put(A.fetchNftOrdersSuccess(nfts.orders.map(orderFromJSON)))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftOrdersFailure(error))
    }
  }

  const getEthSigner = function* () {
    try {
      const password = yield call(promptForSecondPassword)
      const getMnemonic = (state) => selectors.core.wallet.getMnemonic(state, password)
      const mnemonicT = yield select(getMnemonic)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      const privateKey = getPrivateKey(mnemonic)
      const wallet = new ethers.Wallet(privateKey, provider)
      return wallet
    } catch (e) {
      throw new Error('Error getting eth wallet signer.')
    }
  }

  const cancelListings = function* (action: ReturnType<typeof A.cancelListings>) {
    try {
      const signer = yield call(getEthSigner)
      yield call(cancelNftListings, action.payload.asset, signer)
    } catch (e) {
      console.log(e)
    }
  }

  const createBuyOrder = function* (action: ReturnType<typeof A.createBuyOrder>) {
    try {
      const signer = yield call(getEthSigner)
      yield call(fulfillNftOrder, action.payload.order, signer)
    } catch (e) {
      console.log(e)
    }
  }

  const createSellOrder = function* (action: ReturnType<typeof A.createSellOrder>) {
    try {
      const signer = yield call(getEthSigner)
      const order = yield call(fulfillNftSellOrder, action.payload.asset, signer)
      const result = yield call(api.postNftOrder, order)
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  return {
    cancelListings,
    createBuyOrder,
    createSellOrder,
    fetchNftAssets,
    fetchNftOrders
  }
}
