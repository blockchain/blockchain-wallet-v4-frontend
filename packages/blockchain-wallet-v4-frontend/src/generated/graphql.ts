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
  address?: Maybe<Scalars['ID']>;
  config?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  profile_img_url?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type AccountFilter = {
  address?: InputMaybe<Scalars['String']>;
  config?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  profile_img_url?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type AccountOrderBy = {
  direction: OrderDirection;
  field: AccountProperties;
};

export enum AccountProperties {
  Address = 'address',
  Config = 'config',
  DateIngested = 'date_ingested',
  ProfileImgUrl = 'profile_img_url',
  Username = 'username'
}

export type Asset = {
  __typename?: 'Asset';
  animation_original_url?: Maybe<Scalars['String']>;
  animation_url?: Maybe<Scalars['String']>;
  asset_bundle_slug?: Maybe<Scalars['String']>;
  asset_contract?: Maybe<Contract>;
  background_color?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  collection_slug?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  creator?: Maybe<Account>;
  creator_address?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<Event>>>;
  external_link?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  image_original_url?: Maybe<Scalars['String']>;
  image_preview_url?: Maybe<Scalars['String']>;
  image_thumbnail_url?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  is_presale?: Maybe<Scalars['Boolean']>;
  last_sale?: Maybe<Event>;
  listing_date?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  num_sales?: Maybe<Scalars['Int']>;
  owner?: Maybe<Account>;
  owner_address?: Maybe<Scalars['String']>;
  permalink?: Maybe<Scalars['String']>;
  supports_wyvern?: Maybe<Scalars['Boolean']>;
  token_id?: Maybe<Scalars['String']>;
  token_metadata?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Maybe<Trait>>>;
  transfer_fee?: Maybe<Scalars['String']>;
  transfer_fee_payment_token?: Maybe<PaymentToken>;
  transfer_fee_payment_token_id?: Maybe<Scalars['Int']>;
};


export type AssetAsset_ContractArgs = {
  filter?: InputMaybe<ContractFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractOrderBy>;
};


export type AssetCollectionArgs = {
  filter?: InputMaybe<CollectionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionOrderBy>;
};


export type AssetCreatorArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type AssetEventsArgs = {
  filter?: InputMaybe<EventFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EventOrderBy>;
};


export type AssetLast_SaleArgs = {
  filter?: InputMaybe<EventFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EventOrderBy>;
};


export type AssetOwnerArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type AssetTraitsArgs = {
  filter?: InputMaybe<TraitFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraitOrderBy>;
};


export type AssetTransfer_Fee_Payment_TokenArgs = {
  filter?: InputMaybe<PaymentTokenFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentTokenOrderBy>;
};

export type AssetFilter = {
  animation_original_url?: InputMaybe<Scalars['String']>;
  animation_url?: InputMaybe<Scalars['String']>;
  asset_bundle_slug?: InputMaybe<Scalars['String']>;
  background_color?: InputMaybe<Scalars['String']>;
  collection_slug?: InputMaybe<Scalars['String']>;
  contract_address?: InputMaybe<Scalars['String']>;
  creator_address?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  external_link?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  image_original_url?: InputMaybe<Scalars['String']>;
  image_preview_url?: InputMaybe<Scalars['String']>;
  image_thumbnail_url?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  is_presale?: InputMaybe<Scalars['String']>;
  listing_date?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  num_sales?: InputMaybe<Scalars['String']>;
  owner_address?: InputMaybe<Scalars['String']>;
  permalink?: InputMaybe<Scalars['String']>;
  supports_wyvern?: InputMaybe<Scalars['String']>;
  token_id?: InputMaybe<Scalars['String']>;
  token_metadata?: InputMaybe<Scalars['String']>;
  transfer_fee?: InputMaybe<Scalars['String']>;
  transfer_fee_payment_token_id?: InputMaybe<Scalars['String']>;
};

export type AssetOrderBy = {
  direction: OrderDirection;
  field: AssetProperties;
};

export enum AssetProperties {
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
  IsPresale = 'is_presale',
  ListingDate = 'listing_date',
  Name = 'name',
  NumSales = 'num_sales',
  OwnerAddress = 'owner_address',
  Permalink = 'permalink',
  SupportsWyvern = 'supports_wyvern',
  TokenId = 'token_id',
  TokenMetadata = 'token_metadata',
  TransferFee = 'transfer_fee',
  TransferFeePaymentTokenId = 'transfer_fee_payment_token_id'
}

export type Bundle = {
  __typename?: 'Bundle';
  asset_contract?: Maybe<Contract>;
  assets?: Maybe<Array<Maybe<Asset>>>;
  contract_address?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  external_link?: Maybe<Scalars['String']>;
  maker?: Maybe<Account>;
  maker_address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  permalink?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['ID']>;
};


export type BundleAsset_ContractArgs = {
  filter?: InputMaybe<ContractFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractOrderBy>;
};


export type BundleAssetsArgs = {
  filter?: InputMaybe<AssetFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssetOrderBy>;
};


export type BundleMakerArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};

