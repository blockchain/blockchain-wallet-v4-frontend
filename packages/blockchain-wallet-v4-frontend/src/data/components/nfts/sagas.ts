import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { errorHandler } from '@core/utils'
import { selectors } from 'data'

import { actions as A } from './slice'

export const logLocation = 'components/simpleBuy/sagas'

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
      const nfts: ReturnType<typeof api.getNftOrders> = yield call(api.getNftOrders)

      yield put(A.fetchNftOrdersSuccess(nfts.orders))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftOrdersFailure(error))
    }
  }

  return {
    fetchNftAssets,
    fetchNftOrders
  }
}
