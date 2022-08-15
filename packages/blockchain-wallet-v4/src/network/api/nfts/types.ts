import BigNumber from 'bignumber.js'

/**
 * Wyvern order side: buy or sell.
 */
export enum NftOrderSide {
  Buy = 0,
  Sell = 1
}

/**
 * Wyvern: type of sale. Fixed or Dutch auction
 * Note: not imported from wyvern.js because it uses
 * EnglishAuction as 1 and DutchAuction as 2
 */
export enum NftSaleKind {
  FixedPrice = 0,
  DutchAuction = 1
}

/**
 * Wyvern fee method
 * ProtocolFee: Charge maker fee to seller and charge taker fee to buyer.
 * SplitFee: Maker fees are deducted from the token amount that the maker receives. Taker fees are extra tokens that must be paid by the taker.
 */
export enum FeeMethod {
  ProtocolFee = 0,
  SplitFee = 1
}

export enum HowToCall {
  Call = 0,
  DelegateCall = 1,
  StaticCall = 2,
  Create = 3
}

export interface WyvernNFTAsset {
  address: string
  id: string
}
export interface WyvernFTAsset {
  address: string
  id?: string
  quantity: string
}
export type WyvernAsset = WyvernNFTAsset | WyvernFTAsset

// Wyvern Schemas (see https://github.com/ProjectOpenSea/wyvern-schemas)
export enum WyvernSchemaName {
  ENSShortNameAuction = 'ENSShortNameAuction',
  ERC1155 = 'ERC1155',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  LegacyEnjin = 'Enjin'
  // CryptoPunks = 'CryptoPunks'
}

export interface ExchangeMetadataForAsset {
  asset: WyvernAsset
  referrerAddress?: string
  schema: WyvernSchemaName
}

// Abstractions over Wyvern assets for bundles
export interface WyvernBundle {
  assets: WyvernAsset[]
  description?: string
  external_link?: string
  name?: string
  schemas: WyvernSchemaName[]
}

export interface ExchangeMetadataForBundle {
  bundle: WyvernBundle
  referrerAddress?: string
}

export type ExchangeMetadata = ExchangeMetadataForAsset | ExchangeMetadataForBundle

export interface WyvernOrder {
  basePrice: BigNumber | string
  calldata: string
  exchange: string
  expirationTime: BigNumber
  extra: BigNumber | string
  feeMethod: number
  feeRecipient: string
  howToCall: number
  listingTime: BigNumber
  maker: string
  makerProtocolFee: BigNumber
  makerRelayerFee: BigNumber
  paymentToken: string
  replacementPattern: string
  saleKind: number
  salt: string
  side: number
  staticExtradata: string
  staticTarget: string
  taker: string
  takerProtocolFee: BigNumber
  takerRelayerFee: BigNumber
  target: string
}

export interface UnhashedOrder extends WyvernOrder {
  englishAuctionReservePrice?: BigNumber
  feeMethod: FeeMethod
  howToCall: HowToCall
  // OpenSea-specific
  makerReferrerFee: BigNumber
  metadata: ExchangeMetadata

  quantity: BigNumber
  saleKind: NftSaleKind
  side: NftOrderSide

  waitingForBestCounterOrder: boolean
}

export interface UnsignedOrder extends UnhashedOrder {
  hash: string
}

export declare enum TokenStandardVersion {
  ERC721v1 = '1.0',
  ERC721v2 = '2.0',
  ERC721v3 = '3.0',
  Enjin = '1155-1.0',
  Locked = 'locked',
  Unsupported = 'unsupported'
}

/**
 * Simple, unannotated asset spec
 */
export interface Asset {
  decimals?: number
  name?: string
  schemaName?: WyvernSchemaName
  tokenAddress: string
  tokenId: string | null
  version?: TokenStandardVersion
}
/**
 * Types of asset contracts
 * Given by the asset_contract_type in the OpenSea API
 */
export declare enum AssetContractTypeType {
  Fungible = 'fungible',
  NonFungible = 'non-fungible',
  SemiFungible = 'semi-fungible',
  Unknown = 'unknown'
}
/**
 * Annotated asset contract with OpenSea metadata
 */