export type BundleFilter = {
  contract_address?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  external_link?: InputMaybe<Scalars['String']>;
  maker_address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permalink?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type BundleOrderBy = {
  direction: OrderDirection;
  field: BundleProperties;
};

export enum BundleProperties {
  ContractAddress = 'contract_address',
  DateIngested = 'date_ingested',
  Description = 'description',
  ExternalLink = 'external_link',
  MakerAddress = 'maker_address',
  Name = 'name',
  Permalink = 'permalink',
  Slug = 'slug'
}

export type Collection = {
  __typename?: 'Collection';
  assets?: Maybe<Array<Maybe<Asset>>>;
  banner_image_url?: Maybe<Scalars['String']>;
  buyer_fee_basis_points?: Maybe<Scalars['String']>;
  chat_url?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  default_to_fiat?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  dev_buyer_fee_basis_points?: Maybe<Scalars['String']>;
  dev_seller_fee_basis_points?: Maybe<Scalars['String']>;
  discord_url?: Maybe<Scalars['String']>;
  editors?: Maybe<Scalars['String']>;
  external_url?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  featured_image_url?: Maybe<Scalars['String']>;
  hidden?: Maybe<Scalars['Boolean']>;
  image_url?: Maybe<Scalars['String']>;
  instagram_username?: Maybe<Scalars['String']>;
  is_subject_to_whitelist?: Maybe<Scalars['Boolean']>;
  large_image_url?: Maybe<Scalars['String']>;
  medium_username?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  only_proxied_transfers?: Maybe<Scalars['Boolean']>;
  opensea_buyer_fee_basis_points?: Maybe<Scalars['String']>;
  opensea_seller_fee_basis_points?: Maybe<Scalars['String']>;
  payment_tokens?: Maybe<Array<Maybe<PaymentToken>>>;
  payout_address?: Maybe<Scalars['String']>;
  primary_asset_contracts?: Maybe<Array<Maybe<Contract>>>;
  require_email?: Maybe<Scalars['Boolean']>;
  safelist_request_status?: Maybe<Scalars['String']>;
  seller_fee_basis_points?: Maybe<Scalars['String']>;
  short_description?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['ID']>;
  telegram_url?: Maybe<Scalars['String']>;
  twitter_username?: Maybe<Scalars['String']>;
  wiki_url?: Maybe<Scalars['String']>;
};


export type CollectionAssetsArgs = {
  filter?: InputMaybe<AssetFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssetOrderBy>;
};


export type CollectionPayment_TokensArgs = {
  filter?: InputMaybe<PaymentTokenFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentTokenOrderBy>;
};


export type CollectionPrimary_Asset_ContractsArgs = {
  filter?: InputMaybe<ContractFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractOrderBy>;
};

export type CollectionFilter = {
  banner_image_url?: InputMaybe<Scalars['String']>;
  buyer_fee_basis_points?: InputMaybe<Scalars['String']>;
  chat_url?: InputMaybe<Scalars['String']>;
  created_date?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  default_to_fiat?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  dev_buyer_fee_basis_points?: InputMaybe<Scalars['String']>;
  dev_seller_fee_basis_points?: InputMaybe<Scalars['String']>;
  discord_url?: InputMaybe<Scalars['String']>;
  display_data?: InputMaybe<Scalars['String']>;
  editors?: InputMaybe<Scalars['String']>;
  external_url?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['String']>;
  featured_image_url?: InputMaybe<Scalars['String']>;
  hidden?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  instagram_username?: InputMaybe<Scalars['String']>;
  is_subject_to_whitelist?: InputMaybe<Scalars['String']>;
  large_image_url?: InputMaybe<Scalars['String']>;
  medium_username?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  only_proxied_transfers?: InputMaybe<Scalars['String']>;
  opensea_buyer_fee_basis_points?: InputMaybe<Scalars['String']>;
  opensea_seller_fee_basis_points?: InputMaybe<Scalars['String']>;
  payout_address?: InputMaybe<Scalars['String']>;
  require_email?: InputMaybe<Scalars['String']>;
  safelist_request_status?: InputMaybe<Scalars['String']>;
  seller_fee_basis_points?: InputMaybe<Scalars['String']>;
  short_description?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  telegram_url?: InputMaybe<Scalars['String']>;
  twitter_username?: InputMaybe<Scalars['String']>;
  wiki_url?: InputMaybe<Scalars['String']>;
};

export type CollectionOrderBy = {
  direction: OrderDirection;
  field: CollectionProperties;
};

export enum CollectionProperties {
  BannerImageUrl = 'banner_image_url',
  BuyerFeeBasisPoints = 'buyer_fee_basis_points',
  ChatUrl = 'chat_url',
  CreatedDate = 'created_date',
  DateIngested = 'date_ingested',
  DefaultToFiat = 'default_to_fiat',
  Description = 'description',
  DevBuyerFeeBasisPoints = 'dev_buyer_fee_basis_points',
  DevSellerFeeBasisPoints = 'dev_seller_fee_basis_points',
  DiscordUrl = 'discord_url',
  DisplayData = 'display_data',
  Editors = 'editors',
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
  TwitterUsername = 'twitter_username',
  WikiUrl = 'wiki_url'
}

export type Contract = {
  __typename?: 'Contract';
  address?: Maybe<Scalars['ID']>;
  asset_contract_type?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  created_date?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  nft_version?: Maybe<Scalars['String']>;
  opensea_version?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['Int']>;
  schema_name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  total_supply?: Maybe<Scalars['String']>;
};


export type ContractCollectionArgs = {
  filter?: InputMaybe<CollectionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionOrderBy>;
};

export type ContractFilter = {
  address?: InputMaybe<Scalars['String']>;
  asset_contract_type?: InputMaybe<Scalars['String']>;
  created_date?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  nft_version?: InputMaybe<Scalars['String']>;
  opensea_version?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  total_supply?: InputMaybe<Scalars['String']>;
};

export type ContractOrderBy = {
  direction: OrderDirection;
  field: ContractProperties;
};

export enum ContractProperties {
  Address = 'address',
  AssetContractType = 'asset_contract_type',
  CreatedDate = 'created_date',
  DateIngested = 'date_ingested',
  NftVersion = 'nft_version',
  OpenseaVersion = 'opensea_version',
  Owner = 'owner',
  SchemaName = 'schema_name',
  Symbol = 'symbol',
  TotalSupply = 'total_supply'
}

export type Event = {
  __typename?: 'Event';
  asset?: Maybe<Asset>;
  asset_bundle?: Maybe<Bundle>;
  asset_bundle_slug?: Maybe<Scalars['String']>;
  asset_id?: Maybe<Scalars['Int']>;
  auction_type?: Maybe<Scalars['String']>;
  bid_amount?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  collection_slug?: Maybe<Scalars['String']>;
  contract?: Maybe<Contract>;
  contract_address?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['String']>;
  custom_event_name?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  ending_price?: Maybe<Scalars['String']>;
  event_type?: Maybe<Scalars['String']>;
  from_account?: Maybe<Account>;
  from_account_address?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  is_private?: Maybe<Scalars['Boolean']>;
  listing_time?: Maybe<Scalars['String']>;
  owner_account?: Maybe<Account>;
  owner_account_address?: Maybe<Scalars['String']>;
  payment_token?: Maybe<PaymentToken>;
  payment_token_id?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  seller?: Maybe<Account>;
  seller_account_address?: Maybe<Scalars['String']>;
  starting_price?: Maybe<Scalars['String']>;
  to_account?: Maybe<Account>;
  to_account_address?: Maybe<Scalars['String']>;
  total_price?: Maybe<Scalars['String']>;
  tx?: Maybe<Transaction>;
  winner_account?: Maybe<Account>;
  winner_account_address?: Maybe<Scalars['String']>;
};


export type EventAssetArgs = {
  filter?: InputMaybe<AssetFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssetOrderBy>;
};


export type EventAsset_BundleArgs = {
  filter?: InputMaybe<BundleFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BundleOrderBy>;
};


export type EventCollectionArgs = {
  filter?: InputMaybe<CollectionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionOrderBy>;
};


export type EventContractArgs = {
  filter?: InputMaybe<ContractFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractOrderBy>;
};


export type EventFrom_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type EventOwner_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type EventPayment_TokenArgs = {
  filter?: InputMaybe<PaymentTokenFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentTokenOrderBy>;
};


export type EventSellerArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type EventTo_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type EventTxArgs = {
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
};


export type EventWinner_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};

