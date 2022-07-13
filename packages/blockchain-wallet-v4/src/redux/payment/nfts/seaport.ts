import { Seaport } from '@opensea/seaport-js'
import { CROSS_CHAIN_SEAPORT_ADDRESS } from '@opensea/seaport-js/lib/constants'
import { ConsiderationInputItem, CreateOrderActions } from '@opensea/seaport-js/lib/types'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

import {
  GasCalculationOperations,
  GasDataI,
  NftOrderSide,
  OpenSeaAsset,
  SeaportRawOrder
} from '@core/network/api/nfts/types'
import { makeBigNumber } from 'data/components/nfts/utils'

import {
  CONDUIT_KEYS_TO_CONDUIT,
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
  DEFAULT_ZONE,
  DEFAULT_ZONE_RINKEBY,
  NULL_ADDRESS,
  WETH_CONTRACT_MAINNET,
  WETH_CONTRACT_RINKEBY
} from './constants'
import {
  calculateConduitApprovalsFees,
  cancelSeaportOrders,
  constructPrivateListingCounterOrder,
  getAssetItems,
  getFees,
  getMaxOrderExpirationTimestamp,
  getPrivateListingConsiderations,
  getPrivateListingFulfillments
} from './seaport.utils'
import { _getPriceParameters } from './wyvern.utils'

export type BigNumberInput = number | string | BigNumber

const getSeaport = (signer: ethers.Wallet) => {
  // Make seaport think we are a JsonRpcProvider
  // @ts-ignore
  signer.getSigner = () => signer
  // @ts-ignore
  signer.getNetwork = () => signer.provider.getNetwork()
  // @ts-ignore
  signer.getBlock = () => signer.provider.getBlock()
  // @ts-ignore
  return new Seaport(signer, {
    conduitKeyToConduit: CONDUIT_KEYS_TO_CONDUIT,
    overrides: {
      defaultConduitKey: CROSS_CHAIN_DEFAULT_CONDUIT_KEY
    }
  })
}

/**
 * Cancel an order on-chain, preventing it from ever being fulfilled.
 * @param param0 __namedParameters Object
 * @param order The order to cancel
 * @param accountAddress The order maker's wallet address
 * @param options.signer ethers.Wallet
 */
export const cancelOrder = async ({
  accountAddress,
  gasData,
  order,
  signer
}: {
  accountAddress: string
  gasData: GasDataI
  order: SeaportRawOrder
  signer: ethers.Wallet
}) => {
  // Transact and get the transaction hash
  let transactionHash: string

  const seaport = getSeaport(signer)
  switch (order.protocol_address) {
    case CROSS_CHAIN_SEAPORT_ADDRESS: {
      transactionHash = await cancelSeaportOrders({
        accountAddress,
        gasData,
        orders: [order.protocol_data.parameters],
        seaport
      })
      break
    }
    default:
      throw new Error('Unsupported protocol')
  }

  // Await transaction confirmation
  await signer.provider.waitForTransaction(transactionHash, 1)
  return transactionHash
}

/**
 * Create a sell order to auction an asset.
 * @param options Options for creating the sell order
 * @param options.asset The asset to trade
 * @param options.accountAddress Address of the maker's wallet
 * @param options.startAmount Price of the asset at the start of the auction. Units are in the amount of a token above the token's decimal places (integer part). For example, for ether, expected units are in ETH, not wei.
 * @param options.endAmount Optional price of the asset at the end of its expiration time. Units are in the amount of a token above the token's decimal places (integer part). For example, for ether, expected units are in ETH, not wei.
 * @param options.quantity The number of assets to sell (if fungible or semi-fungible). Defaults to 1. In units, not base units, e.g. not wei.
 * @param options.listingTime Optional time when the order will become fulfillable, in UTC seconds. Undefined means it will start now.
 * @param options.expirationTime Expiration time for the order, in UTC seconds.
 * @param options.paymentTokenAddress Address of the ERC-20 token to accept in return. If undefined or null, uses Ether.
 * @param options.signer ethers.Wallet
 * @param options.buyerAddress Optional address that's allowed to purchase this item. If specified, no other address will be able to take the order, unless its value is the null address.
 */