/**
 * Annotated asset contract with OpenSea metadata
 */
export interface OpenSeaAssetContract extends OpenSeaFees {
  address: string
  buyerFeeBasisPoints: number
  description: string
  externalLink?: string
  imageUrl: string
  name: string
  schemaName: WyvernSchemaName
  sellerFeeBasisPoints: number
  stats?: object
  tokenSymbol: string
  traits?: object[]
  type: AssetContractTypeType
  wikiLink?: string
}

export interface OpenSeaStatus {
  page: {
    id: string
    name: string
    time_zone: string
    updated_at: string
    url: string
  }
  status: {
    description: string
    indicator: string
  }
}

export interface OwnerNftBalance {
  assets: NftAsset[]
  next: string
  previous: string
}

export interface ComputedFees extends OpenSeaFees {
  // Fees that go to whoever refers the order to the taker.
  // Comes out of OpenSea fees
  sellerBountyBasisPoints: number
  // Total fees. dev + opensea
  totalBuyerFeeBasisPoints: number

  totalSellerFeeBasisPoints: number
  // Fees that the item's creator takes on every transfer
  transferFee: BigNumber

  transferFeeTokenAddress: string | null
}

export interface Token {
  address: string
  decimals: number
  name: string
  symbol: string
}
/**
 * Full annotated Fungible Token spec with OpenSea metadata
 */
export interface OpenSeaFungibleToken extends Token {
  ethPrice?: string
  imageUrl?: string
  usdPrice?: string
}

/**
 * Query interface for Fungible Assets
 */
export interface OpenSeaFungibleTokenQuery extends Partial<OpenSeaFungibleToken> {
  limit?: number
  offset?: number
  symbol?: string
}
/**
 * The basis point values of each type of fee
 */
export interface OpenSeaFees {
  devBuyerFeeBasisPoints: number
  devSellerFeeBasisPoints: number
  openseaBuyerFeeBasisPoints: number
  openseaSellerFeeBasisPoints: number
}

interface NumericalTraitStats {
  max: number
  min: number
}
interface StringTraitStats {
  [key: string]: number
}

export interface OpenSeaTraitStats {
  [traitName: string]: NumericalTraitStats | StringTraitStats
}
/**
 * Annotated collection with OpenSea metadata
 */
export interface OpenSeaCollection extends OpenSeaFees {
  createdDate: Date
  description: string
  displayData: object
  editors: string[]
  externalLink?: string
  featured: boolean
  featuredImageUrl: string
  hidden: boolean
  imageUrl: string
  largeImageUrl: string
  name: string
  paymentTokens: OpenSeaFungibleToken[]
  payoutAddress?: string
  slug: string
  stats: Stats
  traitStats: OpenSeaTraitStats
  wikiLink?: string
}

export interface CollectionData {
  collection_data: NftAsset['collection'] & {
    stats: Stats
  }
  name: string
  slug: string
}

/**
 * Defines set of possible auctions types
 */
export declare enum AuctionType {
  Dutch = 'dutch',
  English = 'english',
  MinPrice = 'min_price'
}

/**
 * Defines the possible types of asset events that can take place
 */
export declare enum AssetEventType {
  AssetApprove = 'approve',
  AssetTransfer = 'transfer',
  AuctionCancelled = 'cancelled',
  AuctionCreated = 'created',
  AuctionSuccessful = 'successful',
  BidEntered = 'bid_entered',
  BidWithdraw = 'bid_withdraw',
  CompositionCreated = 'composition_created',
  Custom = 'custom',
  OfferEntered = 'offer_entered',
  Payout = 'payout'
}

export interface OpenSeaUser {
  username: string
}

/**
 * The OpenSea account object appended to orders, providing extra metadata, profile images and usernames
 */
export interface OpenSeaAccount {
  address: string
  config: string
  profileImgUrl: string
  user: OpenSeaUser | null
}

/**
 * Defines a Transaction type.
 */
export interface Transaction {
  blockHash: string
  blockNumber: string
  createdDate: Date
  fromAccount: OpenSeaAccount
  modifiedDate: Date
  timestamp: Date
  toAccount: OpenSeaAccount
  transactionHash: string
  transactionIndex: string
}