export type EventFilter = {
  asset_bundle_slug?: InputMaybe<Scalars['String']>;
  asset_id?: InputMaybe<Scalars['String']>;
  auction_type?: InputMaybe<Scalars['String']>;
  bid_amount?: InputMaybe<Scalars['String']>;
  collection_slug?: InputMaybe<Scalars['String']>;
  contract_address?: InputMaybe<Scalars['String']>;
  created_date?: InputMaybe<Scalars['String']>;
  custom_event_name?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  ending_price?: InputMaybe<Scalars['String']>;
  event_type?: InputMaybe<Scalars['String']>;
  from_account_address?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  is_private?: InputMaybe<Scalars['String']>;
  listing_time?: InputMaybe<Scalars['String']>;
  owner_account_address?: InputMaybe<Scalars['String']>;
  payment_token_id?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['String']>;
  seller_account_address?: InputMaybe<Scalars['String']>;
  starting_price?: InputMaybe<Scalars['String']>;
  to_account_address?: InputMaybe<Scalars['String']>;
  total_price?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
  winner_account_address?: InputMaybe<Scalars['String']>;
};

export type EventOrderBy = {
  direction: OrderDirection;
  field: EventProperties;
};

export enum EventProperties {
  AssetBundleSlug = 'asset_bundle_slug',
  AssetId = 'asset_id',
  AuctionType = 'auction_type',
  BidAmount = 'bid_amount',
  CollectionSlug = 'collection_slug',
  ContractAddress = 'contract_address',
  CreatedDate = 'created_date',
  CustomEventName = 'custom_event_name',
  DateIngested = 'date_ingested',
  Duration = 'duration',
  EndingPrice = 'ending_price',
  EventType = 'event_type',
  FromAccountAddress = 'from_account_address',
  Id = 'id',
  IsPrivate = 'is_private',
  ListingTime = 'listing_time',
  OwnerAccountAddress = 'owner_account_address',
  PaymentTokenId = 'payment_token_id',
  Quantity = 'quantity',
  SellerAccountAddress = 'seller_account_address',
  StartingPrice = 'starting_price',
  ToAccountAddress = 'to_account_address',
  TotalPrice = 'total_price',
  TransactionId = 'transaction_id',
  WinnerAccountAddress = 'winner_account_address'
}

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaymentToken = {
  __typename?: 'PaymentToken';
  address?: Maybe<Scalars['String']>;
  date_ingested?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['Int']>;
  eth_price?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  image_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  usd_price?: Maybe<Scalars['String']>;
};