export const createListing = async ({
  openseaAsset,
  execute,
  gasData,
  accountAddress,
  startAmount,
  endAmount,
  quantity = 1,
  listingTime,
  expirationTime,
  paymentTokenAddress = NULL_ADDRESS,
  network,
  buyerAddress,
  signer
}: {
  accountAddress: string
  buyerAddress?: string
  endAmount?: BigNumberInput
  execute: boolean
  expirationTime?: BigNumberInput
  gasData?: GasDataI
  listingTime?: string
  network: string
  openseaAsset: OpenSeaAsset
  paymentTokenAddress?: string
  quantity?: BigNumberInput
  signer: ethers.Wallet
  startAmount: BigNumberInput
}) => {
  if (!openseaAsset.tokenId) {
    throw new Error('Asset must have a tokenId')
  }

  const offerAssetItems = getAssetItems([openseaAsset], [makeBigNumber(quantity)])

  const { basePrice, endPrice } = await _getPriceParameters(
    NftOrderSide.Sell,
    paymentTokenAddress,
    makeBigNumber(expirationTime ?? getMaxOrderExpirationTimestamp()).toNumber(),
    makeBigNumber(startAmount).toNumber(),
    endAmount !== undefined ? makeBigNumber(endAmount).toNumber() : undefined
  )

  const { collectionSellerFee, openseaSellerFee, sellerFee } = await getFees({
    endAmount: endPrice.toString(),
    openseaAsset,
    paymentTokenAddress,
    startAmount: basePrice.toString()
  })
  const considerationFeeItems = [sellerFee, openseaSellerFee, collectionSellerFee].filter(
    (item): item is ConsiderationInputItem => item !== undefined
  )

  if (buyerAddress) {
    considerationFeeItems.push(...getPrivateListingConsiderations(offerAssetItems, buyerAddress))
  }

  const seaport = getSeaport(signer)
  const { actions, executeAllActions } = await seaport.createOrder(
    {
      allowPartialFills: false,
      consideration: considerationFeeItems,
      endTime: expirationTime?.toString() ?? getMaxOrderExpirationTimestamp().toString(),
      offer: offerAssetItems,
      restrictedByZone: true,
      startTime: listingTime,
      zone: network === 'rinkeby' ? DEFAULT_ZONE_RINKEBY : DEFAULT_ZONE
    },
    accountAddress
  )

  if (execute) {
    const order = await executeAllActions()
    const validation = await seaport.validate([order], accountAddress)

    if (gasData && gasData.gasFees) {
      await (
        await validation.transact({ gasLimit: gasData.gasFees, gasPrice: gasData.gasPrice })
      ).wait()
    }

    return order
  }

  return actions
}

/**
 * Create a buy order to make an offer on an asset.
 * @param options Options for creating the buy order
 * @param options.asset The asset to trade
 * @param options.accountAddress Address of the maker's wallet
 * @param options.startAmount Value of the offer, in units of the payment token (or wrapped ETH if no payment token address specified)
 * @param options.quantity The number of assets to bid for (if fungible or semi-fungible). Defaults to 1. In units, not base units, e.g. not wei
 * @param options.expirationTime Expiration time for the order, in seconds
 * @param options.execute Should buy order be executed and sent to OpenSea, if false returns fee information
 * @param options.signer ethers.Wallet
 * @param options.paymentTokenAddress Optional address for using an ERC-20 token in the order. If unspecified, defaults to WETH
 */
export const createBuyOrder = async ({
  accountAddress,
  execute,
  expirationTime,
  gasData,
  network,
  openseaAsset,
  paymentTokenAddress,
  quantity = 1,
  signer,
  startAmount
}: {
  accountAddress: string
  execute: boolean
  expirationTime?: BigNumberInput
  gasData?: GasDataI
  network: string
  openseaAsset: OpenSeaAsset
  paymentTokenAddress?: string
  quantity?: BigNumberInput
  signer: ethers.Wallet
  startAmount: BigNumberInput
}) => {
  if (!openseaAsset.tokenId) {
    throw new Error('Asset must have a tokenId')
  }

  if (!paymentTokenAddress) {
    paymentTokenAddress = network === 'rinkeby' ? WETH_CONTRACT_RINKEBY : WETH_CONTRACT_MAINNET
  }

  const considerationAssetItems = getAssetItems([openseaAsset], [makeBigNumber(quantity)])

  const { basePrice } = await _getPriceParameters(
    NftOrderSide.Buy,
    paymentTokenAddress,
    makeBigNumber(expirationTime ?? getMaxOrderExpirationTimestamp()).toNumber(),
    makeBigNumber(startAmount).toNumber()
  )

  const { collectionSellerFee, openseaSellerFee } = await getFees({
    openseaAsset,
    paymentTokenAddress,
    startAmount: basePrice.toString()
  })
  const considerationFeeItems = [openseaSellerFee, collectionSellerFee].filter(
    (item): item is ConsiderationInputItem => item !== undefined
  )

  const seaport = getSeaport(signer)
  const { actions, executeAllActions } = await seaport.createOrder(
    {
      allowPartialFills: false,
      consideration: [...considerationAssetItems, ...considerationFeeItems],
      endTime: expirationTime?.toString() ?? getMaxOrderExpirationTimestamp().toString(),
      offer: [
        {
          amount: basePrice.toString(),
          token: paymentTokenAddress
        }
      ],
      restrictedByZone: true,
      zone: network === 'rinkeby' ? DEFAULT_ZONE_RINKEBY : DEFAULT_ZONE
    },
    accountAddress
  )

  if (execute) {
    const order = await executeAllActions()
    const validation = await seaport.validate([order], accountAddress)

    if (gasData && gasData.gasFees) {
      await (
        await validation.transact({ gasLimit: gasData.gasFees, gasPrice: gasData.gasPrice })
      ).wait()
    }

    return order
  }

  return actions
}

