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
  WETH_CONTRACT_MAINNET,
  WETH_CONTRACT_RINKEBY
} from './constants'
import { getAssetItems, getFees, getMaxOrderExpirationTimestamp } from './seaport.utils'
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

    return order
  } catch (e) {
    console.log(e)
  }

  // return this.api.postOrder(order, { protocol: 'seaport', side: 'bid' })
}