export type PaymentTokenFilter = {
  address?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  date_updated?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['String']>;
  eth_price?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  usd_price?: InputMaybe<Scalars['String']>;
};

export type PaymentTokenOrderBy = {
  direction: OrderDirection;
  field: PaymentTokenProperties;
};

export enum PaymentTokenProperties {
  Address = 'address',
  DateIngested = 'date_ingested',
  DateUpdated = 'date_updated',
  Decimals = 'decimals',
  EthPrice = 'eth_price',
  Id = 'id',
  ImageUrl = 'image_url',
  Name = 'name',
  Symbol = 'symbol',
  UsdPrice = 'usd_price'
}

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts?: Maybe<Array<Maybe<Account>>>;
  asset?: Maybe<Asset>;
  assets?: Maybe<Array<Maybe<Asset>>>;
  bundle?: Maybe<Bundle>;
  bundles?: Maybe<Array<Maybe<Bundle>>>;
  collection?: Maybe<Collection>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  contract?: Maybe<Contract>;
  contracts?: Maybe<Array<Maybe<Contract>>>;
  event?: Maybe<Event>;
  events?: Maybe<Array<Maybe<Event>>>;
  paymentToken?: Maybe<PaymentToken>;
  paymentTokens?: Maybe<Array<Maybe<PaymentToken>>>;
  trait?: Maybe<Trait>;
  traits?: Maybe<Array<Maybe<Trait>>>;
  transaction?: Maybe<Transaction>;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
};


