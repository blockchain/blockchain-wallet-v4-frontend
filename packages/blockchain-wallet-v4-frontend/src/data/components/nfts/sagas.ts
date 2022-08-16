import { OrderWithCounter } from '@opensea/seaport-js/lib/types'
import BigNumber from 'bignumber.js'
import { NftFilterFormValuesType } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/NftFilter'
import { addMinutes, addSeconds, getUnixTime } from 'date-fns'
import { ethers, Signer } from 'ethers'
import { all, call, put, select } from 'redux-saga/effects'

import { Exchange, Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import {
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftTemplateParams
} from '@core/network/api/nfts/types'
import {
  calculateGasFees,
  cancelNftOrder,
  executeWrapEth,
  fulfillNftOrder,
  fulfillNftSellOrder,
  fulfillTransfer,
  getNftBuyOrder,
  getNftMatchingOrders,
  getNftSellOrder
} from '@core/redux/payment/nfts'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import {
  calculateSeaportGasFees,
  cancelOrder as cancelSeaportOrder,
  createBuyOrder,
  createListing as createSeaportSellOrder,
  fulfillOrder as fulfillSeaportOrder
} from '@core/redux/payment/nfts/seaport'
import { fungibleTokenApprovals } from '@core/redux/payment/nfts/seaport.utils'
import { Await } from '@core/types'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, selectors } from 'data'
import { ClientErrorProperties } from 'data/analytics/types/errors'
import { ModalName } from 'data/modals/types'
import { Analytics } from 'data/types'
import { AssetSortFields } from 'generated/graphql.types'
import { promptForSecondPassword } from 'services/sagas'

import profileSagas from '../../modules/profile/sagas'
import * as S from './selectors'
import { actions as A } from './slice'
import { NftOrderStatusEnum, NftOrderStepEnum } from './types'
import { assetFromJSON, nonTraitFilters, orderFromJSON } from './utils'