export const fulfillPrivateOrder = async ({
  accountAddress,
  gasData,
  order,
  signer
}: {
  accountAddress: string
  gasData: GasDataI
  order: SeaportRawOrder
  signer: ethers.Wallet
}): Promise<string> => {
  let transactionHash: string
  switch (order.protocol_address) {
    case CROSS_CHAIN_SEAPORT_ADDRESS: {
      if (!order.taker?.address) {
        throw new Error('Order is not a private listing must have a taker address')
      }
      const counterOrder = constructPrivateListingCounterOrder(
        order.protocol_data,
        order.taker.address
      )
      const fulfillments = getPrivateListingFulfillments(order.protocol_data)
      const seaport = getSeaport(signer)
      const transaction = await seaport
        .matchOrders({
          accountAddress,
          fulfillments,
          orders: [order.protocol_data, counterOrder],
          overrides: {
            value: counterOrder.parameters.offer[0].startAmount
          }
        })
        .transact({ gasLimit: gasData.gasFees, gasPrice: gasData.gasPrice })
      const transactionReceipt = await transaction.wait()
      transactionHash = transactionReceipt.transactionHash
      break
    }
    default:
      throw new Error('Unsupported protocol')
  }

  return transactionHash
}

/**
 * Fullfill or "take" an order for an asset, either a buy or sell order
 * @param options fullfillment options
 * @param options.order The order to fulfill, a.k.a. "take"
 * @param options.accountAddress The taker's wallet address
 * @param options.recipientAddress The optional address to receive the order's item(s) or curriencies. If not specified, defaults to accountAddress
 * @param options.signer ethers.Wallet
 * @returns Transaction hash for fulfilling the order
 */
export const fulfillOrder = async ({
  accountAddress,
  gasData,
  order,
  recipientAddress,
  signer
}: {
  accountAddress: string
  gasData: GasDataI
  order: SeaportRawOrder
  recipientAddress?: string
  signer: ethers.Wallet
}): Promise<string> => {
  const isPrivateListing = !!order.taker
  if (isPrivateListing) {
    if (recipientAddress) {
      throw new Error('Private listings cannot be fulfilled with a recipient address')
    }
    return fulfillPrivateOrder({
      accountAddress,
      gasData,
      order,
      signer
    })
  }

  let transactionHash: string
  switch (order.protocol_address) {
    case CROSS_CHAIN_SEAPORT_ADDRESS: {
      const seaport = getSeaport(signer)
      const { executeAllActions } = await seaport.fulfillOrder({
        accountAddress,
        order: order.protocol_data,
        recipientAddress
      })
      const transaction = await executeAllActions()
      transactionHash = transaction.hash
      break
    }
    default:
      throw new Error('Unsupported protocol')
  }

  return transactionHash
}

// CODE COPIED FROM opensea-js sdk
// with some modifications:
// - gasData: GasData
// - signer: ethers.Wallet
// - execute?: boolean
// 👆

// Blockchain Wallet Specific Code 👇
export const calculateSeaportGasFees = async (
  params:
    | { operation: GasCalculationOperations; signer: ethers.Wallet } & (
        | {
            actions?: undefined
            protocol_data: SeaportRawOrder['protocol_data']
          }
        | {
            actions: CreateOrderActions
            operation: GasCalculationOperations.CreateOffer | GasCalculationOperations.Sell
            protocol_data?: never
          }
      )
): Promise<GasDataI> => {
  const { operation, signer } = params
  let totalFees = 0
  let approvalFees = '0'
  let estimate = '0'
  const seaport = getSeaport(signer)

  switch (operation) {
    case GasCalculationOperations.CancelOrder:
      estimate = await (
        await seaport.cancelOrders([params.protocol_data.parameters]).estimateGas()
      )._hex
      break
    case GasCalculationOperations.CancelOffer:
      estimate = await (
        await seaport.cancelOrders([params.protocol_data.parameters]).estimateGas()
      )._hex
      break
    case GasCalculationOperations.Sell:
      if (params.actions) {
        const [methods] = params.actions
        if (methods.type === 'approval') {
          estimate = await (await methods.transactionMethods.estimateGas())._hex
        }
      }
      break
    case GasCalculationOperations.Buy:
    case GasCalculationOperations.AcceptOffer:
      const { actions } = await seaport.fulfillOrder({
        order: params.protocol_data
      })
      const [methods] = actions
      estimate = (await methods.transactionMethods.estimateGas())._hex
      break
    case GasCalculationOperations.CreateOffer:
      if (params.actions) {
        const [methods] = params.actions
        if (methods.type === 'approval') {
          estimate = await (await methods.transactionMethods.estimateGas())._hex
        }
      }
      approvalFees = await (await calculateConduitApprovalsFees(signer)).toString()
      break
    default:
  }
  totalFees = Math.ceil(parseInt(estimate) * 1.5) + Math.ceil(parseInt(approvalFees) * 1.5)

  const gasPrice = await (await signer.getGasPrice()).toNumber()
  return {
    approvalFees: Math.ceil(parseInt(approvalFees) * 1.5),
    gasFees: Math.ceil(parseInt(estimate) * 1.5),
    gasPrice,
    proxyFees: 0,
    totalFees
  }
}
