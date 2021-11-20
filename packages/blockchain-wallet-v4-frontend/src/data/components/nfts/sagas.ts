import { ethers, Signer } from 'ethers'
import { call, put, select } from 'redux-saga/effects'

import { Remote } from '@core'
import { APIType } from '@core/network/api'
import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  GasCalculationOperations,
  GasDataI,
  Order,
  SellOrder
} from '@core/network/api/nfts/types'
import {
  calculateGasFees,
  cancelNftListing,
  fulfillNftOrder,
  fulfillNftSellOrder,
  getNftBuyOrders,
  getNftSellOrder
} from '@core/redux/payment/nfts'
import { Await } from '@core/types'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import { orderFromJSON } from './utils'

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
        yield put(A.setAssetBounds({ atBound: true }))
      } else {
        yield put(A.setAssetData({ page: assets.page + 1 }))
      }

      yield put(A.fetchNftAssetsSuccess(nfts.assets))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftAssetsFailure(error))
    }
  }

  const clearAndRefetchAssets = function* () {
    yield put(A.resetNftAssets())
    yield put(A.fetchNftAssets())
  }

  const clearAndRefetchOrders = function* () {
    yield put(A.resetNftOrders())
    yield put(A.fetchNftOrders())
  }

  const fetchNftCollections = function* (action: ReturnType<typeof A.fetchNftCollections>) {
    try {
      const collections = S.getNftCollections(yield select())
      if (Remote.Success.is(collections)) return
      yield put(A.fetchNftCollectionsLoading())
      const nfts: ReturnType<typeof api.getNftCollections> = yield call(
        api.getNftCollections,
        action.payload.sortBy,
        action.payload.direction
      )
      yield put(A.fetchNftCollectionsSuccess(nfts))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftCollectionsFailure(error))
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
      const wallet = new ethers.Wallet(privateKey, api.ethProvider)
      return wallet
    } catch (e) {
      throw new Error('Error getting eth wallet signer.')
    }
  }

  const fetchFees = function* (action: ReturnType<typeof A.fetchFees>) {
    try {
      yield put(A.fetchFeesLoading())
      const signer: Signer = yield call(getEthSigner)
      let fees: GasDataI
      if (action.payload.operation === GasCalculationOperations.Buy) {
        const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
          getNftBuyOrders,
          action.payload.order,
          signer
        )
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Buy,
          signer,
          undefined,
          buy,
          sell
        )
        yield put(A.fetchFeesSuccess(fees))
      } else if (action.payload.operation === GasCalculationOperations.Cancel) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Cancel,
          signer,
          action.payload.order as SellOrder
        )
        yield put(A.fetchFeesSuccess(fees))
      } else if (action.payload.operation === GasCalculationOperations.Sell) {
        const order: Await<ReturnType<typeof getNftSellOrder>> = yield call(
          getNftSellOrder,
          action.payload.asset,
          signer,
          action.payload.startPrice
        )
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Sell,
          signer,
          undefined,
          undefined,
          order
        )
        yield put(A.fetchFeesSuccess(fees))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchFeesFailure(error))
    }
  }

  const createOrder = function* (action: ReturnType<typeof A.createOrder>) {
    try {
      yield put(A.createOrderLoading())
      const signer = yield call(getEthSigner)
      const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
        getNftBuyOrders,
        action.payload.order,
        signer
      )
      const order: Order = yield call(fulfillNftOrder, buy, sell, signer, action.payload.gasData)
      yield put(actions.modals.closeAllModals())
      yield put(A.createOrderSuccess(order))
      yield put(A.resetNftOrders())
      yield put(A.setMarketplaceData({ atBound: false, page: 1, token_ids_queried: [] }))
      yield put(A.fetchNftOrders())
      yield put(actions.alerts.displaySuccess(`Successfully created order!`))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createOrderFailure(error))
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const createSellOrder = function* (action: ReturnType<typeof A.createSellOrder>) {
    try {
      yield put(A.createSellOrderLoading())
      const signer = yield call(getEthSigner)
      const signedOrder: Await<ReturnType<typeof getNftSellOrder>> = yield call(
        getNftSellOrder,
        action.payload.asset,
        signer,
        action.payload.startPrice
      )
      const order = yield call(fulfillNftSellOrder, signedOrder, signer, action.payload.gasData)
      yield call(api.postNftOrder, order)
      yield put(A.clearAndRefetchAssets())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess('Sell order created!'))
      yield put(A.createSellOrderSuccess(order))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createSellOrderFailure(error))
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const cancelListing = function* (action: ReturnType<typeof A.cancelListing>) {
    try {
      const signer = yield call(getEthSigner)
      yield put(A.cancelListingLoading())
      yield call(cancelNftListing, action.payload.sell_order, signer, action.payload.gasData)
      yield put(A.clearAndRefetchAssets())
      yield put(A.cancelListingSuccess())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled listing!`))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.alerts.displayError(error))
      yield put(A.cancelListingFailure({ error }))
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
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const formChanged = function* (action) {
    if (action.meta.form === 'nftMarketplace') {
      const formValues = selectors.form.getFormValues(action.meta.form)(yield select()) as {
        direction: 'ASC' | 'DESC'
        sortBy: keyof ExplorerGatewayNftCollectionType
      }
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
          const error = errorHandler(e)
          yield put(actions.logs.logErrorMessage(error))
        }
      }
      if (action.meta.field === 'sortBy') {
        yield put(
          A.fetchNftCollections({ direction: formValues.direction, sortBy: action.payload })
        )
      }
      if (action.meta.field === 'direction') {
        yield put(A.fetchNftCollections({ direction: action.payload, sortBy: formValues.sortBy }))
      }
    }
    if (action.meta.form === 'nftCollection') {
      if (action.meta.field === 'collection') {
        yield put(A.setAssetData({ collection: action.payload }))
      }
    }
  }

  const nftOrderFlowOpen = function* (action: ReturnType<typeof A.nftOrderFlowOpen>) {
    yield put(actions.modals.showModal(ModalName.NFT_ORDER, { origin: 'Unknown' }))
    let address
    let token_id
    // User wants to buy an asset
    if (action.payload.order) {
      const { asset } = action.payload.order
      address = asset!.assetContract.address
      token_id = asset!.tokenId
    }
    // User wants to sell an asset
    else if (action.payload.asset) {
      address = action.payload.asset.asset_contract.address
      token_id = action.payload.asset.token_id
    }

    try {
      yield put(actions.components.nfts.fetchNftOrderAssetLoading())
      const asset = yield call(api.getNftAsset, address, token_id)
      yield put(
        actions.components.nfts.fetchNftOrderAssetSuccess({
          ...asset,
          sell_orders: action.payload.asset?.sell_orders
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.components.nfts.fetchNftOrderAssetFailure(error))
    }
  }

  const nftOrderFlowClose = function* () {
    yield put(actions.modals.closeAllModals())
  }

  const searchNftAssetContract = function* (action: ReturnType<typeof A.searchNftAssetContract>) {
    try {
      yield put(actions.form.startSubmit('nftSearch'))
      const res = yield call(api.getAssetContract, action.payload.asset_contract_address)
      yield put(actions.form.stopSubmit('nftSearch'))
      yield put(actions.form.setSubmitSucceeded('nftSearch'))
      yield put(actions.form.change('nftMarketplace', 'collection', res.collection.slug))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('nftSearch'))
      yield put(actions.alerts.displayError("Sorry! We couldn't find that collection."))
      actions.form.setSubmitFailed('nftSearch', error)
    }
  }

  return {
    cancelListing,
    clearAndRefetchAssets,
    clearAndRefetchOrders,
    createOrder,
    createSellOrder,
    fetchFees,
    fetchNftAssets,
    fetchNftCollections,
    fetchNftOrders,
    formChanged,
    formInitialized,
    nftOrderFlowClose,
    nftOrderFlowOpen,
    searchNftAssetContract
  }
}