/**
 * Defines a AssetEvent type which contains details about an event that occurred
 */
export interface AssetEvent {
  auctionType: AuctionType
  eventTimestamp: Date
  eventType: AssetEventType
  paymentToken: OpenSeaFungibleToken | null
  totalPrice: string
  transaction: Transaction | null
}

export interface OpenSeaAsset extends Asset {
  assetContract: OpenSeaAssetContract
  backgroundColor: string | null
  buyOrders: NftOrder[] | null
  collection: OpenSeaCollection
  description: string
  externalLink: string
  imagePreviewUrl: string
  imageUrl: string
  imageUrlOriginal: string
  imageUrlThumbnail: string
  isPresale: boolean
  lastSale: AssetEvent | null
  name: string
  numSales: number
  openseaLink: string
  orders: NftOrder[] | null
  owner: OpenSeaAccount
  sellOrders: NftOrder[] | null
  traits: object[]
  transferFee: BigNumber | string | null
  transferFeePaymentToken: OpenSeaFungibleToken | null
}

/**
 * Bundles of assets, grouped together into one OpenSea order
 * URLs for bundles are auto-generated from the name
 */
export interface OpenSeaAssetBundle {
  assetContract?: OpenSeaAssetContract
  assets: OpenSeaAsset[]
  description?: string
  externalLink?: string
  maker: OpenSeaAccount
  name: string
  permalink: string
  sellOrders: NftOrder[] | null
  slug: string
}
export interface ECSignature {
  r: string
  s: string
  v: number
}
/**
 * Orders don't need to be signed if they're pre-approved
 * with a transaction on the contract to approveOrder_
 */
export interface NftOrder extends UnsignedOrder, Partial<ECSignature> {
  asset?: OpenSeaAsset
  assetBundle?: OpenSeaAssetBundle
  cancelledOrFinalized?: boolean
  createdTime?: BigNumber
  currentBounty?: BigNumber
  currentPrice?: BigNumber
  feeRecipientAccount?: OpenSeaAccount
  makerAccount?: OpenSeaAccount
  markedInvalid?: boolean
  paymentTokenContract?: OpenSeaFungibleToken
  takerAccount?: OpenSeaAccount
}

export enum GasCalculationOperations {
  AcceptOffer = 'accept-offer',
  Buy = 'buy',
  Cancel = 'cancel',
  CancelOffer = 'cancel-offer',
  CancelOrder = 'cancel-order',
  CreateOffer = 'create-offer',
  Sell = 'sell',
  Transfer = 'transfer',
  WrapEth = 'wrap-eth'
}

export interface GasDataI {
  approvalFees: number
  gasFees: number
  gasPrice: number
  proxyFees: number
  totalFees: number
}

export interface txnData {
  gasLimit: number
  gasPrice: number
}

export interface WyvernRawOrder {
  approved_on_chain: boolean
  base_price: string
  bounty_multiple: string
  calldata: string
  cancelled: boolean
  closing_date: string | null
  closing_extendable: boolean
  created_date: string
  current_bounty: string
  current_price: string
  exchange: string
  expiration_time: number
  extra: string
  fee_method: number
  fee_recipient: {
    address: string
    config: string
    profile_img_url: string
    user: number
  }
  finalized: boolean
  how_to_call: number
  listing_time: number
  maker: {
    address: string
    config: string
    profile_img_url: string
    user: number
  }
  maker_protocol_fee: string
  maker_referrer_fee: string
  maker_relayer_fee: string
  marked_invalid: boolean
  metadata: {
    asset: {
      address: string
      id: string
    }
    schema: string
  }
  order_hash: string
  payment_token: string
  payment_token_contract: PaymentTokenContractType
  prefixed_hash: string
  quantity: string
  r: string
  replacement_pattern: string
  s: string
  sale_kind: number
  salt: string
  side: number
  static_extradata: string
  static_target: string
  taker: {
    address: string
    config: string
    profile_img_url: string
    user: number
  }
  taker_protocol_fee: string
  taker_relayer_fee: string
  target: string
  v: number
}