export type QueryAccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type QueryAccountsArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type QueryAssetArgs = {
  asset_contractFilter?: InputMaybe<ContractFilter>;
  collectionFilter?: InputMaybe<CollectionFilter>;
  creatorFilter?: InputMaybe<AccountFilter>;
  eventsFilter?: InputMaybe<EventFilter>;
  filter?: InputMaybe<AssetFilter>;
  last_saleFilter?: InputMaybe<EventFilter>;
  orderBy?: InputMaybe<AssetOrderBy>;
  ownerFilter?: InputMaybe<AccountFilter>;
  traitsFilter?: InputMaybe<TraitFilter>;
  transfer_fee_payment_tokenFilter?: InputMaybe<PaymentTokenFilter>;
};


export type QueryAssetsArgs = {
  asset_contractFilter?: InputMaybe<ContractFilter>;
  collectionFilter?: InputMaybe<CollectionFilter>;
  creatorFilter?: InputMaybe<AccountFilter>;
  eventsFilter?: InputMaybe<EventFilter>;
  filter?: InputMaybe<AssetFilter>;
  last_saleFilter?: InputMaybe<EventFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssetOrderBy>;
  ownerFilter?: InputMaybe<AccountFilter>;
  traitsFilter?: InputMaybe<TraitFilter>;
  transfer_fee_payment_tokenFilter?: InputMaybe<PaymentTokenFilter>;
};


export type QueryBundleArgs = {
  asset_contractFilter?: InputMaybe<ContractFilter>;
  assetsFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<BundleFilter>;
  makerFilter?: InputMaybe<AccountFilter>;
  orderBy?: InputMaybe<BundleOrderBy>;
};


export type QueryBundlesArgs = {
  asset_contractFilter?: InputMaybe<ContractFilter>;
  assetsFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<BundleFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  makerFilter?: InputMaybe<AccountFilter>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BundleOrderBy>;
};


export type QueryCollectionArgs = {
  assetsFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<CollectionFilter>;
  orderBy?: InputMaybe<CollectionOrderBy>;
  payment_tokensFilter?: InputMaybe<PaymentTokenFilter>;
  primary_asset_contractsFilter?: InputMaybe<ContractFilter>;
};


export type QueryCollectionsArgs = {
  assetsFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<CollectionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionOrderBy>;
  payment_tokensFilter?: InputMaybe<PaymentTokenFilter>;
  primary_asset_contractsFilter?: InputMaybe<ContractFilter>;
};


export type QueryContractArgs = {
  collectionFilter?: InputMaybe<CollectionFilter>;
  filter?: InputMaybe<ContractFilter>;
  orderBy?: InputMaybe<ContractOrderBy>;
};


export type QueryContractsArgs = {
  collectionFilter?: InputMaybe<CollectionFilter>;
  filter?: InputMaybe<ContractFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractOrderBy>;
};


