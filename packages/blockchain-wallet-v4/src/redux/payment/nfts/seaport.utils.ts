import { ItemType } from '@opensea/seaport-js/lib/constants'
import { ConsiderationInputItem, CreateInputItem } from '@opensea/seaport-js/lib/types'
import { BigNumber } from 'bignumber.js'

import { OpenSeaAsset, WyvernSchemaName } from '@core/network/api/nfts/types'
import { makeBigNumber } from 'data/components/nfts/utils'

import {
  DEFAULT_BUYER_FEE_BASIS_POINTS,
  DEFAULT_SELLER_FEE_BASIS_POINTS,
  INVERSE_BASIS_POINT,
  MAX_EXPIRATION_MONTHS,
  OPENSEA_FEE_RECIPIENT,
  OPENSEA_FEE_RECIPIENT_RINKEBY
} from './constants'

const getAmountWithBasisPointsApplied = (amount: string, basisPoints: string) => {
  return makeBigNumber(amount).multipliedBy(basisPoints).dividedBy(INVERSE_BASIS_POINT).toString()
}

export const getAssetItemType = (schemaName?: WyvernSchemaName) => {
  switch (schemaName) {
    case 'ERC20':
      return ItemType.ERC20
    case 'ERC721':
      return ItemType.ERC721
    case 'ERC1155':
      return ItemType.ERC1155
    default:
      throw new Error(`Unknown schema name: ${schemaName}`)
  }
}

export const _getSchemaName = (asset: OpenSeaAsset) => {
  if (asset.schemaName) {
    return asset.schemaName
  }
  if ('assetContract' in asset) {
    return asset.assetContract.schemaName
  }

  return undefined
}

export const getAssetItems = (
  assets: OpenSeaAsset[],
  quantities: BigNumber[] = [],
  fallbackSchema?: WyvernSchemaName
): CreateInputItem[] => {
  return assets.map((asset, index) => ({
    amount: quantities[index].toString() ?? '1',
    identifier: asset.tokenId ?? undefined,
    itemType: getAssetItemType(_getSchemaName(asset) ?? fallbackSchema),
    token: asset.tokenAddress
  }))
}

export const getFees = async ({
  endAmount,
  network,
  openseaAsset: asset,
  paymentTokenAddress,
  startAmount
}: {
  endAmount?: number
  network: string
  openseaAsset: OpenSeaAsset
  paymentTokenAddress: string
  startAmount: string
}): Promise<{
  collectionBuyerFee?: ConsiderationInputItem
  collectionSellerFee?: ConsiderationInputItem
  openseaBuyerFee?: ConsiderationInputItem
  openseaSellerFee: ConsiderationInputItem
  sellerFee: ConsiderationInputItem
}> => {
  const IS_TESTNET = network === 'rinkeby'
  // Seller fee basis points
  const openseaSellerFeeBasisPoints = DEFAULT_SELLER_FEE_BASIS_POINTS
  const collectionSellerFeeBasisPoints = asset.collection.devSellerFeeBasisPoints

  // Buyer fee basis points
  const openseaBuyerFeeBasisPoints = DEFAULT_BUYER_FEE_BASIS_POINTS
  const collectionBuyerFeeBasisPoints = asset.collection.devBuyerFeeBasisPoints

  // Seller basis points
  const sellerBasisPoints =
    INVERSE_BASIS_POINT - openseaSellerFeeBasisPoints - collectionSellerFeeBasisPoints

  const getConsiderationItem = (basisPoints: number, recipient?: string) => {
    return {
      amount: getAmountWithBasisPointsApplied(startAmount, basisPoints.toString()),
      endAmount: getAmountWithBasisPointsApplied(
        endAmount?.toString() ?? startAmount.toString(),
        basisPoints.toString()
      ),
      recipient,
      token: paymentTokenAddress
    }
  }

  return {
    collectionBuyerFee:
      collectionBuyerFeeBasisPoints > 0 && asset.collection.payoutAddress
        ? getConsiderationItem(collectionBuyerFeeBasisPoints, asset.collection.payoutAddress)
        : undefined,
    collectionSellerFee:
      collectionSellerFeeBasisPoints > 0 && asset.collection.payoutAddress
        ? getConsiderationItem(collectionSellerFeeBasisPoints, asset.collection.payoutAddress)
        : undefined,
    openseaBuyerFee:
      openseaBuyerFeeBasisPoints > 0
        ? getConsiderationItem(
            openseaBuyerFeeBasisPoints,
            IS_TESTNET ? OPENSEA_FEE_RECIPIENT_RINKEBY : OPENSEA_FEE_RECIPIENT
          )
        : undefined,
    openseaSellerFee: getConsiderationItem(
      openseaSellerFeeBasisPoints,
      IS_TESTNET ? OPENSEA_FEE_RECIPIENT_RINKEBY : OPENSEA_FEE_RECIPIENT
    ),
    sellerFee: getConsiderationItem(sellerBasisPoints)
  }
}

/**
 * The longest time that an order is valid for is six months from the current date
 * @returns unix timestamp
 */
export const getMaxOrderExpirationTimestamp = () => {
  const maxExpirationDate = new Date()

  maxExpirationDate.setDate(maxExpirationDate.getDate() + MAX_EXPIRATION_MONTHS)

  return Math.round(maxExpirationDate.getTime() / 1000)
}
