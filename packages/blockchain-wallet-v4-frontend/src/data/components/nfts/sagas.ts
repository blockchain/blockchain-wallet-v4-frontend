import { ethers } from 'ethers'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { CollectionData } from '@core/network/api/nfts/types'
import { cancelNftListings, fulfillNftOrder, fulfillNftSellOrder } from '@core/redux/payment/nfts'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import { orderFromJSON } from './utils'

const provider = ethers.providers.getDefaultProvider()
export const logLocation = 'components/nfts/sagas'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const fetchNftAssets = function* () {
    try {
      const assets = S.getNftAssets(yield select())
      if (assets.atBound) return
      yield put(A.fetchNftAssetsLoading())
      const ethAddrR = selectors.core.kvStore.eth.getDefaultAddress(yield select())
      const ethAddr = ethAddrR.getOrFail('No ETH address.')
      const nfts: ReturnType<typeof api.getNftAssets> = yield call(
        api.getNftAssets,
        ethAddr,
        assets.page
      )

      if (nfts.assets.length < NFT_ORDER_PAGE_LIMIT) {
        yield put(A.setAssetsState({ atBound: true }))
      } else {
        yield put(A.setAssetsState({ atBound: false, page: assets.page + 1 }))
      }

      yield put(A.fetchNftAssetsSuccess(nfts.assets))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftAssetsFailure(error))
    }
  }

  const fetchNftOrders = function* () {
    try {
      const marketplace = S.getMarketplace(yield select())
      if (!marketplace.collection) throw new Error('Must select a collection')

      yield put(A.fetchNftOrdersLoading())

      // get recent events for the collection
      const { asset_events } = yield call(
        api.getNftRecentEvents,
        marketplace.collection.slug,
        marketplace.page
      )
      // map events to token_ids
      const token_ids: string[] = asset_events.map((e) => e.asset?.token_id).filter(Boolean)
      // get previously queried token_ids
      const { token_ids_queried } = marketplace
      // uniquify old and new token_ids
      const new_unique_token_ids = [...new Set(token_ids)].filter(
        (id) => !token_ids_queried.includes(id)
      )

      // fetch nfts for new token_ids
      const nfts: ReturnType<typeof api.getNftOrders> = yield call(
        api.getNftOrders,
        NFT_ORDER_PAGE_LIMIT,
        marketplace.collection.collection_data.primary_asset_contracts[0].address,
        new_unique_token_ids.map((val) => `&token_ids=${val}`).join('')
      )

      const nextPage = marketplace.page + 1
      // when there are no more unique token_ids, we are done
      const atBound = new_unique_token_ids.every((id) => token_ids_queried.includes(id))
      // update marketplace state
      yield put(
        A.setMarketplaceData({
          atBound,
          page: nextPage,
          token_ids_queried: new_unique_token_ids.concat(token_ids_queried)
        })
      )
      // map orders to order objects
      const orders = nfts.orders.map(orderFromJSON).reduce((prev, curr) => {
        const prevOrder = prev.find((order) => order.asset?.tokenId === curr.asset?.tokenId)

        // if order already exists, use cheapest order
        if (prevOrder) {
          return prevOrder.basePrice < curr.basePrice
            ? prev
            : [...prev.filter((order) => order.asset?.tokenId !== curr.asset?.tokenId), curr]
        }

        return [...prev, curr]
      }, [] as ReturnType<typeof orderFromJSON>[])
      // set orders to state
      yield put(A.fetchNftOrdersSuccess(orders))
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

  const formInitialized = function* (action) {
    if (action.meta.form !== 'nftMarketplace') return

    try {
      const res: CollectionData = yield call(api.getNftCollectionInfo, action.payload.collection)
      yield put(
        A.setMarketplaceData({
          collection: res
        })
      )
      yield put(A.fetchNftOrders())
    } catch (e) {
      console.log(e)
    }
  }

  const formChanged = function* (action) {
    if (action.meta.form === 'nftMarketplace') {
      if (action.meta.field === 'collection') {
        try {
          yield put(A.resetNftOrders())
          const res: CollectionData = yield call(api.getNftCollectionInfo, action.payload)
          yield put(
            A.setMarketplaceData({
              atBound: false,
              collection: res,
              page: 1,
              token_ids_queried: []
            })
          )
          yield put(A.fetchNftOrders())
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (action.meta.form === 'nftCollection') {
      if (action.meta.field === 'collection') {
        yield put(A.setAssetsState({ atBound: false, page: 0 }))
      }
    }
  }

  const nftOrderFlowOpen = function* (action: ReturnType<typeof A.nftOrderFlowOpen>) {
    yield put(actions.modals.showModal(ModalName.NFT_ORDER, { origin: 'Unknown' }))
    try {
      yield put(actions.components.nfts.fetchNftOrderAssetLoading())
      const asset = yield call(
        api.getNftAsset,
        action.payload.order.asset!.assetContract!.address,
        action.payload.order.asset!.tokenId!
      )
      yield put(actions.components.nfts.fetchNftOrderAssetSuccess(asset))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.components.nfts.fetchNftOrderAssetFailure(error))
    }
  }

  const nftOrderFlowClose = function* () {
    yield put(actions.modals.closeAllModals())
  }

  return {
    cancelListings,
    createBuyOrder,
    createSellOrder,
    fetchNftAssets,
    fetchNftOrders,
    formChanged,
    formInitialized,
    nftOrderFlowClose,
    nftOrderFlowOpen
  }
}