export type QueryEventArgs = {
  assetFilter?: InputMaybe<AssetFilter>;
  asset_bundleFilter?: InputMaybe<BundleFilter>;
  collectionFilter?: InputMaybe<CollectionFilter>;
  contractFilter?: InputMaybe<ContractFilter>;
  filter?: InputMaybe<EventFilter>;
  from_accountFilter?: InputMaybe<AccountFilter>;
  orderBy?: InputMaybe<EventOrderBy>;
  owner_accountFilter?: InputMaybe<AccountFilter>;
  payment_tokenFilter?: InputMaybe<PaymentTokenFilter>;
  sellerFilter?: InputMaybe<AccountFilter>;
  to_accountFilter?: InputMaybe<AccountFilter>;
  txFilter?: InputMaybe<TransactionFilter>;
  winner_accountFilter?: InputMaybe<AccountFilter>;
};


export type QueryEventsArgs = {
  assetFilter?: InputMaybe<AssetFilter>;
  asset_bundleFilter?: InputMaybe<BundleFilter>;
  collectionFilter?: InputMaybe<CollectionFilter>;
  contractFilter?: InputMaybe<ContractFilter>;
  filter?: InputMaybe<EventFilter>;
  from_accountFilter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<EventOrderBy>;
  owner_accountFilter?: InputMaybe<AccountFilter>;
  payment_tokenFilter?: InputMaybe<PaymentTokenFilter>;
  sellerFilter?: InputMaybe<AccountFilter>;
  to_accountFilter?: InputMaybe<AccountFilter>;
  txFilter?: InputMaybe<TransactionFilter>;
  winner_accountFilter?: InputMaybe<AccountFilter>;
};


export type QueryPaymentTokenArgs = {
  filter?: InputMaybe<PaymentTokenFilter>;
  orderBy?: InputMaybe<PaymentTokenOrderBy>;
};


export type QueryPaymentTokensArgs = {
  filter?: InputMaybe<PaymentTokenFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentTokenOrderBy>;
};


export type QueryTraitArgs = {
  assetFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<TraitFilter>;
  orderBy?: InputMaybe<TraitOrderBy>;
};


export type QueryTraitsArgs = {
  assetFilter?: InputMaybe<AssetFilter>;
  filter?: InputMaybe<TraitFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraitOrderBy>;
};


export type QueryTransactionArgs = {
  filter?: InputMaybe<TransactionFilter>;
  from_accountFilter?: InputMaybe<AccountFilter>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  to_accountFilter?: InputMaybe<AccountFilter>;
};


export type QueryTransactionsArgs = {
  filter?: InputMaybe<TransactionFilter>;
  from_accountFilter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  to_accountFilter?: InputMaybe<AccountFilter>;
};

