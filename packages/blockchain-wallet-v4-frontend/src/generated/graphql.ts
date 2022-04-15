import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Account = {
  __typename?: 'Account';
  address: Scalars['ID'];
  config: Scalars['String'];
  date_ingested: Scalars['String'];
  profile_img_url: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type Asset = {
  __typename?: 'Asset';
  animation_original_url?: Maybe<Scalars['String']>;
  animation_url?: Maybe<Scalars['String']>;
  asset_bundle_slug: Scalars['String'];
  background_color?: Maybe<Scalars['String']>;
  collection: Collection;
  contract?: Maybe<Contract>;
  creator?: Maybe<Account>;
  date_ingested: Scalars['String'];
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  external_link?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image_original_url?: Maybe<Scalars['String']>;
  image_preview_url?: Maybe<Scalars['String']>;
  image_thumbnail_url?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  is_nsfw: Scalars['Boolean'];
  is_presale: Scalars['Boolean'];
  last_sale?: Maybe<Event>;
  listing?: Maybe<Array<Maybe<Event>>>;
  name?: Maybe<Scalars['String']>;
  num_sales: Scalars['Int'];
  offers?: Maybe<Array<Maybe<Event>>>;
  owners?: Maybe<Array<Maybe<Account>>>;
  permalink: Scalars['String'];
  supports_wyvern: Scalars['Boolean'];
  token_id: Scalars['String'];
  token_metadata?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Maybe<Trait>>>;
  transfer_fee?: Maybe<Scalars['String']>;
  transfer_fee_address: Scalars['String'];
  transfer_fee_symbol: Scalars['String'];
};

export type AssetFilter = {
  field: AssetFilterFields;
  operator?: InputMaybe<FilterOperators>;
  value?: InputMaybe<Scalars['String']>;
};

export enum AssetFilterFields {
  AnimationOriginalUrl = 'animation_original_url',
  AnimationUrl = 'animation_url',
  AssetBundleSlug = 'asset_bundle_slug',
  BackgroundColor = 'background_color',
  CollectionSlug = 'collection_slug',
  ContractAddress = 'contract_address',
  CreatorAddress = 'creator_address',
  DateIngested = 'date_ingested',
  Decimals = 'decimals',
  Description = 'description',
  ExternalLink = 'external_link',
  Id = 'id',
  ImageOriginalUrl = 'image_original_url',
  ImagePreviewUrl = 'image_preview_url',
  ImageThumbnailUrl = 'image_thumbnail_url',
  ImageUrl = 'image_url',
  IsNsfw = 'is_nsfw',
  IsPresale = 'is_presale',
  Name = 'name',
  NumSales = 'num_sales',
  OwnerAddress = 'owner_address',
  Permalink = 'permalink',
  Price = 'price',
  SupportsWyvern = 'supports_wyvern',
  TokenId = 'token_id',
  TokenMetadata = 'token_metadata',
  TransferFee = 'transfer_fee',
  TransferFeeAddress = 'transfer_fee_address',
  TransferFeeSymbol = 'transfer_fee_symbol'
}

export type AssetSort = {
  by?: InputMaybe<AssetSortFields>;
  direction?: InputMaybe<SortDirection>;
};

export enum AssetSortFields {
  AnimationOriginalUrl = 'animation_original_url',
  AnimationUrl = 'animation_url',
  AssetBundleSlug = 'asset_bundle_slug',
  BackgroundColor = 'background_color',
  CollectionSlug = 'collection_slug',
  ContractAddress = 'contract_address',
  CreatorAddress = 'creator_address',
  DateIngested = 'date_ingested',
  Decimals = 'decimals',
  Description = 'description',
  EndingTime = 'ending_time',
  ExternalLink = 'external_link',
  Id = 'id',
  ImageOriginalUrl = 'image_original_url',
  ImagePreviewUrl = 'image_preview_url',
  ImageThumbnailUrl = 'image_thumbnail_url',
  ImageUrl = 'image_url',
  IsNsfw = 'is_nsfw',
  IsPresale = 'is_presale',
  ListingDate = 'listing_date',
  Name = 'name',
  NumSales = 'num_sales',
  OwnerAddress = 'owner_address',
  Permalink = 'permalink',
  Price = 'price',
  SupportsWyvern = 'supports_wyvern',
  TokenId = 'token_id',
  TokenMetadata = 'token_metadata',
  TransferFee = 'transfer_fee',
  TransferFeeAddress = 'transfer_fee_address',
  TransferFeeSymbol = 'transfer_fee_symbol'
}

export type Collection = {
  __typename?: 'Collection';
  banner_image_url?: Maybe<Scalars['String']>;
  buyer_fee_basis_points: Scalars['String'];
  chat_url?: Maybe<Scalars['String']>;
  created_date: Scalars['String'];
  date_ingested: Scalars['String'];
  default_to_fiat: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  dev_buyer_fee_basis_points: Scalars['String'];
  dev_seller_fee_basis_points: Scalars['String'];
  discord_url?: Maybe<Scalars['String']>;
  external_url?: Maybe<Scalars['String']>;
  featured: Scalars['Boolean'];
  featured_image_url?: Maybe<Scalars['String']>;
  hidden: Scalars['Boolean'];
  image_url?: Maybe<Scalars['String']>;
  instagram_username?: Maybe<Scalars['String']>;
  is_subject_to_whitelist: Scalars['Boolean'];
  large_image_url?: Maybe<Scalars['String']>;
  medium_username?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  num_owners?: Maybe<Scalars['Int']>;
  only_proxied_transfers: Scalars['Boolean'];
  opensea_buyer_fee_basis_points: Scalars['String'];
  opensea_seller_fee_basis_points: Scalars['String'];
  payment_tokens?: Maybe<Array<Maybe<PaymentToken>>>;
  payout_address?: Maybe<Scalars['String']>;
  primary_asset_contracts?: Maybe<Array<Maybe<Contract>>>;
  require_email: Scalars['Boolean'];
  safelist_request_status: Scalars['String'];
  seller_fee_basis_points: Scalars['String'];
  short_description?: Maybe<Scalars['String']>;
  slug: Scalars['ID'];
  stats?: Maybe<Stats>;
  telegram_url?: Maybe<Scalars['String']>;
  total_supply?: Maybe<Scalars['Int']>;
  traits?: Maybe<Array<Maybe<CollectionTrait>>>;
  twitter_username?: Maybe<Scalars['String']>;
  wiki_url?: Maybe<Scalars['String']>;
};

export type CollectionFilter = {
  field: CollectionFilterFields;
  operator?: InputMaybe<FilterOperators>;
  value?: InputMaybe<Scalars['String']>;
};

export enum CollectionFilterFields {
  BannerImageUrl = 'banner_image_url',
  BuyerFeeBasisPoints = 'buyer_fee_basis_points',
  ChatUrl = 'chat_url',
  CreatedDate = 'created_date',
  DateIngested = 'date_ingested',
  DateUpdated = 'date_updated',
  DefaultToFiat = 'default_to_fiat',
  Deleted = 'deleted',
  Description = 'description',
  DevBuyerFeeBasisPoints = 'dev_buyer_fee_basis_points',
  DevSellerFeeBasisPoints = 'dev_seller_fee_basis_points',
  DiscordUrl = 'discord_url',
  ExternalUrl = 'external_url',
  Featured = 'featured',
  FeaturedImageUrl = 'featured_image_url',
  Hidden = 'hidden',
  ImageUrl = 'image_url',
  InstagramUsername = 'instagram_username',
  IsSubjectToWhitelist = 'is_subject_to_whitelist',
  LargeImageUrl = 'large_image_url',
  MediumUsername = 'medium_username',
  Name = 'name',
  NumOwners = 'num_owners',
  OnlyProxiedTransfers = 'only_proxied_transfers',
  OpenseaBuyerFeeBasisPoints = 'opensea_buyer_fee_basis_points',
  OpenseaSellerFeeBasisPoints = 'opensea_seller_fee_basis_points',
  PayoutAddress = 'payout_address',
  RequireEmail = 'require_email',
  SafelistRequestStatus = 'safelist_request_status',
  SellerFeeBasisPoints = 'seller_fee_basis_points',
  ShortDescription = 'short_description',
  Slug = 'slug',
  TelegramUrl = 'telegram_url',
  TotalSupply = 'total_supply',
  TwitterUsername = 'twitter_username',
  UpdateLockTime = 'update_lock_time',
  WikiUrl = 'wiki_url'
}

export type CollectionSort = {
  by?: InputMaybe<CollectionSortFields>;
  direction?: InputMaybe<SortDirection>;
};

export enum CollectionSortFields {
  BannerImageUrl = 'banner_image_url',
  BuyerFeeBasisPoints = 'buyer_fee_basis_points',
  ChatUrl = 'chat_url',
  CreatedDate = 'created_date',
  DateIngested = 'date_ingested',
  DateUpdated = 'date_updated',
  DefaultToFiat = 'default_to_fiat',
  Deleted = 'deleted',
  Description = 'description',
  DevBuyerFeeBasisPoints = 'dev_buyer_fee_basis_points',
  DevSellerFeeBasisPoints = 'dev_seller_fee_basis_points',
  DiscordUrl = 'discord_url',
  ExternalUrl = 'external_url',
  Featured = 'featured',
  FeaturedImageUrl = 'featured_image_url',
  Hidden = 'hidden',
  ImageUrl = 'image_url',
  InstagramUsername = 'instagram_username',
  IsSubjectToWhitelist = 'is_subject_to_whitelist',
  LargeImageUrl = 'large_image_url',
  MediumUsername = 'medium_username',
  Name = 'name',
  NumOwners = 'num_owners',
  OneDayVolume = 'one_day_volume',
  OnlyProxiedTransfers = 'only_proxied_transfers',
  OpenseaBuyerFeeBasisPoints = 'opensea_buyer_fee_basis_points',
  OpenseaSellerFeeBasisPoints = 'opensea_seller_fee_basis_points',
  PayoutAddress = 'payout_address',
  RequireEmail = 'require_email',
  SafelistRequestStatus = 'safelist_request_status',
  SellerFeeBasisPoints = 'seller_fee_basis_points',
  ShortDescription = 'short_description',
  Slug = 'slug',
  TelegramUrl = 'telegram_url',
  TotalSupply = 'total_supply',
  TwitterUsername = 'twitter_username',
  UpdateLockTime = 'update_lock_time',
  WikiUrl = 'wiki_url'
}

export type CollectionTrait = {
  __typename?: 'CollectionTrait';
  count?: Maybe<Scalars['Int']>;
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Contract = {
  __typename?: 'Contract';
  address: Scalars['ID'];
  asset_contract_type: Scalars['String'];
  created_date: Scalars['String'];
  date_ingested: Scalars['String'];
  nft_version?: Maybe<Scalars['String']>;
  opensea_version?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['Int']>;
  schema_name?: Maybe<Scalars['String']>;
  symbol: Scalars['String'];
  total_supply?: Maybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  asset_bundle_slug: Scalars['String'];
  asset_id: Scalars['String'];
  auction_type?: Maybe<Scalars['String']>;
  bid_amount?: Maybe<Scalars['String']>;
  collection_slug?: Maybe<Scalars['String']>;
  contract_address: Scalars['String'];
  created_date: Scalars['String'];
  custom_event_name?: Maybe<Scalars['String']>;
  date_ingested: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  ending_price?: Maybe<Scalars['String']>;
  ending_time?: Maybe<Scalars['String']>;
  event_type?: Maybe<Scalars['String']>;
  from_account_address: Scalars['String'];
  id: Scalars['ID'];
  is_private: Scalars['Boolean'];
  listing_time?: Maybe<Scalars['String']>;
  owner_account_address: Scalars['String'];
  payment_token_address: Scalars['String'];
  payment_token_symbol: Scalars['String'];
  quantity: Scalars['Int'];
  seller_account_address: Scalars['String'];
  starting_price?: Maybe<Scalars['String']>;
  to_account_address: Scalars['String'];
  total_price?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['Int']>;
  winner_account_address: Scalars['String'];
};

export enum FilterOperators {
  Eq = 'eq',
  Gt = 'gt',
  IsNull = 'isNull',
  Lt = 'lt',
  Neq = 'neq',
  NotNull = 'notNull'
}

export type PaymentToken = {
  __typename?: 'PaymentToken';
  address: Scalars['ID'];
  date_ingested: Scalars['String'];
  date_updated?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  eth_price?: Maybe<Scalars['String']>;
  image_url: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  symbol: Scalars['String'];
  usd_price?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  assets: Array<Asset>;
  collections: Array<Collection>;
};


export type QueryAssetsArgs = {
  endingSoon?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Array<InputMaybe<AssetFilter>>>;
  forSale?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<AssetSort>;
  traitFilter?: InputMaybe<Array<InputMaybe<TraitFilter>>>;
};


export type QueryCollectionsArgs = {
  filter?: InputMaybe<Array<InputMaybe<CollectionFilter>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<CollectionSort>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stats = {
  __typename?: 'Stats';
  average_price?: Maybe<Scalars['String']>;
  floor_price?: Maybe<Scalars['String']>;
  one_day_average_price?: Maybe<Scalars['String']>;
  one_day_sales?: Maybe<Scalars['Int']>;
  one_day_volume?: Maybe<Scalars['String']>;
  seven_day_average_price?: Maybe<Scalars['String']>;
  seven_day_sales?: Maybe<Scalars['Int']>;
  seven_day_volume?: Maybe<Scalars['String']>;
  thirty_day_average_price?: Maybe<Scalars['String']>;
  thirty_day_sales?: Maybe<Scalars['Int']>;
  thirty_day_volume?: Maybe<Scalars['String']>;
  total_sales?: Maybe<Scalars['Int']>;
  total_volume?: Maybe<Scalars['String']>;
};

export type Trait = {
  __typename?: 'Trait';
  collection_slug?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  display_type?: Maybe<Scalars['String']>;
  max_value?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type TraitFilter = {
  trait_type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  block_hash?: Maybe<Scalars['String']>;
  block_number: Scalars['Int'];
  date_ingested: Scalars['String'];
  from_account_address: Scalars['String'];
  id: Scalars['ID'];
  timestamp?: Maybe<Scalars['String']>;
  to_account_address: Scalars['String'];
  transaction_hash: Scalars['String'];
  transaction_index: Scalars['Int'];
};

export type AssetQueryVariables = Exact<{
  filter?: InputMaybe<Array<InputMaybe<AssetFilter>> | InputMaybe<AssetFilter>>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AssetQuery = { __typename?: 'Query', assets: Array<{ __typename?: 'Asset', name?: string | null, image_url?: string | null, animation_original_url?: string | null, animation_url?: string | null, permalink: string, token_id: string, contract?: { __typename?: 'Contract', schema_name?: string | null, address: string } | null, owners?: Array<{ __typename?: 'Account', address: string, profile_img_url: string } | null> | null, creator?: { __typename?: 'Account', address: string, profile_img_url: string } | null, collection: { __typename?: 'Collection', name: string, slug: string, description?: string | null, image_url?: string | null, discord_url?: string | null, telegram_url?: string | null, twitter_username?: string | null, instagram_username?: string | null, wiki_url?: string | null, external_url?: string | null }, traits?: Array<{ __typename?: 'Trait', value?: string | null, trait_type?: string | null, max_value?: string | null } | null> | null }> };

export type AssetsQueryVariables = Exact<{
  filter?: InputMaybe<Array<InputMaybe<AssetFilter>> | InputMaybe<AssetFilter>>;
  traitFilter?: InputMaybe<Array<InputMaybe<TraitFilter>> | InputMaybe<TraitFilter>>;
  sort?: InputMaybe<AssetSort>;
  forSale?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AssetsQuery = { __typename?: 'Query', assets: Array<{ __typename?: 'Asset', name?: string | null, token_id: string, image_url?: string | null, permalink: string, contract?: { __typename?: 'Contract', address: string } | null, owners?: Array<{ __typename?: 'Account', address: string } | null> | null, listing?: Array<{ __typename?: 'Event', payment_token_symbol: string, total_price?: string | null } | null> | null, collection: { __typename?: 'Collection', name: string, image_url?: string | null } }> };

export type CollectionsQueryVariables = Exact<{
  filter?: InputMaybe<Array<InputMaybe<CollectionFilter>> | InputMaybe<CollectionFilter>>;
}>;


export type CollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', chat_url?: string | null, discord_url?: string | null, external_url?: string | null, instagram_username?: string | null, image_url?: string | null, banner_image_url?: string | null, short_description?: string | null, description?: string | null, created_date: string, name: string, total_supply?: number | null, stats?: { __typename?: 'Stats', floor_price?: string | null, total_volume?: string | null } | null, traits?: Array<{ __typename?: 'CollectionTrait', count?: number | null, value?: string | null, trait_type?: string | null } | null> | null }> };

export type OwnerQueryVariables = Exact<{
  filter?: InputMaybe<Array<InputMaybe<AssetFilter>> | InputMaybe<AssetFilter>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type OwnerQuery = { __typename?: 'Query', assets: Array<{ __typename?: 'Asset', name?: string | null, image_url?: string | null, animation_original_url?: string | null, token_id: string, permalink: string, collection: { __typename?: 'Collection', name: string, slug: string, image_url?: string | null }, contract?: { __typename?: 'Contract', address: string } | null, last_sale?: { __typename?: 'Event', payment_token_symbol: string, total_price?: string | null } | null }> };

import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": null,
    "subscriptionType": null,
    "types": [
      {
        "kind": "OBJECT",
        "name": "Account",
        "fields": [
          {
            "name": "address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "config",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "profile_img_url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "username",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Asset",
        "fields": [
          {
            "name": "animation_original_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "animation_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "asset_bundle_slug",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "background_color",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "collection",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Collection",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "contract",
            "type": {
              "kind": "OBJECT",
              "name": "Contract",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "creator",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "decimals",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "external_link",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "image_original_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "image_preview_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "image_thumbnail_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "image_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "is_nsfw",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "is_presale",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "last_sale",
            "type": {
              "kind": "OBJECT",
              "name": "Event",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "listing",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Event",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "num_sales",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "offers",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Event",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "owners",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Account",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "permalink",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "supports_wyvern",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "token_id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "token_metadata",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "traits",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Trait",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "transfer_fee",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "transfer_fee_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "transfer_fee_symbol",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Collection",
        "fields": [
          {
            "name": "banner_image_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "buyer_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "chat_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "created_date",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "default_to_fiat",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "dev_buyer_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "dev_seller_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "discord_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "external_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "featured",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "featured_image_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "hidden",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "image_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "instagram_username",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "is_subject_to_whitelist",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "large_image_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "medium_username",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "num_owners",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "only_proxied_transfers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "opensea_buyer_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "opensea_seller_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "payment_tokens",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "PaymentToken",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "payout_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "primary_asset_contracts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Contract",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "require_email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "safelist_request_status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "seller_fee_basis_points",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "short_description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "slug",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "stats",
            "type": {
              "kind": "OBJECT",
              "name": "Stats",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "telegram_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "total_supply",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "traits",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "CollectionTrait",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "twitter_username",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "wiki_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "CollectionTrait",
        "fields": [
          {
            "name": "count",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "trait_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Contract",
        "fields": [
          {
            "name": "address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "asset_contract_type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "created_date",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "nft_version",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "opensea_version",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "owner",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "schema_name",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "symbol",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "total_supply",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Event",
        "fields": [
          {
            "name": "asset_bundle_slug",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "asset_id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "auction_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "bid_amount",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "collection_slug",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "contract_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "created_date",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "custom_event_name",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "duration",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "ending_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "ending_time",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "event_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "from_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "is_private",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "listing_time",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "owner_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "payment_token_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "payment_token_symbol",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "quantity",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "seller_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "starting_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "to_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "total_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "transaction_id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "winner_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "PaymentToken",
        "fields": [
          {
            "name": "address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_updated",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "decimals",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "eth_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "image_url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "symbol",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "usd_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "assets",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Asset",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "endingSoon",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "forSale",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sort",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "traitFilter",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "collections",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Collection",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "filter",
                "type": {
                  "kind": "LIST",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "offset",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sort",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Stats",
        "fields": [
          {
            "name": "average_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "floor_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "one_day_average_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "one_day_sales",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "one_day_volume",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "seven_day_average_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "seven_day_sales",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "seven_day_volume",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "thirty_day_average_price",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "thirty_day_sales",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "thirty_day_volume",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "total_sales",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "total_volume",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Trait",
        "fields": [
          {
            "name": "collection_slug",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "display_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "max_value",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "order",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "token_id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "trait_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Transaction",
        "fields": [
          {
            "name": "block_hash",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "block_number",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "date_ingested",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "from_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "timestamp",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "to_account_address",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "transaction_hash",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "transaction_index",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;

export const AssetDocument = gql`
    query Asset($filter: [AssetFilter], $limit: Int) {
  assets(filter: $filter, limit: $limit) {
    name
    image_url
    contract {
      schema_name
    }
    owners {
      address
      profile_img_url
    }
    creator {
      address
      profile_img_url
    }
    animation_original_url
    collection {
      name
      slug
      description
      image_url
      discord_url
      telegram_url
      twitter_username
      instagram_username
      wiki_url
      external_url
    }
    animation_url
    contract {
      address
    }
    permalink
    token_id
    traits {
      value
      trait_type
      max_value
    }
  }
}
    `;

export function useAssetQuery(options?: Omit<Urql.UseQueryArgs<AssetQueryVariables>, 'query'>) {
  return Urql.useQuery<AssetQuery>({ query: AssetDocument, ...options });
};
export const AssetsDocument = gql`
    query Assets($filter: [AssetFilter], $traitFilter: [TraitFilter], $sort: AssetSort, $forSale: Boolean, $limit: Int, $offset: Int) {
  assets(
    filter: $filter
    traitFilter: $traitFilter
    sort: $sort
    forSale: $forSale
    limit: $limit
    offset: $offset
  ) {
    name
    token_id
    contract {
      address
    }
    image_url
    permalink
    owners {
      address
    }
    listing {
      payment_token_symbol
      total_price
    }
    collection {
      name
      image_url
    }
  }
}
    `;

export function useAssetsQuery(options?: Omit<Urql.UseQueryArgs<AssetsQueryVariables>, 'query'>) {
  return Urql.useQuery<AssetsQuery>({ query: AssetsDocument, ...options });
};
export const CollectionsDocument = gql`
    query Collections($filter: [CollectionFilter]) {
  collections(filter: $filter) {
    chat_url
    discord_url
    external_url
    instagram_username
    image_url
    banner_image_url
    short_description
    description
    created_date
    name
    total_supply
    stats {
      floor_price
      total_volume
    }
    traits {
      count
      value
      trait_type
    }
  }
}
    `;

export function useCollectionsQuery(options?: Omit<Urql.UseQueryArgs<CollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionsQuery>({ query: CollectionsDocument, ...options });
};
export const OwnerDocument = gql`
    query Owner($filter: [AssetFilter], $limit: Int, $offset: Int) {
  assets(filter: $filter, limit: $limit, offset: $offset) {
    name
    image_url
    animation_original_url
    collection {
      name
      slug
      image_url
    }
    contract {
      address
    }
    last_sale {
      payment_token_symbol
      total_price
    }
    token_id
    permalink
  }
}
    `;

export function useOwnerQuery(options?: Omit<Urql.UseQueryArgs<OwnerQueryVariables>, 'query'>) {
  return Urql.useQuery<OwnerQuery>({ query: OwnerDocument, ...options });
};