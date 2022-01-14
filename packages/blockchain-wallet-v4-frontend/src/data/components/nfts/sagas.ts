import { ethers, Signer } from 'ethers'
import moment from 'moment'
import { call, put, select } from 'redux-saga/effects'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  CollectionData,
  ExplorerGatewayNftCollectionType,
  GasCalculationOperations,
  GasDataI,
  Order,
  RawOrder
} from '@core/network/api/nfts/types'
import {
  calculateGasFees,
  cancelNftOrder,
  fulfillNftOrder,
  fulfillNftSellOrder,
  fulfillTransfer,
  getNftBuyOrders,
  getNftSellOrder
} from '@core/redux/payment/nfts'
import {
  OPENSEA_SHARED_MARKETPLACE,
  WETH_ADDRESS,
  WETH_ADDRESS_RINKEBY
} from '@core/redux/payment/nfts/utils'
import { Await } from '@core/types'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import { NftOrderStepEnum } from './types'
import { orderFromJSON } from './utils'

export const logLocation = 'components/nfts/sagas'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const IS_TESTNET = api.ethProvider.network?.name === 'rinkeby'

  const clearAndRefetchAssets = function* () {
    yield put(A.resetNftAssets())
    yield put(A.fetchNftAssets())
  }

  const clearAndRefetchOrders = function* () {
    yield put(A.resetNftOrders())
    yield put(A.fetchNftOrders())
  }

  const clearAndRefetchOffersMade = function* () {
    yield put(A.resetNftOffersMade())
    yield put(A.fetchNftOffersMade())
  }

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

      if (nfts.length < NFT_ORDER_PAGE_LIMIT) {
        yield put(A.setAssetBounds({ atBound: true }))
      } else {
        yield put(A.setAssetData({ page: assets.page + 1 }))
      }

      yield put(A.fetchNftAssetsSuccess(nfts))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftAssetsFailure(error))
    }
  }

  const fetchNftCollections = function* (action: ReturnType<typeof A.fetchNftCollections>) {
    try {
      const collections = S.getNftCollections(yield select())
      if (Remote.Success.is(collections) && !action.payload.direction && !action.payload.sortBy)
        return
      yield put(A.fetchNftCollectionsLoading())
      const response: ReturnType<typeof api.getNftCollections> = yield call(
        api.getNftCollections,
        action.payload.sortBy,
        action.payload.direction
      )
      // filter crypto punks, or others
      const exclusionList = ['CryptoPunks']
      const excludeCollections = (collection: ExplorerGatewayNftCollectionType) => {
        return !(exclusionList.indexOf(collection.name) > -1)
      }
      // filter collections w/ no img
      const hasImageUrl = (collection: ExplorerGatewayNftCollectionType) => collection.image_url

      const nfts = response.filter(excludeCollections).filter(hasImageUrl)
      yield put(A.fetchNftCollectionsSuccess(nfts))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftCollectionsFailure(error))
    }
  }

  const fetchNftOffersMade = function* () {
    try {
      const offers = S.getOffersMade(yield select())
      if (offers.atBound) return
      yield put(A.fetchNftOffersMadeLoading())
      const ethAddrR = selectors.core.kvStore.eth.getDefaultAddress(yield select())
      const ethAddr = ethAddrR.getOrFail('No ETH address.')
      const { asset_events }: ReturnType<typeof api.getOffersMade> = yield call(
        api.getOffersMade,
        ethAddr,
        offers.page
      )

      if (asset_events.length < NFT_ORDER_PAGE_LIMIT) {
        yield put(A.setOffersMadeBounds({ atBound: true }))
      } else {
        yield put(A.setOffersMadeData({ page: offers.page + 1 }))
      }

      yield put(A.fetchNftOffersMadeSuccess(asset_events))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftOffersMadeFailure(error))
    }
  }

  const fetchNftOffersForAsset = function* (action: ReturnType<typeof A.fetchNftOffersForAsset>) {
    try {
      const offers = S.getOffersForAsset(yield select())
      if (offers.atBound) return
      yield put(A.fetchNftOffersForAssetLoading())
      const ethAddrR = selectors.core.kvStore.eth.getDefaultAddress(yield select())
      const ethAddr = ethAddrR.getOrFail('No ETH address.')
      const { asset_events }: ReturnType<typeof api.getNftOffersForAsset> = yield call(
        api.getNftOffersForAsset,
        ethAddr,
        action.payload.asset_contract_address,
        action.payload.token_id,
        offers.page
      )

      if (asset_events.length < NFT_ORDER_PAGE_LIMIT) {
        yield put(A.setOffersForAssetBounds({ atBound: true }))
      } else {
        yield put(A.setOffersForAssetData({ page: offers.page + 1 }))
      }

      yield put(A.fetchNftOffersForAssetSuccess(asset_events))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftOffersForAssetFailure(error))
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
      // how many token_ids are the same?
      const non_unique_token_ids_map = {}
      let non_unique_token_ids = 0
      for (let i = 0; i < token_ids.length; i += 1) {
        if (non_unique_token_ids_map[token_ids[i]]) {
          non_unique_token_ids += 1
        } else {
          non_unique_token_ids_map[token_ids[i]] = 1
        }
      }
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
        marketplace.collection.collection_data.primary_asset_contracts[0]
          ? marketplace.collection.collection_data.primary_asset_contracts[0].address
          : OPENSEA_SHARED_MARKETPLACE,
        new_unique_token_ids.join(',')
      )

      const nextPage = marketplace.page + 1 + non_unique_token_ids
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
      // yield put(A.fetchFeesLoading())
      const signer: Signer = yield call(getEthSigner)
      let fees: GasDataI
      if (action.payload.operation === GasCalculationOperations.Buy) {
        // TODO: DONT DEFAULT TO 1 WEEK
        const expirationTime = moment().add(7, 'day').unix()
        const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
          getNftBuyOrders,
          action.payload.order,
          signer,
          action.payload.offer ? expirationTime : undefined,
          IS_TESTNET ? 'rinkeby' : 'mainnet',
          action.payload.offer,
          action.payload.paymentTokenAddress
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
      } else if (action.payload.operation === GasCalculationOperations.Accept) {
        // get active orders
        const { event } = action.payload
        const activeOrders: ReturnType<typeof api.getNftOrders> = yield call(
          api.getNftOrders,
          undefined,
          event.asset.asset_contract.address,
          event.asset.token_id,
          // TODO: rinkeby
          IS_TESTNET ? WETH_ADDRESS_RINKEBY : WETH_ADDRESS,
          0
        )
        // find the order with calldata that includes offer's from address
        // and matches the amount of the offer
        const order = activeOrders.orders.map(orderFromJSON).find((o) => {
          const nonPrefixedEthAddr = event.from_account.address.replace(/^0x/, '').toLowerCase()
          const bidAmount = event.bid_amount
          return o.calldata.includes(nonPrefixedEthAddr) && o.basePrice.toString() === bidAmount
        })
        // TODO: failure?
        if (!order) return
        // make matching orders
        const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
          getNftBuyOrders,
          order,
          signer,
          order.expirationTime.toNumber(),
          IS_TESTNET ? 'rinkeby' : 'mainnet'
        )
        // calculate atomic match fees
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Buy,
          signer,
          undefined,
          buy,
          sell
        )
        yield put(A.fetchFeesSuccess(fees))
        // set the order on state
        yield put(A.setOfferToAccept({ buy, sell }))
      } else if (action.payload.operation === GasCalculationOperations.Cancel) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Cancel,
          signer,
          action.payload.order as RawOrder
        )
        yield put(A.fetchFeesSuccess(fees))
      } else if (action.payload.operation === GasCalculationOperations.Sell) {
        const order: Await<ReturnType<typeof getNftSellOrder>> = yield call(
          getNftSellOrder,
          action.payload.asset,
          signer,
          action.payload.startPrice,
          IS_TESTNET ? 'rinkeby' : 'mainnet'
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
      } else if (action.payload.operation === GasCalculationOperations.Transfer) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Transfer,
          signer,
          undefined,
          undefined,
          undefined,
          action.payload.asset,
          action.payload.to
        )
        yield put(A.fetchFeesSuccess(fees))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFeesFailure(error))
    }
  }

  const acceptOffer = function* (action: ReturnType<typeof A.acceptOffer>) {
    try {
      yield put(A.acceptOfferLoading())
      const signer: Signer = yield call(getEthSigner)
      const { buy, gasData, sell } = action.payload
      const order = yield call(fulfillNftOrder, buy, sell, signer, gasData, true)
      yield call(api.postNftOrder, order)
      yield put(actions.modals.closeAllModals())
      yield put(A.acceptOfferSuccess())
      yield put(A.clearAndRefetchAssets())
      yield put(actions.alerts.displaySuccess(`Successfully accepted offer!`))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.acceptOfferFailure({ error }))
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const createOffer = function* (action: ReturnType<typeof A.createOffer>) {
    try {
      yield put(A.createOfferLoading())
      const signer = yield call(getEthSigner)
      const { coinfig } = window.coins[action.payload.coin || 'WETH']
      // TODO: DONT DEFAULT TO 1 WEEK
      const expirationTime = moment().add(7, 'day').unix()
      const amount = convertCoinToCoin({
        baseToStandard: false,
        coin: coinfig.symbol,
        value: action.payload.amount || '0'
      })
      const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
        getNftBuyOrders,
        action.payload.order,
        signer,
        expirationTime,
        IS_TESTNET ? 'rinkeby' : 'mainnet',
        amount,
        coinfig.type.erc20Address
      )
      const gasData: GasDataI = yield call(
        calculateGasFees,
        GasCalculationOperations.Buy,
        signer,
        undefined,
        buy,
        sell
      )
      const order = yield call(fulfillNftOrder, buy, sell, signer, gasData)
      yield call(api.postNftOrder, order)
      yield put(actions.modals.closeAllModals())
      yield put(A.createOfferSuccess(order))
      yield put(A.resetNftOrders())
      yield put(A.setMarketplaceData({ atBound: false, page: 1, token_ids_queried: [] }))
      yield put(A.clearAndRefetchOffersMade())
      yield put(A.clearAndRefetchOrders())
      yield put(A.setActiveTab('offers'))
      yield put(actions.alerts.displaySuccess(`Successfully created offer!`))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createOfferFailure(error))
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const createOrder = function* (action: ReturnType<typeof A.createOrder>) {
    try {
      yield put(A.createOrderLoading())
      const signer = yield call(getEthSigner)
      const { buy, sell }: Await<ReturnType<typeof getNftBuyOrders>> = yield call(
        getNftBuyOrders,
        action.payload.order,
        signer,
        undefined,
        IS_TESTNET ? 'rinkeby' : 'mainnet'
      )
      const order: Order = yield call(fulfillNftOrder, buy, sell, signer, action.payload.gasData)
      yield put(actions.modals.closeAllModals())
      yield put(A.createOrderSuccess(order))
      yield put(A.resetNftOrders())
      yield put(A.setMarketplaceData({ atBound: false, page: 1, token_ids_queried: [] }))
      yield put(A.fetchNftOrders())
      yield put(A.setActiveTab('my-collection'))
      yield put(
        actions.alerts.displaySuccess(
          `Successfully created order! It may take a few minutes to appear in your collection.`
        )
      )
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
        action.payload.startPrice,
        IS_TESTNET ? 'rinkeby' : 'mainnet'
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

  const createTransfer = function* (action: ReturnType<typeof A.createTransfer>) {
    try {
      yield put(A.createTransferLoading())
      const signer = yield call(getEthSigner)
      const order = yield call(fulfillTransfer, action.payload.asset, signer, action.payload.to, {
        gasLimit: action.payload.gasData.gasFees.toString(),
        gasPrice: action.payload.gasData.gasPrice.toString()
      })
      yield call(api.postNftOrder, order)
      yield put(A.clearAndRefetchAssets())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess('Transfer successful!'))
      yield put(A.createTransferSuccess(order))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.createTransferFailure(error))
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }
  }

  const cancelListing = function* (action: ReturnType<typeof A.cancelListing>) {
    try {
      const signer = yield call(getEthSigner)
      yield put(A.cancelListingLoading())
      yield call(cancelNftOrder, action.payload.sell_order, signer, action.payload.gasData)
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

  // https://etherscan.io/tx/0x4ba256c46b0aff8b9ee4cc2a7d44649bc31f88ebafd99190bc182178c418c64a
  const cancelOffer = function* (action: ReturnType<typeof A.cancelOffer>) {
    try {
      if (!action.payload.order) {
        throw new Error('No offer found. It may have expired already!')
      }
      const signer = yield call(getEthSigner)
      yield put(A.cancelOfferLoading())
      yield call(cancelNftOrder, action.payload.order, signer, action.payload.gasData)
      yield put(A.clearAndRefetchOffersMade())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled offer!`))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.alerts.displayError(error))
      yield put(A.cancelOfferFailure({ error }))
    }
  }

  const formInitialized = function* (action) {
    if (action.meta.form !== 'nftMarketplace') return

    try {
      const res: CollectionData = yield call(api.getNftCollectionInfo, action.payload.collection)
      yield put(
        A.setMarketplaceData({
          // @ts-ignore
          collection: IS_TESTNET ? { ...res, collection_data: { ...res } } : res
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
      if (action.meta.field === 'sortBy') {
        yield put(
          A.fetchNftCollections({
            direction: action.payload.split('-')[1] as 'ASC' | 'DESC',
            sortBy: action.payload.split('-')[0] as keyof ExplorerGatewayNftCollectionType
          })
        )
      }
      if (action.meta.field === 'collection') {
        try {
          yield put(A.resetNftOrders())
          const res: CollectionData = yield call(api.getNftCollectionInfo, action.payload)
          yield put(
            A.setMarketplaceData({
              atBound: false,
              // @ts-ignore
              collection: IS_TESTNET ? { ...res, collection_data: { ...res } } : res,
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
    const ethAddr = selectors.core.kvStore.eth.getDefaultAddress(yield select()).getOrElse('')
    // User wants to buy an asset
    if (action.payload.order) {
      const { asset } = action.payload.order
      address = asset!.assetContract.address
      token_id = asset!.tokenId
    }
    // User wants to sell an asset
    if (action.payload.asset) {
      address = action.payload.asset.asset_contract.address
      token_id = action.payload.asset.token_id
    }

    if (action.payload.offer) {
      // User wants to cancel offer
      if (action.payload.offer.from_account.address.toLowerCase() === ethAddr.toLowerCase()) {
        const activeOrders = yield call(
          api.getNftOrders,
          undefined,
          action.payload.offer.asset.asset_contract.address,
          action.payload.offer.asset.token_id,
          // TODO: rinkeby
          WETH_ADDRESS,
          0,
          ethAddr
        )
        const nonPrefixedEthAddr = ethAddr.replace(/^0x/, '').toLowerCase()
        const offer = activeOrders.orders.find((order) =>
          order.calldata.toLowerCase().includes(nonPrefixedEthAddr)
        )
        yield put(A.setActiveOffer({ offer }))
        yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.CANCEL_OFFER }))
      } else {
        // User wants to accept offer
        yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.ACCEPT_OFFER }))
      }
    }

    try {
      yield put(actions.components.nfts.fetchNftOrderAssetLoading())
      const asset = yield call(api.getNftAsset, address, token_id)
      yield put(
        actions.components.nfts.fetchNftOrderAssetSuccess({
          ...asset,
          sell_orders: action.payload.asset?.sell_orders?.filter(
            ({ maker }) => maker.address.toLowerCase() === ethAddr.toLowerCase()
          )
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
      if (action.payload.search) {
        const res: ReturnType<typeof api.searchNftCollectionInfo> = yield call(
          api.searchNftCollectionInfo,
          action.payload.search
        )
        yield put(A.setCollectionSearch(res))
      } else if (action.payload.asset_contract_address) {
        if (ethers.utils.isAddress(action.payload.asset_contract_address)) {
          const res = yield call(api.getAssetContract, action.payload.asset_contract_address)
          yield put(actions.form.change('nftMarketplace', 'collection', res.collection.slug))
        }
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('nftSearch'))
      yield put(actions.alerts.displayError('Sorry! We had an issue searching that collection.'))
      actions.form.setSubmitFailed('nftSearch', error)
    }
  }

  return {
    acceptOffer,
    cancelListing,
    cancelOffer,
    clearAndRefetchAssets,
    clearAndRefetchOffersMade,
    clearAndRefetchOrders,
    createOffer,
    createOrder,
    createSellOrder,
    createTransfer,
    fetchFees,
    fetchNftAssets,
    fetchNftCollections,
    fetchNftOffersForAsset,
    fetchNftOffersMade,
    fetchNftOrders,
    formChanged,
    formInitialized,
    nftOrderFlowClose,
    nftOrderFlowOpen,
    searchNftAssetContract
  }
}