export type Trait = {
  __typename?: 'Trait';
  asset?: Maybe<Asset>;
  contract_address?: Maybe<Scalars['ID']>;
  date_ingested?: Maybe<Scalars['String']>;
  display_type?: Maybe<Scalars['String']>;
  max_value?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type TraitAssetArgs = {
  filter?: InputMaybe<AssetFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AssetOrderBy>;
};

export type TraitFilter = {
  contract_address?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  display_type?: InputMaybe<Scalars['String']>;
  max_value?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['String']>;
  token_id?: InputMaybe<Scalars['String']>;
  trait_type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type TraitOrderBy = {
  direction: OrderDirection;
  field: TraitProperties;
};

export enum TraitProperties {
  ContractAddress = 'contract_address',
  DateIngested = 'date_ingested',
  DisplayType = 'display_type',
  MaxValue = 'max_value',
  Order = 'order',
  TokenId = 'token_id',
  TraitType = 'trait_type',
  Value = 'value'
}

export type Transaction = {
  __typename?: 'Transaction';
  block_hash?: Maybe<Scalars['String']>;
  block_number?: Maybe<Scalars['Int']>;
  date_ingested?: Maybe<Scalars['String']>;
  from_account?: Maybe<Account>;
  from_account_address?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  timestamp?: Maybe<Scalars['String']>;
  to_account?: Maybe<Account>;
  to_account_address?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  transaction_index?: Maybe<Scalars['Int']>;
};


export type TransactionFrom_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};


export type TransactionTo_AccountArgs = {
  filter?: InputMaybe<AccountFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AccountOrderBy>;
};

export type TransactionFilter = {
  block_hash?: InputMaybe<Scalars['String']>;
  block_number?: InputMaybe<Scalars['String']>;
  date_ingested?: InputMaybe<Scalars['String']>;
  from_account_address?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['String']>;
  to_account_address?: InputMaybe<Scalars['String']>;
  transaction_hash?: InputMaybe<Scalars['String']>;
  transaction_index?: InputMaybe<Scalars['String']>;
};

export type TransactionOrderBy = {
  direction: OrderDirection;
  field: TransactionProperties;
};

export enum TransactionProperties {
  BlockHash = 'block_hash',
  BlockNumber = 'block_number',
  DateIngested = 'date_ingested',
  FromAccountAddress = 'from_account_address',
  Id = 'id',
  Timestamp = 'timestamp',
  ToAccountAddress = 'to_account_address',
  TransactionHash = 'transaction_hash',
  TransactionIndex = 'transaction_index'
}

export type AssetQueryVariables = Exact<{
  filter?: InputMaybe<AssetFilter>;
}>;


export type AssetQuery = { __typename?: 'Query', asset?: { __typename?: 'Asset', name?: string | null, image_url?: string | null, animation_original_url?: string | null, animation_url?: string | null, contract_address?: string | null, permalink?: string | null, token_id?: string | null, owner?: { __typename?: 'Account', address?: string | null, profile_img_url?: string | null } | null, creator?: { __typename?: 'Account', address?: string | null, profile_img_url?: string | null } | null, collection?: { __typename?: 'Collection', name?: string | null, description?: string | null, image_url?: string | null } | null, traits?: Array<{ __typename?: 'Trait', value?: string | null, trait_type?: string | null, max_value?: string | null } | null> | null } | null };

export type AssetsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<AssetFilter>;
  eventsFilter?: InputMaybe<EventFilter>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AssetsQuery = { __typename?: 'Query', assets?: Array<{ __typename?: 'Asset', name?: string | null, token_id?: string | null, contract_address?: string | null, image_url?: string | null, permalink?: string | null, owner_address?: string | null, collection?: { __typename?: 'Collection', name?: string | null } | null, events?: Array<{ __typename?: 'Event', id?: string | null, contract_address?: string | null, event_type?: string | null, starting_price?: string | null, payment_token?: { __typename?: 'PaymentToken', symbol?: string | null } | null } | null> | null } | null> | null };

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
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "config",
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
            "name": "profile_img_url",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "asset_contract",
            "type": {
              "kind": "OBJECT",
              "name": "Contract",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
              "kind": "OBJECT",
              "name": "Collection",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
              "kind": "SCALAR",
              "name": "Any"
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
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "creator_address",
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
            "name": "events",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Event",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "is_presale",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "listing_date",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "owner",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "owner_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "permalink",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "supports_wyvern",
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
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
            "name": "transfer_fee_payment_token",
            "type": {
              "kind": "OBJECT",
              "name": "PaymentToken",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "transfer_fee_payment_token_id",
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
        "name": "Bundle",
        "fields": [
          {
            "name": "asset_contract",
            "type": {
              "kind": "OBJECT",
              "name": "Contract",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "assets",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Asset",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "contract_address",
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
            "name": "maker",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "maker_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "permalink",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "slug",
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
        "name": "Collection",
        "fields": [
          {
            "name": "assets",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Asset",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
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
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "default_to_fiat",
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
            "name": "dev_buyer_fee_basis_points",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "dev_seller_fee_basis_points",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "editors",
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
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "only_proxied_transfers",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "opensea_buyer_fee_basis_points",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "opensea_seller_fee_basis_points",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "require_email",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "safelist_request_status",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "seller_fee_basis_points",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
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
        "name": "Contract",
        "fields": [
          {
            "name": "address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "asset_contract_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "collection",
            "type": {
              "kind": "OBJECT",
              "name": "Collection",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "created_date",
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
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Event",
        "fields": [
          {
            "name": "asset",
            "type": {
              "kind": "OBJECT",
              "name": "Asset",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "asset_bundle",
            "type": {
              "kind": "OBJECT",
              "name": "Bundle",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "asset_bundle_slug",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "asset_id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "collection",
            "type": {
              "kind": "OBJECT",
              "name": "Collection",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
            "name": "contract",
            "type": {
              "kind": "OBJECT",
              "name": "Contract",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "contract_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "created_date",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "event_type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "from_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "from_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "is_private",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "owner_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "owner_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "payment_token",
            "type": {
              "kind": "OBJECT",
              "name": "PaymentToken",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "payment_token_id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "quantity",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "seller",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "seller_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "to_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "to_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "tx",
            "type": {
              "kind": "OBJECT",
              "name": "Transaction",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "winner_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "winner_account_address",
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
        "name": "PaymentToken",
        "fields": [
          {
            "name": "address",
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
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "id",
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
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "accounts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Account",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "asset",
            "type": {
              "kind": "OBJECT",
              "name": "Asset",
              "ofType": null
            },
            "args": [
              {
                "name": "asset_contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "creatorFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "eventsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "last_saleFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "ownerFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "traitsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "transfer_fee_payment_tokenFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "assets",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Asset",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "asset_contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "creatorFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "eventsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "last_saleFilter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "ownerFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "traitsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "transfer_fee_payment_tokenFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "bundle",
            "type": {
              "kind": "OBJECT",
              "name": "Bundle",
              "ofType": null
            },
            "args": [
              {
                "name": "asset_contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "assetsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "makerFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "bundles",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Bundle",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "asset_contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "assetsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
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
                "name": "makerFilter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "collection",
            "type": {
              "kind": "OBJECT",
              "name": "Collection",
              "ofType": null
            },
            "args": [
              {
                "name": "assetsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "payment_tokensFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "primary_asset_contractsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "collections",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Collection",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "assetsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "payment_tokensFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "primary_asset_contractsFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "contract",
            "type": {
              "kind": "OBJECT",
              "name": "Contract",
              "ofType": null
            },
            "args": [
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "contracts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Contract",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "event",
            "type": {
              "kind": "OBJECT",
              "name": "Event",
              "ofType": null
            },
            "args": [
              {
                "name": "assetFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "asset_bundleFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "from_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "owner_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "payment_tokenFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sellerFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "to_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "txFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "winner_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "events",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Event",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "assetFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "asset_bundleFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "collectionFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "contractFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "from_accountFilter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "owner_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "payment_tokenFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sellerFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "to_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "txFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "winner_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "paymentToken",
            "type": {
              "kind": "OBJECT",
              "name": "PaymentToken",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "paymentTokens",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "PaymentToken",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "trait",
            "type": {
              "kind": "OBJECT",
              "name": "Trait",
              "ofType": null
            },
            "args": [
              {
                "name": "assetFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
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
            "args": [
              {
                "name": "assetFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "transaction",
            "type": {
              "kind": "OBJECT",
              "name": "Transaction",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "from_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "to_accountFilter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "transactions",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Transaction",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "filter",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "from_accountFilter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "to_accountFilter",
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
        "name": "Trait",
        "fields": [
          {
            "name": "asset",
            "type": {
              "kind": "OBJECT",
              "name": "Asset",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "contract_address",
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
            "name": "from_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "from_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "to_account",
            "type": {
              "kind": "OBJECT",
              "name": "Account",
              "ofType": null
            },
            "args": [
              {
                "name": "filter",
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
                "name": "orderBy",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "to_account_address",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "transaction_hash",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "transaction_index",
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
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;

export const AssetDocument = gql`
    query Asset($filter: AssetFilter) {
  asset(filter: $filter) {
    name
    image_url
    owner {
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
      description
      image_url
    }
    animation_url
    contract_address
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
    query Assets($limit: Int, $filter: AssetFilter, $eventsFilter: EventFilter, $offset: Int) {
  assets(limit: $limit, filter: $filter, offset: $offset) {
    name
    token_id
    contract_address
    image_url
    permalink
    owner_address
    collection {
      name
    }
    events(filter: $eventsFilter) {
      id
      contract_address
      event_type
      starting_price
      payment_token {
        symbol
      }
    }
  }
}
    `;

export function useAssetsQuery(options?: Omit<Urql.UseQueryArgs<AssetsQueryVariables>, 'query'>) {
  return Urql.useQuery<AssetsQuery>({ query: AssetsDocument, ...options });
};