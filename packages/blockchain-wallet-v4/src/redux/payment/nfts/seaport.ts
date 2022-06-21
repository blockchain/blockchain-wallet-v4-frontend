import { Seaport } from '@opensea/seaport-js'
import { ConsiderationInputItem } from '@opensea/seaport-js/lib/types'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

import { NftOrderSide, OpenSeaAsset } from '@core/network/api/nfts/types'
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
  getAssetItems,
  getFees,
  getMaxOrderExpirationTimestamp,
  getPrivateListingConsiderations
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
  return new Seaport(signer, {
    conduitKeyToConduit: CONDUIT_KEYS_TO_CONDUIT,
    overrides: {
      defaultConduitKey: CROSS_CHAIN_DEFAULT_CONDUIT_KEY
    }
  })
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
 * @param options.buyerAddress Optional address that's allowed to purchase this item. If specified, no other address will be able to take the order, unless its value is the null address.
 */
export const createSellOrder = async ({
  openseaAsset,
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
  expirationTime?: BigNumberInput
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
    endAmount: endPrice.toNumber(),
    network,
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
  const { executeAllActions } = await seaport.createOrder(
    {
      consideration: considerationFeeItems,
      endTime: expirationTime?.toString() ?? getMaxOrderExpirationTimestamp().toString(),
      offer: offerAssetItems,
      startTime: listingTime,
      zone: network === 'rinkeby' ? DEFAULT_ZONE_RINKEBY : DEFAULT_ZONE
    },
    accountAddress
  )
  const order = await executeAllActions()
  await seaport.validate([order], accountAddress)

  console.log(order)
}

/**
 * Create a buy order to make an offer on an asset.
 * @param options Options for creating the buy order
 * @param options.asset The asset to trade
 * @param options.accountAddress Address of the maker's wallet
 * @param options.startAmount Value of the offer, in units of the payment token (or wrapped ETH if no payment token address specified)
 * @param options.quantity The number of assets to bid for (if fungible or semi-fungible). Defaults to 1. In units, not base units, e.g. not wei
 * @param options.expirationTime Expiration time for the order, in seconds
 * @param options.paymentTokenAddress Optional address for using an ERC-20 token in the order. If unspecified, defaults to WETH
 */
export const createBuyOrder = async ({
  accountAddress,
  expirationTime,
  network,
  openseaAsset,
  paymentTokenAddress,
  quantity = 1,
  signer,
  startAmount
}: {
  accountAddress: string
  expirationTime?: BigNumberInput
  network: string
  openseaAsset: OpenSeaAsset
  paymentTokenAddress?: string
  quantity?: BigNumberInput
  signer: ethers.Wallet
  startAmount: BigNumberInput
}) => {
  try {
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
      network,
      openseaAsset,
      paymentTokenAddress,
      startAmount: basePrice.toString()
    })
    const considerationFeeItems = [openseaSellerFee, collectionSellerFee].filter(
      (item): item is ConsiderationInputItem => item !== undefined
    )

    const seaport = getSeaport(signer)
    const { executeAllActions } = await seaport.createOrder(
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
    const order = await executeAllActions()
    await seaport.validate([order], accountAddress)

    return order
  } catch (e) {
    console.log(e)
  }

  // return this.api.postOrder(order, { protocol: 'seaport', side: 'bid' })
}
