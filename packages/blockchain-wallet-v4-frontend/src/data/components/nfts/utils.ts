/* eslint-disable @typescript-eslint/no-use-before-define */
import BigNumber from 'bignumber.js'

import {
  AssetEvent,
  NftOrder,
  NftOrderSide,
  NftSaleKind,
  OpenSeaAccount,
  OpenSeaAsset,
  OpenSeaAssetBundle,
  OpenSeaAssetContract,
  OpenSeaCollection,
  OpenSeaFungibleToken,
  OpenSeaTraitStats,
  OpenSeaUser,
  Transaction
} from '@core/network/api/nfts/types'
import { INVERSE_BASIS_POINT, NULL_ADDRESS } from '@core/redux/payment/nfts/constants'

export const nonTraitFilters = [
  'collection',
  'event',
  'forSale',
  'max',
  'min',
  'sortBy',
  'verifiedOnly'
]
/**
 * Special fixes for making BigNumbers using web3 results
 * @param arg An arg or the result of a web3 call to turn into a BigNumber
 */
export function makeBigNumber(arg: number | string | BigNumber): BigNumber {
  // Zero sometimes returned as 0x from contracts
  if (arg === '0x') {
    arg = 0
  }
  // fix "new BigNumber() number type has more than 15 significant digits"
  arg = arg.toString()
  return new BigNumber(arg)
}

/**
 * Estimates the price of an order
 * @param order The order to estimate price on
 * @param secondsToBacktrack The number of seconds to subtract on current time,
 *  to fix race conditions
 * @param shouldRoundUp Whether to round up fractional wei
 */
export function estimateCurrentPrice(
  order: NftOrder,
  secondsToBacktrack = 30,
  shouldRoundUp = true
) {
  let { basePrice, expirationTime, extra, listingTime } = order
  const { saleKind, side, takerRelayerFee } = order

  const now = new BigNumber(Math.round(Date.now() / 1000)).minus(secondsToBacktrack)
  basePrice = new BigNumber(basePrice)
  listingTime = new BigNumber(listingTime)
  expirationTime = new BigNumber(expirationTime)
  extra = new BigNumber(extra)

  let exactPrice = basePrice

  if (saleKind === NftSaleKind.FixedPrice) {
    // Do nothing, price is correct
  } else if (saleKind === NftSaleKind.DutchAuction) {
    const diff = extra.times(now.minus(listingTime)).dividedBy(expirationTime.minus(listingTime))

    exactPrice =
      side === NftOrderSide.Sell
        ? /* Sell-side - start price: basePrice. End price: basePrice - extra. */
          basePrice.minus(diff)
        : /* Buy-side - start price: basePrice. End price: basePrice + extra. */
          basePrice.plus(diff)
  }

  // Add taker fee only for buyers
  if (side === NftOrderSide.Sell && !order.waitingForBestCounterOrder) {
    // Buyer fee increases sale price
    exactPrice = exactPrice.times(+takerRelayerFee / INVERSE_BASIS_POINT + 1)
  }

  return shouldRoundUp ? exactPrice.integerValue() : exactPrice
}

export const assetContractFromJSON = (asset_contract: any): OpenSeaAssetContract => {
  return {
    address: asset_contract.address,
    buyerFeeBasisPoints: +asset_contract.buyer_fee_basis_points,
    description: asset_contract.description,
    devBuyerFeeBasisPoints: +asset_contract.dev_buyer_fee_basis_points,
    devSellerFeeBasisPoints: +asset_contract.dev_seller_fee_basis_points,
    externalLink: asset_contract.external_link,
    imageUrl: asset_contract.image_url,
    name: asset_contract.name,
    openseaBuyerFeeBasisPoints: +asset_contract.opensea_buyer_fee_basis_points,
    openseaSellerFeeBasisPoints: +asset_contract.opensea_seller_fee_basis_points,
    schemaName: asset_contract.schema_name,
    sellerFeeBasisPoints: +asset_contract.seller_fee_basis_points,
    tokenSymbol: asset_contract.symbol,
    type: asset_contract.asset_contract_type,
    wikiLink: asset_contract.wiki_link
  }
}

