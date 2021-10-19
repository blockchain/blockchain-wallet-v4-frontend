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
  basePrice: BigNumber
  calldata: string
  exchange: string
  expirationTime: BigNumber
  extra: BigNumber
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
  salt: BigNumber
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

export type NftAssetsType = {
  assets: {
    animation_original_url: null
    animation_url: null
    asset_contract: {
      address: string
      asset_contract_type: string
      buyer_fee_basis_points: number
      created_date: string
      default_to_fiat: boolean
      description: string
      dev_buyer_fee_basis_points: number
      dev_seller_fee_basis_points: number
      external_link: null
      image_url: null
      name: string
      nft_version: null
      only_proxied_transfers: boolean
      opensea_buyer_fee_basis_points: number
      opensea_seller_fee_basis_points: number
      opensea_version: string
      owner: number
      payout_address: null
      schema_name: string
      seller_fee_basis_points: number
      symbol: string
      total_supply: null
    }
    background_color: null | string
    collection: {
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
      external_url: string
      featured: boolean
      featured_image_url: string
      hidden: boolean
      image_url: string
      instagram_username: string
      is_subject_to_whitelist: boolean
      large_image_url: string
      medium_username: string
      name: string
      only_proxied_transfers: boolean
      opensea_buyer_fee_basis_points: string
      opensea_seller_fee_basis_points: string
      payout_address: string
      require_email: boolean
      safelist_request_status: string
      short_description: null
      slug: string
      telegram_url: null
      twitter_username: string
      wiki_url: null
    }
    creator: {
      address: string
      config: string
      profile_img_url: string
      user: {
        username: string
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
            username: string
          }
        }
        id: number
        timestamp: string
        to_account: {
          address: string
          config: string
          profile_img_url: string
          user: {
            username: string
          }
        }
        transaction_hash: string
        transaction_index: string
      }
    }
    listing_date: null
    name: string
    num_sales: number
    owner: {
      address: string
      config: string
      profile_img_url: string
      user: {
        username: string
      }
    }
    permalink: string
    sell_orders: {
      approved_on_chain: boolean
      base_price: string
      bounty_multiple: string
      calldata: string
      cancelled: boolean
      closing_date: null
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
      payment_token_contract: {
        address: string
        decimals: number
        eth_price: string
        id: number
        image_url: string
        name: string
        symbol: string
        usd_price: string
      }
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
    }[]
    token_id: string
    token_metadata: null
    top_bid: null
    traits: []
    transfer_fee: null
    transfer_fee_payment_token: null
  }[]
}

export type NftOrdersType = {
  count: number
  orders: {
    approved_on_chain: boolean
    asset: {
      animation_original_url: null
      animation_url: null
      asset_contract: {
        address: string
        asset_contract_type: string
        buyer_fee_basis_points: number
        created_date: string
        default_to_fiat: boolean
        description: string
        dev_buyer_fee_basis_points: number
        dev_seller_fee_basis_points: number
        external_link: string
        image_url: string
        name: string
        nft_version: string
        only_proxied_transfers: boolean
        opensea_buyer_fee_basis_points: number
        opensea_seller_fee_basis_points: number
        opensea_version: null
        owner: number
        payout_address: string
        schema_name: string
        seller_fee_basis_points: number
        symbol: string
        total_supply: string
      }
      background_color: null
      collection: {
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
        external_url: string
        featured: boolean
        featured_image_url: string
        hidden: boolean
        image_url: string
        instagram_username: string
        is_subject_to_whitelist: boolean
        large_image_url: string
        medium_username: string
        name: string
        only_proxied_transfers: boolean
        opensea_buyer_fee_basis_points: string
        opensea_seller_fee_basis_points: string
        payout_address: string
        require_email: boolean
        safelist_request_status: string
        short_description: null
        slug: string
        telegram_url: null
        twitter_username: string
        wiki_url: null
      }
      decimals: number
      description: string
      external_link: string
      id: number
      image_original_url: string
      image_preview_url: string
      image_thumbnail_url: string
      image_url: string
      name: string
      num_sales: number
      owner: {
        address: string
        config: string
        profile_img_url: string
        user: {
          username: string
        }
      }
      permalink: string
      token_id: string
      token_metadata: string
    }
    asset_bundle: null
    base_price: string
    bounty_multiple: string
    calldata: string
    cancelled: boolean
    closing_date: string
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
      user: {
        username: string
      }
    }
    finalized: boolean
    how_to_call: number
    id: number
    listing_time: number
    maker: {
      address: string
      config: string
      profile_img_url: string
      user: null
    }
    maker_protocol_fee: string
    maker_referrer_fee: string
    maker_relayer_fee: string
    marked_invalid: boolean
    metadata: {
      asset: {
        address: string
        id?: string
        quantity: string
      }
      referrerAddress?: string
      schema: WyvernSchemaName
    }
    order_hash: string
    payment_token: string
    payment_token_contract: {
      address: string
      decimals: number
      eth_price: string
      id: number
      image_url: string
      name: string
      symbol: string
      usd_price: string
    }
    prefixed_hash: string
    quantity: BigNumber
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
      user: {
        username: string
      }
    }
    taker_protocol_fee: string
    taker_relayer_fee: string
    target: string
    v: number
  }[]
}

export enum SolidityTypes {
  Address = 'address',
  Bytes = 'bytes',
  String = 'string',
  Uint = 'uint',
  Uint256 = 'uint256',
  Uint8 = 'uint8'
}