export const logLocation = 'components/nfts/sagas'
export const WALLET_SIGNER_ERR = 'Error getting eth wallet signer.'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))
const INSUFFICIENT_FUNDS = 'insufficient funds'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const IS_TESTNET = api.ethProvider.network?.name === 'rinkeby'
  const baseWalletUrl = IS_TESTNET
    ? 'https://login-dev.blockchain.com'
    : 'https://login.blockchain.com'

  const { generateRetailToken } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const notifyNftPurchase = function* (amount: number, value: number, address, asset: NftAsset) {
    try {
      const jwt = yield call(generateRetailToken)
      yield call(api.notifyNftPurchase, jwt, {
        amount: `${amount.toFixed(8)} ETH`,
        nft_activity_link: `${baseWalletUrl}/nfts/address/${address}`,
        nft_bidder: address || null,
        nft_image: asset.image_preview_url,
        nft_marketplace_link: `${baseWalletUrl}/nfts/assets/${asset.asset_contract.address}${asset.token_id}`,
        nft_name: `${asset.collection.name} ${asset.name || `#${asset.token_id}`}`,
        value: `${value.toFixed(2)} USD`
      })
    } catch (e) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.CLIENT_ERROR,
          properties: {
            action: 'notifyNftPurchase',
            error: e,
            title: 'Nft Notification Post Failed'
          } as ClientErrorProperties
        })
      )
    }
  }

  const fetchOpenSeaAsset = function* (action: ReturnType<typeof A.fetchOpenSeaAsset>) {
    try {
      yield put(A.fetchOpenSeaAssetLoading())
      const asset: ReturnType<typeof api.getOpenSeaAsset> = yield call(
        api.getOpenSeaAsset,
        action.payload.asset_contract_address,
        action.payload.token_id,
        action.payload.defaultEthAddr
      )
      yield put(A.fetchOpenSeaAssetSuccess(asset))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchOpenSeaAssetFailure(error))
    }
  }

  const fetchOpenseaStatus = function* () {
    try {
      yield put(A.fetchOpenseaStatusLoading())
      const res: ReturnType<typeof api.getOpenSeaStatus> = yield call(api.getOpenSeaStatus)
      yield put(A.fetchOpenseaStatusSuccess(res))
    } catch (e) {
      yield put(A.fetchOpenseaStatusFailure(e))
    }
  }

  const fetchNftOwnerAssets = function* (action: ReturnType<typeof A.fetchNftOwnerAssets>) {
    try {
      yield put(A.fetchNftOwnerAssetsLoading())
      const res: ReturnType<typeof api.getNftOwnerAssets> = yield call(
        api.getNftOwnerAssets,
        action.payload.defaultEthAddr
      )
      yield put(A.fetchNftOwnerAssetsSuccess(res))
    } catch (e) {
      yield put(A.fetchNftOwnerAssetsFailure(e))
    }
  }

  const fetchNftUserPreferences = function* () {
    try {
      const prefs = S.getNftUserPreferences(yield select())
      if (Remote.Success.is(prefs)) return
      yield put(A.fetchNftUserPreferencesLoading())
      const jwt = yield call(generateRetailToken)
      const res: ReturnType<typeof api.getNftUserPreferences> = yield call(
        api.getNftUserPreferences,
        jwt
      )

      // first time user, opt-out
      if (!res) {
        yield put(
          A.updateUserPreferences({
            userPrefs: {
              auction_expired: true,
              bid_activity: true,
              item_sold: true,
              offer_accepted: true,
              outbid: true,
              successful_purchase: true
            }
          })
        )
      }
      yield put(A.fetchNftUserPreferencesSuccess(res.userPrefs))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchNftUserPreferencesFailure(error))
    }
  }

  const updateUserPreferences = function* (action: ReturnType<typeof A.updateUserPreferences>) {
    try {
      yield put(A.fetchNftUserPreferencesLoading())
      const jwt = yield call(generateRetailToken)
      const res: ReturnType<typeof api.setNftUserPreferences> = yield call(
        api.setNftUserPreferences,
        jwt,
        action.payload.userPrefs
      )
      yield put(A.fetchNftUserPreferencesSuccess(res.userPrefs))
    } catch (e) {
      yield put(actions.alerts.displayError('Error updating notification preferences.'))
    }
  }

  const getAmountUsd = function* (coin: string, amount: number) {
    const usdPrice: ReturnType<typeof api.getPriceIndex> = yield call(
      api.getPriceIndex,
      coin,
      'USD',
      new Date().getTime()
    )
    return usdPrice.price * amount
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
      throw new Error(WALLET_SIGNER_ERR)
    }
  }

  const getGuid = function* () {
    const guid = yield select(selectors.core.wallet.getGuid)

    return guid
  }

  // 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
  // This is a very important function. Not only is it used to fetch fees
  // it is also used to create matching orders for the order/offer passed in
  // and then those matching orders are put on state.
  // It is also responsible for fetching latest pending eth transaction
  const fetchFees = function* (action: ReturnType<typeof A.fetchFees>) {
    try {
      yield put(A.fetchFeesLoading())
      const signer: ethers.Wallet = yield call(getEthSigner)
      let fees

      try {
        yield put(A.fetchLatestPendingTxsLoading())
        const { transactions: tx } = yield call(api.getEthTransactionsV2, signer.address, 0, 1)
        const isLatestTxPending =
          tx[0] && tx[0].state === 'PENDING' && tx[0].from === signer.address
        yield put(A.fetchLatestPendingTxsSuccess(isLatestTxPending))
      } catch (e) {
        yield put(A.fetchLatestPendingTxsFailure('Error fetching pending txs'))
      }

      if (action.payload.operation === GasCalculationOperations.Buy) {
        fees = yield call(calculateSeaportGasFees, {
          operation: GasCalculationOperations.Buy,
          protocol_data: action.payload.order.protocol_data,
          signer
        })
      } else if (action.payload.operation === GasCalculationOperations.AcceptOffer) {
        fees = yield call(calculateSeaportGasFees, {
          operation: GasCalculationOperations.AcceptOffer,
          protocol_data: action.payload.offer.protocol_data,
          signer
        })
      } else if (action.payload.operation === GasCalculationOperations.CancelOrder) {
        fees = yield call(calculateSeaportGasFees, {
          operation: GasCalculationOperations.CancelOrder,
          protocol_data: action.payload.order.protocol_data,
          signer
        })
      } else if (action.payload.operation === GasCalculationOperations.CancelOffer) {
        fees = yield call(calculateSeaportGasFees, {
          operation: GasCalculationOperations.CancelOffer,
          protocol_data: action.payload.offer.protocol_data,
          signer
        })
      } else if (action.payload.operation === GasCalculationOperations.Sell) {
        const { asset } = action.payload
        const signer: ethers.Wallet = yield call(getEthSigner)
        const actions = yield call(createSeaportSellOrder, {
          accountAddress: signer.address,
          execute: false,
          network: IS_TESTNET ? 'rinkeby' : 'mainnet',
          openseaAsset: assetFromJSON(asset),
          paymentTokenAddress: NULL_ADDRESS,
          quantity: 1,
          signer,
          startAmount: '0'
        })
        fees = yield call(calculateSeaportGasFees, {
          actions,
          operation: GasCalculationOperations.Sell,
          signer
        })
      } else if (action.payload.operation === GasCalculationOperations.CreateOffer) {
        const { asset, expirationTime } = action.payload
        const { coinfig } = window.coins[action.payload.coin || 'WETH']

        const actions = yield call(createBuyOrder, {
          accountAddress: signer.address,
          execute: false,
          expirationTime,
          network: IS_TESTNET ? 'rinkeby' : 'mainnet',
          openseaAsset: assetFromJSON(asset),
          paymentTokenAddress: coinfig.type.erc20Address,
          quantity: 1,
          signer,
          startAmount: action.payload.amount || '0'
        })
        fees = yield call(calculateSeaportGasFees, {
          actions,
          operation: GasCalculationOperations.CreateOffer,
          signer
        })
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
      } else {
        throw new Error('Invalid gas operation')
      }

      yield put(A.fetchFeesSuccess(fees as GasDataI))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFeesFailure(error))
    }
  }

  const fetchFeesWrapEth = function* () {
    try {
      yield put(A.fetchFeesWrapEthLoading())
      const signer: Signer = yield call(getEthSigner)
      const fees = yield call(calculateGasFees, GasCalculationOperations.WrapEth, signer)
      yield put(A.fetchFeesWrapEthSuccess(fees as GasDataI))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFeesWrapEthFailure(error))
    }
  }

  const acceptOffer = function* (action: ReturnType<typeof A.acceptOffer>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    // TODO: SEAPORT
    const coin = 'WETH'
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.seaportOrder?.current_price?.toString() || ''
      })
    )

    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      const signer: ethers.Wallet = yield call(getEthSigner)
      const { gasData, seaportOrder } = action.payload
      yield call(fulfillSeaportOrder, {
        accountAddress: signer.address,
        gasData,
        order: seaportOrder,
        signer
      })
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully accepted offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to accept this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOffer = function* (action: ReturnType<typeof A.createOffer>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    const coin = action?.payload?.coin || ''
    const { amount: formAmount, amtToWrap, asset, offerFees, wrapFees } = action.payload
    const amount = Number(formAmount)
    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      const guid = yield call(getGuid)
      const signer: ethers.Wallet = yield call(getEthSigner)
      if (!action.payload.coin) throw new Error('No coin selected for offer.')
      const { coinfig } = window.coins[action.payload.coin]
      if (!coinfig.type.erc20Address) throw new Error('Offers must use an ERC-20 token.')
      const { expirationTime } = action.payload
      const network = IS_TESTNET ? 'rinkeby' : 'mainnet'

      if (amtToWrap && wrapFees && coin === 'WETH') {
        yield put(A.setNftOrderStatus(NftOrderStatusEnum.WRAP_ETH))
        const amount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: 'WETH',
          value: amtToWrap
        })
        yield call(executeWrapEth, signer, amount, wrapFees)
        yield put(actions.core.data.eth.fetchData())
        yield put(actions.core.data.eth.fetchErc20Data())
      }

      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))

      if (offerFees.approvalFees) {
        yield put(A.setNftOrderStatus(NftOrderStatusEnum.APPROVE_ERC20))
        yield call(fungibleTokenApprovals, {
          gasData: offerFees,
          minimumAmount: new BigNumber(amount),
          signer
        })
      }

      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER))
      const seaportOrder: OrderWithCounter = yield call(createBuyOrder, {
        accountAddress: signer.address,
        execute: true,
        expirationTime,
        gasData: offerFees,
        network,
        openseaAsset: assetFromJSON(asset),
        paymentTokenAddress: coinfig.type.erc20Address,
        quantity: 1,
        signer,
        startAmount: amount || '0'
      })
      yield call(api.postNftOrderV2, { guid, network, order: seaportOrder, side: 'bid' })
      yield call(notifyNftPurchase, amount, amount_usd, signer.address, asset)
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER_SUCCESS))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
      yield put(actions.form.reset('nftMakeOffer'))
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER }))
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOrder = function* (action: ReturnType<typeof A.createOrder>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    // TODO: get coin from paymentToken
    const coin = 'ETH'
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action.payload.seaportOrder.current_price
      })
    )
    const amount_usd = yield call(getAmountUsd, coin, amount)

    try {
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_BUY_ORDER))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      const { gasData, seaportOrder } = action.payload
      const signer: ethers.Wallet = yield call(getEthSigner)
      yield call(fulfillSeaportOrder, {
        accountAddress: signer.address,
        gasData,
        order: seaportOrder,
        signer
      })
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_BUY_ORDER_SUCCESS))

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_BUY_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_BUY_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this order.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.BUY }))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createListing = function* (action: ReturnType<typeof A.createListing>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    const { asset, endPrice, expirationMinutes, gasData, startPrice, waitForHighestBid } =
      action.payload
    const coin = action.payload.waitForHighestBid ? 'WETH' : 'ETH'
    const start_usd = yield getAmountUsd(coin, startPrice)
    const end_usd = yield getAmountUsd(coin, endPrice || 0)
    const { coinfig } = window.coins[coin]

    try {
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_LISTING))
      const guid = yield select(selectors.core.wallet.getGuid)
      const network = IS_TESTNET ? 'rinkeby' : 'mainnet'
      let listingTime = getUnixTime(addSeconds(new Date(), 10))
      let expirationTime = getUnixTime(addMinutes(new Date(), expirationMinutes))

      if (waitForHighestBid) {
        listingTime = expirationTime
        expirationTime = getUnixTime(addMinutes(new Date(), expirationMinutes + 10080))
      }

      const signer: ethers.Wallet = yield call(getEthSigner)
      const seaportOrder = yield call(createSeaportSellOrder, {
        accountAddress: signer.address,
        endAmount: endPrice || undefined,
        execute: true,
        expirationTime,
        gasData,
        listingTime: listingTime.toString(),
        network,
        openseaAsset: assetFromJSON(asset),
        paymentTokenAddress: waitForHighestBid ? coinfig.type.erc20Address : NULL_ADDRESS,
        quantity: 1,
        signer,
        startAmount: action.payload.startPrice
      })
      yield call(api.postNftOrderV2, { guid, network, order: seaportOrder, side: 'ask' })
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_LISTING_SUCCESS))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: endPrice ? Number(endPrice) : undefined,
            end_usd: endPrice ? end_usd : undefined,
            start_price: Number(startPrice),
            start_usd,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: endPrice ? Number(endPrice) : undefined,
            end_usd: endPrice ? end_usd : undefined,
            error_message: error,
            start_price: Number(startPrice),
            start_usd,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to sell this asset.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.MARK_FOR_SALE }))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createTransfer = function* (action: ReturnType<typeof A.createTransfer>) {
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer: ethers.Wallet = yield call(getEthSigner)
      yield call(fulfillTransfer, action.payload.asset, signer, action.payload.to, {
        gasLimit: action.payload.gasData.gasFees.toString(),
        gasPrice: action.payload.gasData.gasPrice.toString()
      })
      yield put(actions.modals.closeAllModals())
      // For NFT View: once transferred go back to owned assets page
      yield put(actions.router.push('/nfts/view'))
      yield put(actions.alerts.displaySuccess('Transfer successful!'))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_TRANSFER_SUCCESS_FAIL,
          properties: {
            collection_name: action.payload.asset.collection.name,
            contract_address: action.payload.asset.asset_contract.address,
            from: signer.address,
            to: action.payload.to,
            token_id: action.payload.asset.token_id,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_SEND_SUCCESS_FAIL,
          properties: {
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to transfer this asset.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const cancelListing = function* (action: ReturnType<typeof A.cancelListing>) {
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer: ethers.Wallet = yield call(getEthSigner)
      if (!action.payload.seaportOrder) throw new Error('No Seaport order found to cancel.')
      yield call(cancelSeaportOrder, {
        accountAddress: signer.address,
        gasData: action.payload.gasData,
        order: action.payload.seaportOrder,
        signer
      })
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled listing!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this listing.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  // https://etherscan.io/tx/0x4ba256c46b0aff8b9ee4cc2a7d44649bc31f88ebafd99190bc182178c418c64a
  const cancelOffer = function* (action: ReturnType<typeof A.cancelOffer>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    // TODO: SEAPORT
    const coin = 'WETH'
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.seaportOrder?.current_price?.toString() || ''
      })
    )
    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      if (!action.payload.seaportOrder) {
        throw new Error('No offer found. It may have expired already!')
      }
      const signer: ethers.Wallet = yield call(getEthSigner)
      yield call(cancelSeaportOrder, {
        accountAddress: signer.address,
        gasData: action.payload.gasData,
        order: action.payload.seaportOrder,
        signer
      })
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this offer.'
      yield put(actions.alerts.displayError(error))
      yield put(actions.logs.logErrorMessage(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const formChanged = function* (action) {
    if (action.meta.form === 'nftFilter') {
      if (window.location.hash.split('?')[0].includes('collection')) {
        window.scrollTo(0, 300)
      } else {
        window.scrollTo(0, 0)
      }
      if (['min', 'max'].includes(action.meta.field)) {
        const formValues = selectors.form.getFormValues('nftFilter')(
          yield select()
        ) as NftFilterFormValuesType
        if (formValues?.min || formValues?.max) {
          yield put(actions.form.change('nftFilter', 'forSale', true))
        }
      }
      if (action.meta.field === 'sortBy') {
        if (action.payload?.includes(AssetSortFields.Price)) {
          yield put(actions.form.change('nftFilter', 'forSale', true))
        }
      }

      // GET CURRENT URL
      const url = new URL(window.location.href)
      const [hash, query] = url.href.split('#')[1].split('?')
      // @ts-ignore
      const params = Object.fromEntries(new URLSearchParams(query))
      // NON-TRAITS
      if (nonTraitFilters.includes(action.meta.field)) {
        params[action.meta.field] = action.payload
      }
      // TRAITS
      if (!nonTraitFilters.includes(action.meta.field)) {
        const traits = params.traits ? JSON.parse(params.traits) : []
        if (action.payload) {
          if (traits.includes(action.meta.field)) return
          params.traits = JSON.stringify([...traits, action.meta.field])
        } else {
          params.traits = JSON.stringify(traits.filter((t) => t !== action.meta.field))
        }
      }

      // MODIFY URL
      const newHash = `${hash}?${Object.entries(params)
        .filter(([_, v]) => v)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`

      url.hash = newHash

      window.history.pushState(null, '', url.toString())
    }
  }

  const nftOrderFlowOpen = function* () {
    yield put(actions.modals.showModal(ModalName.NFT_ORDER, { origin: 'Unknown' }))
  }

  // watch router change so we know if we need to reset nft trait filter form
  const handleRouterChange = function* (action) {
    if (action.payload.location.pathname.includes('/nfts/')) {
      const url = new URL(window.location.href)
      const [hash, query] = url.href.split('#')[1].split('?')
      // @ts-ignore
      const params = Object.fromEntries(new URLSearchParams(query))

      yield put(actions.form.reset('nftFilter'))
      window.scrollTo({ behavior: 'smooth', top: 0 })

      yield all(
        Object.keys(params).map(function* (key) {
          if (nonTraitFilters.includes(key)) {
            yield put(actions.form.change('nftFilter', key, params[key]))
          }
        })
      )
      if (params.traits !== undefined) {
        const traits = JSON.parse(params.traits)
        yield all(
          traits.map(function* (trait) {
            yield put(actions.form.change('nftFilter', trait, true))
          })
        )
      }
    }
  }

  const nftSearch = function* (action: ReturnType<typeof A.nftSearch>) {
    try {
      yield put(A.nftSearchLoading())
      const search: ReturnType<typeof api.searchNfts> = yield call(
        api.searchNfts,
        action.payload.search
      )
      yield put(A.nftSearchSuccess(search))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.nftSearchFailure(error))
    }
  }

  // TODO: SEAPORT - remove wyvern 👇
  const fetchFees_LEGACY = function* (action: ReturnType<typeof A.fetchFees_LEGACY>) {
    try {
      yield put(A.fetchFees_LEGACY_Loading())
      const signer: ethers.Wallet = yield call(getEthSigner)
      let fees

      try {
        yield put(A.fetchLatestPendingTxsLoading())
        const { transactions: tx } = yield call(api.getEthTransactionsV2, signer.address, 0, 1)
        const isLatestTxPending =
          tx[0] && tx[0].state === 'PENDING' && tx[0].from === signer.address
        yield put(A.fetchLatestPendingTxsSuccess(isLatestTxPending))
      } catch (e) {
        yield put(A.fetchLatestPendingTxsFailure('Error fetching pending txs'))
      }

      if (action.payload.operation === GasCalculationOperations.Buy) {
        try {
          const { order } = action.payload
          yield put(A.fetchMatchingOrder_LEGACY_Loading())
          const { buy, sell }: Await<ReturnType<typeof getNftMatchingOrders>> = yield call(
            getNftMatchingOrders,
            orderFromJSON(order),
            signer,
            undefined,
            IS_TESTNET ? 'rinkeby' : 'mainnet',
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
          yield put(A.fetchMatchingOrder_LEGACY_Success({ buy, sell }))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchMatchingOrder_LEGACY_Failure(error))
          throw e
        }
      } else if (action.payload.operation === GasCalculationOperations.CreateOffer) {
        const buy: Await<ReturnType<typeof getNftBuyOrder>> = yield call(
          getNftBuyOrder,
          action.payload.asset,
          signer,
          undefined,
          Number(action.payload.offer),
          action.payload.paymentTokenAddress,
          IS_TESTNET ? 'rinkeby' : 'mainnet'
        )

        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.CreateOffer,
          signer,
          undefined,
          buy
        )
      } else if (action.payload.operation === GasCalculationOperations.AcceptOffer) {
        const { order } = action.payload
        yield put(A.fetchMatchingOrder_LEGACY_Loading())
        try {
          const { buy, sell }: Await<ReturnType<typeof getNftMatchingOrders>> = yield call(
            getNftMatchingOrders,
            orderFromJSON(order),
            signer,
            undefined,
            IS_TESTNET ? 'rinkeby' : 'mainnet'
          )
          fees = yield call(
            calculateGasFees,
            GasCalculationOperations.AcceptOffer,
            signer,
            undefined,
            buy,
            sell
          )
          yield put(A.fetchMatchingOrder_LEGACY_Success({ buy, sell }))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchMatchingOrder_LEGACY_Failure(error))
          throw e
        }
      } else if (action.payload.operation === GasCalculationOperations.Cancel) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Cancel,
          signer,
          action.payload.order
        )
      } else if (action.payload.operation === GasCalculationOperations.Sell) {
        let listingTime = getUnixTime(addSeconds(new Date(), 10))
        let expirationTime = getUnixTime(addMinutes(new Date(), action.payload.expirationMinutes))

        // For english auctions, order executes at listing time
        // highest bidder wins the auction
        if (action.payload.waitForHighestBid) {
          listingTime = expirationTime
          expirationTime = getUnixTime(
            addMinutes(new Date(), action.payload.expirationMinutes + 10080)
          )
        }

        const order: Await<ReturnType<typeof getNftSellOrder>> = yield call(
          getNftSellOrder,
          action.payload.asset,
          signer,
          listingTime,
          expirationTime,
          action.payload.startPrice,
          action.payload.endPrice,
          action.payload.reservePrice,
          IS_TESTNET ? 'rinkeby' : 'mainnet',
          action.payload.waitForHighestBid,
          action.payload.paymentTokenAddress
        )
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Sell,
          signer,
          undefined,
          undefined,
          order
        )
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
      } else {
        throw new Error('Invalid gas operation')
      }

      yield put(A.fetchFees_LEGACY_Success(fees as GasDataI))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFees_LEGACY_Failure(error))
    }
  }

  const acceptOffer_LEGACY = function* (action: ReturnType<typeof A.acceptOffer_LEGACY>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    // TODO: get coin from paymentToken
    const coin = action.payload.sell.paymentToken === NULL_ADDRESS ? 'ETH' : 'WETH'
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.buy?.basePrice?.toString() || ''
      })
    )

    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      const signer: ethers.Wallet = yield call(getEthSigner)
      const { buy, gasData, sell } = action.payload
      yield call(fulfillNftOrder, { buy, gasData, sell, signer })
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully accepted offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to accept this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOffer_LEGACY = function* (action: ReturnType<typeof A.createOffer>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    const coin = action?.payload?.coin || ''
    const amount = Number(action?.payload?.amount)
    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      const guid = yield call(getGuid)
      const signer: ethers.Wallet = yield call(getEthSigner)
      if (!action.payload.coin) throw new Error('No coin selected for offer.')
      const { coinfig } = window.coins[action.payload.coin]
      if (!coinfig.type.erc20Address) throw new Error('Offers must use an ERC-20 token.')
      const { expirationTime } = action.payload

      if (action.payload.amtToWrap && action.payload.wrapFees && coin === 'WETH') {
        yield put(A.setNftOrderStatus(NftOrderStatusEnum.WRAP_ETH))
        const amount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: 'WETH',
          value: action.payload.amtToWrap
        })
        yield call(executeWrapEth, signer, amount, action.payload.wrapFees)
        yield put(actions.core.data.eth.fetchData())
        yield put(actions.core.data.eth.fetchErc20Data())
      }

      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      const buy: Await<ReturnType<typeof getNftBuyOrder>> = yield call(
        getNftBuyOrder,
        action.payload.asset,
        signer,
        expirationTime,
        Number(action.payload.amount || '0'),
        coinfig.type.erc20Address,
        IS_TESTNET ? 'rinkeby' : 'mainnet'
      )
      const gasData = action.payload.offerFees
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER))
      const retailToken = yield call(generateRetailToken)
      const order = yield call(fulfillNftOrder, { buy, gasData, signer })
      yield call(api.postNftOrderV1, order, action.payload.asset.collection.slug, guid, retailToken)
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER_SUCCESS))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
      yield put(actions.form.reset('nftMakeOffer'))
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER }))
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const cancelOffer_LEGACY = function* (action: ReturnType<typeof A.cancelOffer_LEGACY>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    const coin = action?.payload?.order?.payment_token_contract?.symbol || ''
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.order?.current_price?.toString() || ''
      })
    )
    const amount_usd = yield call(getAmountUsd, coin, amount)
    try {
      if (!action.payload.order) {
        throw new Error('No offer found. It may have expired already!')
      }
      const signer: ethers.Wallet = yield call(getEthSigner)
      yield call(cancelNftOrder, action.payload.order, signer, action.payload.gasData)
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this offer.'
      yield put(actions.alerts.displayError(error))
      yield put(actions.logs.logErrorMessage(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const cancelListing_LEGACY = function* (action: ReturnType<typeof A.cancelListing_LEGACY>) {
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer = yield call(getEthSigner)
      yield call(cancelNftOrder, action.payload.order, signer, action.payload.gasData)
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled listing!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this listing.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createListing_LEGACY = function* (action: ReturnType<typeof A.createListing_LEGACY>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    const isTimedAuction = !!action.payload.endPrice
    const coin = isTimedAuction ? 'WETH' : 'ETH'
    const startPrice = action?.payload?.startPrice
    const endPrice = action?.payload?.endPrice || 0
    const start_usd = yield getAmountUsd(coin, startPrice)
    const end_usd = yield getAmountUsd(coin, endPrice)

    try {
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_LISTING))
      const guid = yield select(selectors.core.wallet.getGuid)
      let listingTime = getUnixTime(addSeconds(new Date(), 10))
      let expirationTime = getUnixTime(addMinutes(new Date(), action.payload.expirationMinutes))

      if (action.payload.waitForHighestBid) {
        listingTime = expirationTime
        expirationTime = getUnixTime(
          addMinutes(new Date(), action.payload.expirationMinutes + 10080)
        )
      }

      const signer = yield call(getEthSigner)
      const signedOrder: Await<ReturnType<typeof getNftSellOrder>> = yield call(
        getNftSellOrder,
        action.payload.asset,
        signer,
        listingTime,
        expirationTime,
        action.payload.startPrice,
        action.payload.endPrice,
        action.payload.reservePrice,
        IS_TESTNET ? 'rinkeby' : 'mainnet',
        action.payload.waitForHighestBid,
        action.payload.paymentTokenAddress
      )
      const order = yield call(fulfillNftSellOrder, signedOrder, signer, action.payload.gasData)
      const retailToken = yield call(generateRetailToken)
      yield call(api.postNftOrderV1, order, action.payload.asset.collection.slug, guid, retailToken)
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_LISTING_SUCCESS))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: isTimedAuction ? Number(endPrice) : undefined,
            end_usd: isTimedAuction ? end_usd : undefined,
            start_price: Number(startPrice),
            start_usd,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: isTimedAuction ? Number(endPrice) : undefined,
            end_usd: isTimedAuction ? end_usd : undefined,
            error_message: error,
            start_price: Number(startPrice),
            start_usd,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to sell this asset.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.MARK_FOR_SALE }))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOrder_LEGACY = function* (action: ReturnType<typeof A.createOrder_LEGACY>) {
    yield put(A.setOrderFlowIsSubmitting(true))
    // TODO: get coin from paymentToken
    const coin = action.payload.sell.paymentToken === NULL_ADDRESS ? 'ETH' : ('WETH' as string)
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value:
          action?.payload?.buy?.basePrice?.toString() ||
          action?.payload?.sell?.basePrice?.toString()
      })
    )
    const amount_usd = yield call(getAmountUsd, coin, amount)

    try {
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_BUY_ORDER))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      const { asset, buy, gasData, sell } = action.payload
      const signer = yield call(getEthSigner)
      yield call(fulfillNftOrder, { buy, gasData, sell, signer })
      yield call(notifyNftPurchase, amount, amount_usd, signer.address, asset)
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_BUY_ORDER_SUCCESS))

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_BUY_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          defaultEthAddr: signer.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_BUY_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this order.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.BUY }))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }
  // TODO: SEAPORT - remove wyvern 👆

  return {
    acceptOffer,
    acceptOffer_LEGACY,
    cancelListing,
    cancelListing_LEGACY,
    cancelOffer,
    cancelOffer_LEGACY,
    createListing,
    createListing_LEGACY,
    createOffer,
    createOffer_LEGACY,
    createOrder,
    createOrder_LEGACY,
    createTransfer,
    fetchFees,
    fetchFeesWrapEth,
    fetchFees_LEGACY,
    fetchNftOwnerAssets,
    fetchNftUserPreferences,
    fetchOpenSeaAsset,
    fetchOpenseaStatus,
    formChanged,
    handleRouterChange,
    nftOrderFlowOpen,
    nftSearch,
    updateUserPreferences
  }
}