export const tokenFromJSON = (token: any): OpenSeaFungibleToken => {
  const fromJSON: OpenSeaFungibleToken = {
    address: token.address,
    decimals: token.decimals,
    ethPrice: token.eth_price,
    imageUrl: token.image_url,
    name: token.name,
    symbol: token.symbol,
    usdPrice: token.usd_price
  }

  return fromJSON
}

export const collectionFromJSON = (collection: any): OpenSeaCollection => {
  const createdDate = new Date(`${collection.created_date}Z`)

  return {
    createdDate,
    description: collection.description,
    devBuyerFeeBasisPoints: +collection.dev_buyer_fee_basis_points,
    devSellerFeeBasisPoints: +collection.dev_seller_fee_basis_points,
    displayData: collection.display_data,
    editors: collection.editors,
    externalLink: collection.external_url,
    featured: collection.featured,
    featuredImageUrl: collection.featured_image_url,
    hidden: collection.hidden,
    imageUrl: collection.image_url,
    largeImageUrl: collection.large_image_url,
    name: collection.name,
    openseaBuyerFeeBasisPoints: +collection.opensea_buyer_fee_basis_points,
    openseaSellerFeeBasisPoints: +collection.opensea_seller_fee_basis_points,
    paymentTokens: (collection.payment_tokens || []).map(tokenFromJSON),
    payoutAddress: collection.payout_address,
    slug: collection.slug,
    stats: collection.stats,
    traitStats: collection.traits as OpenSeaTraitStats,
    wikiLink: collection.wiki_url
  }
}

export const accountFromJSON = (account: any): OpenSeaAccount => {
  return {
    address: account.address,
    config: account.config,
    profileImgUrl: account.profile_img_url,
    user: account.user ? userFromJSON(account.user) : null
  }
}

export const userFromJSON = (user: any): OpenSeaUser => {
  return {
    username: user.username
  }
}

export const transactionFromJSON = (transaction: any): Transaction => {
  return {
    blockHash: transaction.block_hash,
    blockNumber: transaction.block_number,
    createdDate: new Date(`${transaction.created_date}Z`),
    fromAccount: accountFromJSON(transaction.from_account),
    modifiedDate: new Date(`${transaction.modified_date}Z`),
    timestamp: new Date(`${transaction.timestamp}Z`),
    toAccount: accountFromJSON(transaction.to_account),
    transactionHash: transaction.transaction_hash,
    transactionIndex: transaction.transaction_index
  }
}

export const assetEventFromJSON = (assetEvent: any): AssetEvent => {
  return {
    auctionType: assetEvent.auction_type,
    eventTimestamp: assetEvent.event_timestamp,
    eventType: assetEvent.event_type,
    paymentToken: assetEvent.payment_token ? tokenFromJSON(assetEvent.payment_token) : null,
    totalPrice: assetEvent.total_price,
    transaction: assetEvent.transaction ? transactionFromJSON(assetEvent.transaction) : null
  }
}

export const assetBundleFromJSON = (asset_bundle: any): OpenSeaAssetBundle => {
  const fromJSON: OpenSeaAssetBundle = {
    assetContract: asset_bundle.asset_contract
      ? assetContractFromJSON(asset_bundle.asset_contract)
      : undefined,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assets: asset_bundle.assets.map(assetFromJSON),
    description: asset_bundle.description,
    externalLink: asset_bundle.external_link,
    maker: asset_bundle.maker,
    name: asset_bundle.name,
    permalink: asset_bundle.permalink,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    sellOrders: asset_bundle.sell_orders ? asset_bundle.sell_orders.map(orderFromJSON) : null,

    slug: asset_bundle.slug
  }

  return fromJSON
}