interface AssetContractType {
  address: string
  asset_contract_type: string
  buyer_fee_basis_points: number
  created_date: string
  default_to_fiat: boolean
  description: string
  dev_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  external_link: string | null
  image_url: null
  name: string
  nft_version: null
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: number
  opensea_seller_fee_basis_points: number
  opensea_version: string
  owner: number
  payout_address: null
  schema_name: WyvernSchemaName
  seller_fee_basis_points: number
  symbol: string
  total_supply: null
}

export interface PaymentTokenContractType {
  address: string
  decimals: number
  eth_price: string
  image_url: string
  name: string
  symbol: string
  usd_price: string
}

export interface NftCollection {
  banner_image_url: string
  chat_url: null
  created_date: string
  default_to_fiat: boolean
  description: string
  dev_buyer_fee_basis_points: string
  dev_seller_fee_basis_points: string
  discord_url: string
  display_data: {
    card_display_style: string
  }
  editors: string[]
  external_url: string
  featured: boolean
  featured_image_url: string
  hidden: boolean
  image_url: string
  instagram_username: null
  is_subject_to_whitelist: boolean
  large_image_url: string
  medium_username: null
  name: string
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: string
  opensea_seller_fee_basis_points: string
  payment_tokens: PaymentTokenContractType[]
  payout_address: string
  primary_asset_contracts: AssetContractType[]
  require_email: boolean
  safelist_request_status: string
  short_description: null
  slug: string
  stats: Stats
  telegram_url: null
  traits: {
    [key in string]: {
      [key in string]: number
    }
  }
  twitter_username: string
  wiki_url: null
}

export interface NftAsset {
  animation_original_url: null
  animation_url: null
  asset_contract: AssetContractType
  background_color: null | string
  collection: NftCollection
  creator: {
    address: string
    config: string
    profile_img_url: string
    user: {
      username: string | null
    }
  }
  decimals: null
  description: string
  external_link: null
  id: number
  image_original_url: null
  image_preview_url: string
  image_thumbnail_url: string
  image_url: string
  is_presale: boolean
  last_sale: {
    asset: {
      decimals: null
      token_id: string
    }
    asset_bundle: null
    auction_type: null
    created_date: string
    event_timestamp: string
    event_type: string
    payment_token: {
      address: string
      decimals: number
      eth_price: string
      id: number
      image_url: string
      name: string
      symbol: string
      usd_price: string
    }
    quantity: string
    total_price: string
    transaction: {
      block_hash: string
      block_number: string
      from_account: {
        address: string
        config: string
        profile_img_url: string
        user: {
          username: string | null
        } | null
      }
      id: number
      timestamp: string
      to_account: {
        address: string
        config: string
        profile_img_url: string
        user: {
          username: string
        } | null
      }
      transaction_hash: string
      transaction_index: string
    }
  }
  listing_date: null
  name: string
  num_sales: number
  orders: WyvernRawOrder[] | null
  owner: {
    address: string
    config: string
    profile_img_url: string
    user: {
      username: string | null
    }
  }
  ownership?: {
    owner: {
      address: string
      config: string
      profile_img_url: string
      user: { username: string }
    }
    quantity: number
  }
  permalink: string
  seaport_sell_orders: SeaportRawOrder[] | null
  token_id: string
  token_metadata: null
  top_bid: null
  top_ownerships?: [
    {
      owner: {
        address: string
        config: string
        profile_img_url: string
        user: { username: string }
      }
      quantity: number
    }
  ]
  traits: [
    {
      trait_count: number
      trait_max_value: number
      trait_type: string
      value: string
    }
  ]
  transfer_fee: string | null
  transfer_fee_payment_token: null
}

export type NftAssetsType = NftAsset[]

export type NftOrdersType = {
  count: number
  orders: NftOrder[]
}

export enum SolidityTypes {
  Address = 'address',
  Bytes = 'bytes',
  String = 'string',
  Uint = 'uint',
  Uint256 = 'uint256',
  Uint8 = 'uint8'
}

/**
 * To simplify typifying ABIs
 */

enum AbiType {
  Constructor = 'constructor',
  Event = 'event',
  Fallback = 'fallback',
  Function = 'function'
}

type ConstructorStateMutability = 'nonpayable' | 'payable'

