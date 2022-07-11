import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import {
  ConsiderationInputItem,
  CreateInputItem,
  MatchOrdersFulfillment,
  Order,
  OrderComponents,
  OrderWithCounter
} from '@opensea/seaport-js/lib/types'
import { isCurrencyItem } from '@opensea/seaport-js/lib/utils/item'
import { generateRandomSalt } from '@opensea/seaport-js/lib/utils/order'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'

import { GasDataI, OpenSeaAsset, WyvernSchemaName } from '@core/network/api/nfts/types'
import { makeBigNumber } from 'data/components/nfts/utils'

import { ERC20_ABI, WETH_ABI } from './abis'
import {
  CONDUIT_KEYS_TO_CONDUIT,
  CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
  DEFAULT_BUYER_FEE_BASIS_POINTS,
  DEFAULT_SELLER_FEE_BASIS_POINTS,
  INVERSE_BASIS_POINT,
  MAX_EXPIRATION_MONTHS,
  OPENSEA_FEE_RECIPIENT,
  WETH_CONTRACT_MAINNET,
  WETH_CONTRACT_RINKEBY
} from './constants'

const getAmountWithBasisPointsApplied = (amount: string, basisPoints: string) => {
  return makeBigNumber(amount).multipliedBy(basisPoints).dividedBy(INVERSE_BASIS_POINT).toFixed()
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
  openseaAsset: asset,
  paymentTokenAddress,
  startAmount
}: {
  endAmount?: string
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
        ? getConsiderationItem(openseaBuyerFeeBasisPoints, OPENSEA_FEE_RECIPIENT)
        : undefined,
    openseaSellerFee: getConsiderationItem(openseaSellerFeeBasisPoints, OPENSEA_FEE_RECIPIENT),
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

export const getPrivateListingConsiderations = (
  offer: CreateInputItem[],
  privateSaleRecipient: string
): ConsiderationInputItem[] => {
  return offer.map((item) => {
    return { ...item, recipient: privateSaleRecipient }
  })
}

export const constructPrivateListingCounterOrder = (
  order: OrderWithCounter,
  privateSaleRecipient: string
): Order => {
  // Counter order offers up all the items in the private listing consideration
  // besides the items that are going to the private listing recipient
  const paymentItems = order.parameters.consideration.filter(
    (item) => item.recipient.toLowerCase() !== privateSaleRecipient.toLowerCase()
  )

  if (!paymentItems.every((item) => isCurrencyItem(item))) {
    throw new Error('The consideration for the private listing did not contain only currency items')
  }
  if (!paymentItems.every((item) => item.itemType === paymentItems[0].itemType)) {
    throw new Error('Not all currency items were the same for private order')
  }

  const { aggregatedEndAmount, aggregatedStartAmount } = paymentItems.reduce(
    ({ aggregatedEndAmount, aggregatedStartAmount }, item) => ({
      aggregatedEndAmount: aggregatedEndAmount.plus(item.endAmount),
      aggregatedStartAmount: aggregatedStartAmount.plus(item.startAmount)
    }),
    {
      aggregatedEndAmount: new BigNumber(0),
      aggregatedStartAmount: new BigNumber(0)
    }
  )

  const counterOrder: Order = {
    parameters: {
      ...order.parameters,
      // The consideration here is empty as the original private listing order supplies
      // the taker address to receive the desired items.
      consideration: [],

      offer: [
        {
          endAmount: aggregatedEndAmount.toString(),
          identifierOrCriteria: paymentItems[0].identifierOrCriteria,
          itemType: paymentItems[0].itemType,
          startAmount: aggregatedStartAmount.toString(),
          token: paymentItems[0].token
        }
      ],

      offerer: privateSaleRecipient,
      salt: generateRandomSalt(),
      totalOriginalConsiderationItems: 0
    },
    signature: '0x'
  }

  return counterOrder
}

export const getPrivateListingFulfillments = (
  privateListingOrder: OrderWithCounter
): MatchOrdersFulfillment[] => {
  const nftRelatedFulfillments: MatchOrdersFulfillment[] = []

  // For the original order, we need to match everything offered with every consideration item
  // on the original order that's set to go to the private listing recipient
  privateListingOrder.parameters.offer.forEach((offerItem, offerIndex) => {
    const considerationIndex = privateListingOrder.parameters.consideration.findIndex(
      (considerationItem) =>
        considerationItem.itemType === offerItem.itemType &&
        considerationItem.token === offerItem.token &&
        considerationItem.identifierOrCriteria === offerItem.identifierOrCriteria
    )
    if (considerationIndex === -1) {
      throw new Error('Could not find matching offer item in the consideration for private listing')
    }
    nftRelatedFulfillments.push({
      considerationComponents: [
        {
          itemIndex: considerationIndex,
          orderIndex: 0
        }
      ],
      offerComponents: [
        {
          itemIndex: offerIndex,
          orderIndex: 0
        }
      ]
    })
  })

  const currencyRelatedFulfillments: MatchOrdersFulfillment[] = []

  // For the original order, we need to match everything offered with every consideration item
  // on the original order that's set to go to the private listing recipient
  privateListingOrder.parameters.consideration.forEach((considerationItem, considerationIndex) => {
    if (!isCurrencyItem(considerationItem)) {
      return
    }
    // We always match the offer item (index 0) of the counter order (index 1)
    // with all of the payment items on the private listing
    currencyRelatedFulfillments.push({
      considerationComponents: [
        {
          itemIndex: considerationIndex,
          orderIndex: 0
        }
      ],
      offerComponents: [
        {
          itemIndex: 0,
          orderIndex: 1
        }
      ]
    })
  })

  return [...nftRelatedFulfillments, ...currencyRelatedFulfillments]
}

export const cancelSeaportOrders = async ({
  accountAddress,
  gasData,
  orders,
  seaport
}: {
  accountAddress: string
  gasData: GasDataI
  orders: OrderComponents[]
  seaport: Seaport
}): Promise<string> => {
  const transaction = await seaport
    .cancelOrders(orders, accountAddress)
    .transact({ gasLimit: gasData.gasFees, gasPrice: gasData.gasPrice })
  return transaction.hash
}

export async function calculateConduitApprovalsFees(signer: ethers.Wallet) {
  // TODO: SEAPORT
  const wethAddress = window.coins.WETH.coinfig.type.erc20Address!
  const tokenContract = new ethers.Contract(wethAddress, ERC20_ABI, signer)
  const conduitAddress = CONDUIT_KEYS_TO_CONDUIT[CROSS_CHAIN_DEFAULT_CONDUIT_KEY]
  const approvedBalance = new BigNumber(
    await tokenContract.allowance(signer.address, conduitAddress)
  )
  if (approvedBalance.isEqualTo(ethers.constants.MaxInt256._hex)) {
    return new BigNumber(0)
  }
  const fee = await tokenContract.estimateGas.approve(conduitAddress, ethers.constants.MaxInt256)
  return fee
}

export async function calculateWrapEthFees(signer: ethers.Wallet) {
  const wrapEthAddr =
    // @ts-ignore
    signer.provider?.network?.name === 'rinkeby' ? WETH_CONTRACT_RINKEBY : WETH_CONTRACT_MAINNET
  const wrapEthContract = new ethers.Contract(wrapEthAddr, WETH_ABI, signer)

  const fee = await wrapEthContract.estimateGas.deposit([])
  return fee
}

export async function fungibleTokenApprovals({
  gasData,
  minimumAmount,
  signer
}: {
  gasData: GasDataI
  minimumAmount: BigNumber
  signer: ethers.Wallet
}) {
  // TODO: SEAPORT
  const wethAddress = window.coins.WETH.coinfig.type.erc20Address!
  const conduitAddress = CONDUIT_KEYS_TO_CONDUIT[CROSS_CHAIN_DEFAULT_CONDUIT_KEY]
  const accountAddress = await signer.getAddress()
  const fungibleTokenInterface = new ethers.Contract(wethAddress, ERC20_ABI, signer)
  const approvedAmount = new BigNumber(
    await fungibleTokenInterface.allowance(accountAddress, conduitAddress)
  )
  if (approvedAmount.isGreaterThanOrEqualTo(minimumAmount)) {
    // eslint-disable-next-line no-console
    console.log('Already approved enough ERC20 tokens')
    return null
  }
  // eslint-disable-next-line no-console
  console.log('Not enough ERC20 allowance approved for this trade. Approving now...')

  // Note: approving maximum amount so this doesnt need to be done again for future trades.
  const txHash = await fungibleTokenInterface.approve(
    conduitAddress,
    ethers.constants.MaxInt256.toString(),
    { gasLimit: gasData.approvalFees, gasPrice: gasData.gasPrice }
  )
  await txHash.wait()
  return txHash
}