export const orderFromJSON = (order: any): NftOrder => {
  const createdDate = new Date(`${order.created_date}Z`)

  const fromJSON: NftOrder = {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    asset: order.asset ? assetFromJSON(order.asset) : undefined,
    assetBundle: order.asset_bundle ? assetBundleFromJSON(order.asset_bundle) : undefined,
    basePrice: new BigNumber(order.base_price),

    calldata: order.calldata,

    cancelledOrFinalized: order.cancelled || order.finalized,

    createdTime: new BigNumber(Math.round(createdDate.getTime() / 1000)),

    currentBounty: new BigNumber(order.current_bounty || 0),

    currentPrice: new BigNumber(order.current_price || 0),

    exchange: order.exchange,

    expirationTime: new BigNumber(order.expiration_time),

    extra: new BigNumber(order.extra),

    feeMethod: order.fee_method,

    feeRecipient: order.fee_recipient.address,

    feeRecipientAccount: order.fee_recipient,

    hash: order.order_hash || order.hash,

    howToCall: order.how_to_call,

    listingTime: new BigNumber(order.listing_time),
    // Use string address to conform to Wyvern Order schema
    maker: order.maker.address,
    makerAccount: order.maker,
    makerProtocolFee: new BigNumber(order.maker_protocol_fee),
    makerReferrerFee: new BigNumber(order.maker_referrer_fee || 0),
    makerRelayerFee: new BigNumber(order.maker_relayer_fee),
    markedInvalid: order.marked_invalid,
    metadata: order.metadata,
    paymentToken: order.payment_token,
    paymentTokenContract: order.payment_token_contract
      ? tokenFromJSON(order.payment_token_contract)
      : undefined,
    quantity: new BigNumber(order.quantity || 1),
    r: order.r,
    replacementPattern: order.replacement_pattern,
    s: order.s,
    saleKind: order.sale_kind,
    salt: order.salt,

    side: order.side,
    staticExtradata: order.static_extradata,
    staticTarget: order.static_target,

    taker: order.taker.address,
    takerAccount: order.taker,
    takerProtocolFee: new BigNumber(order.taker_protocol_fee),
    takerRelayerFee: new BigNumber(order.taker_relayer_fee),

    target: order.target,
    v: parseInt(order.v),
    waitingForBestCounterOrder: order.fee_recipient.address === NULL_ADDRESS
  }

  // Use client-side price calc, to account for buyer fee (not added by server) and latency
  fromJSON.currentPrice = estimateCurrentPrice(fromJSON)

  return fromJSON
}

export const assetFromJSON = (asset: any): OpenSeaAsset => {
  const isAnimated = asset.image_url && asset.image_url.endsWith('.gif')
  const isSvg = asset.image_url && asset.image_url.endsWith('.svg')
  const fromJSON: OpenSeaAsset = {
    assetContract: assetContractFromJSON(asset.asset_contract),
    backgroundColor: asset.background_color ? `#${asset.background_color}` : null,
    buyOrders: asset.buy_orders ? asset.buy_orders.map(orderFromJSON) : null,
    collection: collectionFromJSON(asset.collection),

    description: asset.description,

    externalLink: asset.external_link,

    imagePreviewUrl: asset.image_preview_url,

    // Don't use previews if it's a special image
    imageUrl: isAnimated || isSvg ? asset.image_url : asset.image_preview_url || asset.image_url,

    imageUrlOriginal: asset.image_original_url,

    imageUrlThumbnail: asset.image_thumbnail_url,

    isPresale: asset.is_presale,

    lastSale: asset.last_sale ? assetEventFromJSON(asset.last_sale) : null,
    name: asset.name,
    numSales: asset.num_sales,
    openseaLink: asset.permalink,

    orders: asset.orders ? asset.orders.map(orderFromJSON) : null,
    owner: asset.owner,
    sellOrders: asset.sell_orders ? asset.sell_orders.map(orderFromJSON) : null,
    tokenAddress: asset.asset_contract.address,
    tokenId: asset.token_id.toString(),
    traits: asset.traits,

    transferFee: asset.transfer_fee ? makeBigNumber(asset.transfer_fee) : null,
    transferFeePaymentToken: asset.transfer_fee_payment_token
      ? tokenFromJSON(asset.transfer_fee_payment_token)
      : null
  }
  // If orders were included, put them in sell/buy order groups
  if (fromJSON.orders && !fromJSON.sellOrders) {
    fromJSON.sellOrders = fromJSON.orders.filter((o) => o.side === NftOrderSide.Sell)
  }
  if (fromJSON.orders && !fromJSON.buyOrders) {
    fromJSON.buyOrders = fromJSON.orders.filter((o) => o.side === NftOrderSide.Buy)
  }
  return fromJSON
}