export interface PartialAbiDefinition {
  anonymous?: boolean
  constant?: boolean
  inputs?: object[]
  // Not Partial!
  name?: string
  outputs?: object[]
  payable?: boolean
  stateMutability?: ConstructorStateMutability | string
  type: AbiType | string
}

export type PartialReadonlyContractAbi = Array<Readonly<PartialAbiDefinition>>

export interface Stats {
  average_price: number
  count: number
  floor_price: number
  market_cap: number
  num_owners: number
  num_reports: number
  one_day_average_price: number
  one_day_change: number
  one_day_sales: number
  one_day_volume: number
  seven_day_average_price: number
  seven_day_change: number
  seven_day_sales: number
  seven_day_volume: number
  thirty_day_average_price: number
  thirty_day_change: number
  thirty_day_sales: number
  thirty_day_volume: number
  total_sales: number
  total_supply: number
  total_volume: number
}

export interface ExplorerGatewayNftCollectionType {
  added_timestamp: string
  average_price: string
  collection_data: CollectionData['collection_data']
  count: number
  created_timestamp: string
  floor_price: string
  image_url: string
  large_image_url: string
  market_cap: string
  name: string
  num_owners: number
  one_day_average_price: string
  one_day_change: string
  one_day_sales: string
  one_day_volume: string
  slug: string
  total_sales: number
  total_supply: number
  total_volume: string
}

// Only keeping around relevant info for now
export type ExplorerGatewaySearchType = {
  accounts: {
    address: string
    config: string
    date_ingested: string
    profile_img_url: string
    username: string | null
  }[]
  assets: {
    collection_slug: string
    contract_address: string
    id: string
    image_original_url: string
    image_preview_url: string
    image_thumbnail_url: string
    image_url: string
    name: string
    token_id: string
  }[]
  collections: {
    image_url: string | null
    name: string
    num_owners: null
    safelist_request_status: string
    slug: string
  }[]
  contracts: {
    address: string
    asset_contract_type: string
    created_date: string
    date_ingested: string
    nft_version: string
    owner: string | null
    schema_name: string
    symbol: string
    total_supply: string
  }[]
}

export type NftUserPreferencesType = {
  auction_expired: boolean | null
  bid_activity: boolean | null
  item_sold: boolean | null
  offer_accepted: boolean | null
  outbid: boolean | null
  successful_purchase: boolean | null
}

export type NftUserPreferencesReturnType = {
  auction_expired: boolean | null
  bid_activity: boolean | null
  item_sold: boolean | null
  last_updated: string
  offer_accepted: boolean | null
  outbid: boolean | null
  successful_purchase: boolean | null
}

export type SeaportRawOrder = {
  cancelled: false
  client_signature: string
  closing_date: string
  created_date: string
  current_price: string
  expiration_time: number
  finalized: boolean
  listing_time: number
  maker: {
    address: string
    config: ''
    profile_img_url: string
    user: number | null
  }
  maker_fees: {
    account: {
      address: string
      config: ''
      profile_img_url: string
      user: number | null
    }
    basis_points: string
  }[]
  marked_invalid: boolean
  order_hash: string
  order_type: 'basic'
  protocol_address: string
  protocol_data: {
    parameters: {
      conduitKey: string
      consideration: {
        endAmount: string
        identifierOrCriteria: string
        itemType: number
        recipient: string
        startAmount: string
        token: string
      }[]
      counter: number
      endTime: string
      offer: [
        {
          endAmount: string
          identifierOrCriteria: string
          itemType: number
          startAmount: string
          token: string
        }
      ]
      offerer: string
      orderType: number
      salt: string
      startTime: string
      totalOriginalConsiderationItems: number
      zone: string
      zoneHash: string
    }
    signature: string
  }
  relay_id: string
  side: 'ask' | 'bid'
  taker: {
    address: string
    config: ''
    profile_img_url: string
    user: number | null
  } | null
  taker_fees: []
}

export type NftTemplateParams = {
  amount?: string | null // ETH
  nft_activity_link: string
  nft_bidder?: string | null
  nft_image: string
  nft_marketplace_link: string
  nft_name: string
  nft_seller?: string | null
  value?: string | null // USD
}
