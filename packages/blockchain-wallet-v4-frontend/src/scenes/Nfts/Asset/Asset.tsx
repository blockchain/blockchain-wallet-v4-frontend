import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import { formatDistanceToNow } from 'date-fns'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { RawOrder } from '@core/network/api/nfts/types'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import { WalletOptionsType } from '@core/types'
import {
  Button,
  Icon as BlockchainIcon,
  Image,
  Link,
  SkeletonRectangle,
  SpinningLoader,
  TabMenu,
  TabMenuItem,
  Text,
  TextGroup
} from 'blockchain-info-components'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { AssetFilterFields, EventFilterFields, useAssetQuery } from 'generated/graphql.types'
import { useRemote } from 'hooks'

import NftAssetImageType from '../components/NftAssetImageType'
import NftCollectionImage from '../components/NftCollectionImage'
import NftError from '../components/NftError'
import NftRefreshIcon from '../components/NftRefreshIcon'
import Events from '../Events'
import Offers from '../Offers'
import {
  AssetName,
  CollectionName,
  CurrentPriceBox,
  CustomLink,
  Divider,
  EthText,
  Highest,
  LeftColWrapper,
  RightColWrapper,
  StickyWrapper,
  Top,
  Trait,
  TraitsWrapper,
  Wrapper
} from './components'
import AssetMoreItems from './components/AssetMoreItems'
import NftAssetCountdown from './components/NftAssetCountdown'
import NftAssetLoading from './components/NftAssetLoading'

const AssetImageContainer = styled.div`
  position: relative;
  border-radius: 8px;
  border-width: 1px;
  border: 1px solid ${(props) => props.theme.grey100};
  box-shadow: inset 0px 0px 10px 0px ${(props) => props.theme.grey000};
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  padding: 30px;
`

const CoinIcon = styled(BlockchainIcon).attrs({ className: 'coin-icon' })`
  margin-right: 8px;
  > img {
    height: 24px;
    width: 24px;
  }
`

const Socials = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
`

const SocialLink = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-right: 0;
  }
`

const ActivityWrapper = styled.div`
  max-height: 300px;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  overflow: auto;
`

const CustomTabMenu = styled(TabMenu)`
  color: ${colors.grey900};
  margin: 24px 0;
  background: ${colors.grey000};
`

const CreatorOwnerAddress = styled.div`
  font-size: 16px;
  color: ${colors.grey700};
  display: flex;
`

const CreatorOwnerAddressLinkText = styled(CreatorOwnerAddress)`
  color: ${colors.blue600};
  font-weight: 600;
`

const TokenDisplay = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  text-align: right;
`

const AdditionalDetailsWrapper = styled.div`
  border: 1px solid ${colors.grey000};
  border-radius: 8px;
  margin-top: 24px;
`

const Detail = styled(Text)`
  display: flex;
  justify-content: space-between;
  color: ${colors.grey900};
  padding: 1em 1.5em;
  border-bottom: 1px solid ${colors.grey000};
  font-size: 16px;
  font-weight: 500;
  &:last-child {
    border-bottom: none;
  }
`

const DetailsAndOffers = styled.div``

const NftAsset: React.FC<Props> = ({
  analyticsActions,
  defaultEthAddr,
  domains,
  formActions,
  nftsActions,
  routerActions,
  walletCurrency,
  ...rest
}) => {
  const { contract, id } = rest.computedMatch.params
  const [isRefreshRotating, setIsRefreshRotating] = useState<boolean>(false)
  // @ts-ignore
  const [assetQuery, reexecuteQuery] = useAssetQuery({
    requestPolicy: 'network-only',
    variables: {
      filter: [
        { field: AssetFilterFields.ContractAddress, value: contract },
        { field: AssetFilterFields.TokenId, value: id }
      ]
    }
  })

  const openSeaAsset = useRemote(selectors.components.nfts.getOpenSeaAsset)
  const [Tab, setTab] = useState('about')

  useEffect(() => {
    nftsActions.fetchOpenSeaAsset({
      asset_contract_address: contract,
      token_id: id
    })
  }, [contract, id, nftsActions])

  useEffect(() => {
    if (isRefreshRotating) {
      setTimeout(() => {
        setIsRefreshRotating(false)
      }, 500)
    }
  }, [isRefreshRotating])

  const currentAsset = assetQuery.data?.assets[0]
  const isOwner = currentAsset?.owners
    ? currentAsset.owners.find((owner) => {
        return owner?.address?.toLowerCase() === defaultEthAddr?.toLowerCase()
      })
    : null

  const owner = currentAsset?.owners ? currentAsset.owners[0] : null
  const collectionName = currentAsset?.collection?.name || ''

  let bids =
    openSeaAsset.data?.orders?.filter((x) => {
      return x.side === 0 && x.taker.address !== NULL_ADDRESS
    }, []) || []
  // Offers have taker as null address
  let offers =
    openSeaAsset.data?.orders?.filter((x) => {
      return x.side === 0 && x.taker.address === NULL_ADDRESS
    }, []) || []
  const sellOrders =
    openSeaAsset.data?.orders?.filter((x) => {
      return x.side === 1
    }) || []
  bids = bids.length
    ? bids.sort((a: any, b: any) => {
        return b.current_price - a.current_price
      })
    : []
  offers = offers.length
    ? offers.sort((a: any, b: any) => {
        return b.current_price - a.current_price
      })
    : []
  const bidsAndOffers = bids.concat(offers).sort((a: any, b: any) => {
    return b.current_price - a.current_price
  })
  if (offers.length < 1) offers = bids
  const highest_bid = bids[0]
  const highest_offer = offers[0]
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.current_price).isLessThan(b.current_price) ? -1 : 1
  )[0]
  const is_lowest_order_dutch = lowest_order && lowest_order.sale_kind === 1
  const is_lowest_order_english =
    lowest_order && !lowest_order.r && !lowest_order.s && !lowest_order.v

  if (assetQuery.error) return <NftError error={assetQuery.error} />

  if (assetQuery.fetching) return <NftAssetLoading />

  if (!currentAsset) return null

  const { network } = currentAsset
  const unsupportedNetwork = network !== 'ethereum' && network !== 'rinkeby'

  return (
    <Wrapper>
      <>
        <div style={{ display: 'block' }}>
          <Top>
            <LeftColWrapper>
              <StickyWrapper>
                <AssetImageContainer>
                  {currentAsset.animation_url ? (
                    <iframe
                      title='Asset Animation'
                      allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                      frameBorder='0'
                      height='100%'
                      sandbox='allow-scripts'
                      width='100%'
                      style={{ minHeight: '500px' }}
                      src={`${domains.walletHelper}/wallet-helper/nfts/#/url/${encodeURIComponent(
                        currentAsset.animation_url
                      )}`}
                    />
                  ) : (
                    <img alt='Asset Logo' width='100%' src={currentAsset.image_url || ''} />
                  )}
                  <NftAssetImageType
                    animation_url={currentAsset.animation_url}
                    image_url={currentAsset.image_url}
                    top='40px'
                    right='40px'
                  />
                </AssetImageContainer>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Socials>
                    <SocialLink>
                      <CopyClipboardButton
                        color='grey600'
                        textToCopy={`${domains.comWalletApp}/#/nfts/assets/${contract}/${id}`}
                        onClick={() =>
                          analyticsActions.trackEvent({
                            key: Analytics.NFT_SHARE_CLICKED,
                            properties: {}
                          })
                        }
                      />
                    </SocialLink>
                    {isOwner && (
                      <SocialLink>
                        <BlockchainIcon
                          onClick={() => {
                            analyticsActions.trackEvent({
                              key: Analytics.NFT_TRANSFER_CLICKED,
                              properties: {}
                            })
                            nftsActions.nftOrderFlowOpen({
                              asset_contract_address: contract,
                              step: NftOrderStepEnum.TRANSFER,
                              token_id: id
                            })
                          }}
                          cursor
                          color='grey600'
                          name='send'
                        />
                      </SocialLink>
                    )}
                    {/* <SocialLink>
                      <BlockchainIcon
                        onClick={() => {
                          analyticsActions.trackEvent({
                            key: Analytics.NFT_MORE_CLICKED,
                            properties: {}
                          })
                          // more
                        }}
                        cursor
                        color='grey600'
                        name='ellipsis'
                        size='4px'
                      />
                    </SocialLink> */}
                  </Socials>
                </div>
              </StickyWrapper>
            </LeftColWrapper>
            <RightColWrapper>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'block', marginTop: '2px' }}>
                  <Text
                    size='14px'
                    weight={600}
                    style={{
                      alignItems: 'center',
                      padding: '0em 0em 0.5em 0em'
                    }}
                  >
                    Collection
                  </Text>
                  <CustomLink to={`/nfts/collection/${currentAsset.collection?.slug}`}>
                    <CollectionName>
                      {currentAsset.collection.image_url ? (
                        <NftCollectionImage
                          alt='Dapp Logo'
                          src={currentAsset.collection?.image_url || ''}
                          isVerified={
                            currentAsset.collection.safelist_request_status === 'verified'
                          }
                        />
                      ) : null}

                      <div style={{ paddingLeft: '8px' }}>{currentAsset.collection?.name}</div>
                    </CollectionName>
                  </CustomLink>
                </div>
                <Button
                  id='nft-refresh'
                  data-e2e='nftAssetRefresh'
                  style={{
                    borderRadius: '50%',
                    height: '40px',
                    maxWidth: '40px',
                    minWidth: '40px',
                    padding: '12px'
                  }}
                  nature='empty-blue'
                  onClick={() => {
                    reexecuteQuery()
                    nftsActions.fetchOpenSeaAsset({
                      asset_contract_address: contract,
                      token_id: id
                    })
                    setIsRefreshRotating(true)
                  }}
                >
                  <NftRefreshIcon isActive={isRefreshRotating} size='lg' />
                </Button>
              </div>
              <AssetName>
                {currentAsset.name || `${currentAsset.collection?.name}${' #'}`}
              </AssetName>
              {owner?.address ? (
                <TextGroup inline style={{ marginTop: '24px' }}>
                  <Text size='16px' color='grey600' weight={600}>
                    <FormattedMessage id='copy.owned_by' defaultMessage='Owned by' />
                  </Text>
                  {!isOwner ? (
                    <Text
                      color='blue600'
                      weight={600}
                      cursor='pointer'
                      onClick={() => {
                        analyticsActions.trackEvent({
                          key: Analytics.NFT_OWNER_CLICKED,
                          properties: {}
                        })
                        routerActions.push(`/nfts/address/${owner.address}`)
                      }}
                    >
                      <CryptoAddress>{owner.address}</CryptoAddress>
                    </Text>
                  ) : (
                    <Text
                      color='blue600'
                      weight={600}
                      cursor='pointer'
                      onClick={() => {
                        analyticsActions.trackEvent({
                          key: Analytics.NFT_OWNER_CLICKED,
                          properties: {}
                        })
                        routerActions.push(`/nfts/address/${owner.address}`)
                      }}
                    >
                      You
                    </Text>
                  )}
                </TextGroup>
              ) : null}
              <CurrentPriceBox>
                {openSeaAsset.isLoading ? (
                  <div>
                    <Highest>
                      <div style={{ marginBottom: '1em' }}>
                        <SkeletonRectangle height='18px' width='100px' />
                      </div>
                      <SkeletonRectangle height='24px' width='200px' />
                      <Divider style={{ marginBottom: '1em' }} />
                      <SpinningLoader height='14px' width='14px' borderWidth='3px' />
                    </Highest>
                  </div>
                ) : null}
                {unsupportedNetwork && network ? (
                  <>
                    <Flex>
                      <Text size='12px' weight={600}>
                        <FormattedMessage
                          id='copy.this_asset_lives'
                          defaultMessage='This asset lives on the {network} network. Which is not supported at this time, we are constantly working on adding new networks to our system.'
                          values={{ network: network[0].toUpperCase() + network?.substr(1) }}
                        />
                      </Text>
                    </Flex>
                  </>
                ) : (
                  <>
                    {highest_bid ? (
                      <>
                        <Highest>
                          <div style={{ marginBottom: '1em' }}>
                            Bid expires in{' '}
                            {formatDistanceToNow(new Date(highest_bid?.expiration_time * 1000))}:
                          </div>
                          <NftAssetCountdown countDownDate={highest_bid.expiration_time * 1000} />
                        </Highest>
                        <Divider style={{ marginBottom: '1em' }} />
                        <Highest>Top Bid</Highest>
                        <EthText>
                          <CoinIcon
                            name={bidsAndOffers[0].payment_token_contract.symbol || 'ETH'}
                          />
                          <CoinDisplay
                            weight={600}
                            color={colors.grey900}
                            size='24px'
                            coin={bidsAndOffers[0].payment_token_contract.symbol}
                          >
                            {bidsAndOffers[0].current_price}
                          </CoinDisplay>
                          &nbsp;{' '}
                          <Text
                            size='16px'
                            weight={500}
                            style={{ display: 'flex' }}
                            color='grey500'
                          >
                            (
                            <FiatDisplay
                              weight={500}
                              currency={walletCurrency}
                              color='grey500'
                              size='16px'
                              coin={bidsAndOffers[0].payment_token_contract.symbol}
                            >
                              {bidsAndOffers[0].current_price}
                            </FiatDisplay>
                            )
                          </Text>
                        </EthText>
                      </>
                    ) : lowest_order ? (
                      <>
                        <Highest>
                          <div style={{ marginBottom: '1em' }}>
                            Sale ends in{' '}
                            {formatDistanceToNow(
                              new Date(
                                (is_lowest_order_english
                                  ? lowest_order.listing_time
                                  : lowest_order?.expiration_time) * 1000
                              )
                            )}
                          </div>
                          <NftAssetCountdown
                            countDownDate={
                              (is_lowest_order_english
                                ? lowest_order.listing_time
                                : lowest_order?.expiration_time) * 1000
                            }
                          />
                        </Highest>
                        <Divider style={{ marginBottom: '1em' }} />
                        <Highest>
                          {is_lowest_order_english ? 'Minimum Bid' : 'Current Price'}
                        </Highest>
                        <EthText>
                          <CoinIcon name={lowest_order.payment_token_contract.symbol || 'ETH'} />
                          <CoinDisplay
                            weight={600}
                            color={colors.grey900}
                            size='24px'
                            coin={lowest_order.payment_token_contract.symbol}
                          >
                            {lowest_order.current_price}
                          </CoinDisplay>
                          &nbsp;{' '}
                          <Text
                            size='16px'
                            weight={500}
                            style={{ display: 'flex' }}
                            color='grey500'
                          >
                            (
                            <FiatDisplay
                              weight={500}
                              currency={walletCurrency}
                              color='grey500'
                              size='16px'
                              coin={lowest_order.payment_token_contract.symbol}
                            >
                              {lowest_order.current_price}
                            </FiatDisplay>
                            )
                          </Text>
                        </EthText>
                      </>
                    ) : highest_offer ? (
                      <>
                        <Highest>
                          <div style={{ marginBottom: '1em' }}>
                            Offer expires in{' '}
                            {formatDistanceToNow(new Date(highest_offer.expiration_time * 1000))}
                          </div>
                          <NftAssetCountdown countDownDate={highest_offer.expiration_time * 1000} />
                        </Highest>
                        <Divider style={{ marginBottom: '1em' }} />
                        <Highest>Highest Offer</Highest>
                        <EthText>
                          <CoinIcon name={highest_offer.payment_token_contract.symbol || 'ETH'} />
                          <CoinDisplay
                            weight={600}
                            color={colors.grey900}
                            size='24px'
                            coin={highest_offer.payment_token_contract.symbol}
                          >
                            {highest_offer.current_price}
                          </CoinDisplay>
                          &nbsp;{' '}
                          <Text
                            size='16px'
                            weight={500}
                            style={{ display: 'flex' }}
                            color='grey500'
                          >
                            (
                            <FiatDisplay
                              weight={500}
                              currency={walletCurrency}
                              color='grey500'
                              size='16px'
                              coin={highest_offer.payment_token_contract.symbol}
                            >
                              {highest_offer.current_price}
                            </FiatDisplay>
                            )
                          </Text>
                        </EthText>
                      </>
                    ) : null}
                    <Flex gap={8}>
                      {isOwner ? (
                        <>
                          {!lowest_order ? (
                            <Button
                              data-e2e='openNftFlow'
                              nature='primary'
                              jumbo
                              onClick={() => {
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  step: NftOrderStepEnum.MARK_FOR_SALE,
                                  token_id: id
                                })
                                analyticsActions.trackEvent({
                                  key: Analytics.NFT_MARK_FOR_SALE,
                                  properties: {
                                    collection: collectionName,
                                    collection_id: id
                                  }
                                })
                              }}
                            >
                              <FormattedMessage
                                id='copy.mark_for_sale'
                                defaultMessage='Mark for Sale'
                              />
                            </Button>
                          ) : (
                            <Button
                              data-e2e='openNftFlow'
                              nature='primary'
                              jumbo
                              onClick={() =>
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  offer: undefined,
                                  order: lowest_order,
                                  step: NftOrderStepEnum.CANCEL_LISTING,
                                  token_id: id
                                })
                              }
                            >
                              <FormattedMessage
                                id='copy.cancel_listing'
                                defaultMessage='Cancel Listing'
                              />
                            </Button>
                          )}

                          {highest_offer && !sellOrders.length ? (
                            <Button
                              data-e2e='acceptNftOffer'
                              nature='dark'
                              jumbo
                              onClick={() => {
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  order: highest_offer,
                                  step: NftOrderStepEnum.ACCEPT_OFFER,
                                  token_id: id
                                })
                              }}
                            >
                              <FormattedMessage
                                id='copy.accept_offer'
                                defaultMessage='Accept Offer'
                              />
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                      {!isOwner ? (
                        is_lowest_order_english || is_lowest_order_dutch ? (
                          <Button
                            data-e2e='openNftFlow'
                            nature='dark'
                            jumbo
                            onClick={() => {
                              nftsActions.nftOrderFlowOpen({
                                asset_contract_address: contract,
                                order: lowest_order,
                                step: NftOrderStepEnum.MAKE_OFFER,
                                token_id: id
                              })
                              analyticsActions.trackEvent({
                                key: Analytics.NFT_MAKE_AN_OFFER_CLICKED,
                                properties: {}
                              })
                            }}
                          >
                            <FormattedMessage id='copy.place_a_bid' defaultMessage='Place a Bid' />
                          </Button>
                        ) : (
                          <Button
                            data-e2e='openNftFlow'
                            nature='dark'
                            jumbo
                            onClick={() => {
                              nftsActions.nftOrderFlowOpen({
                                asset_contract_address: contract,
                                step: NftOrderStepEnum.MAKE_OFFER,
                                token_id: id
                              })
                              analyticsActions.trackEvent({
                                key: Analytics.NFT_MAKE_AN_OFFER_CLICKED,
                                properties: {}
                              })
                            }}
                          >
                            <FormattedMessage
                              id='copy.make_an_offer'
                              defaultMessage='Make an Offer'
                            />
                          </Button>
                        )
                      ) : null}
                      {lowest_order && !isOwner && !is_lowest_order_english ? (
                        <>
                          <Button
                            data-e2e='openNftFlow'
                            nature='primary'
                            jumbo
                            onClick={() => {
                              nftsActions.nftOrderFlowOpen({
                                asset_contract_address: contract,
                                order: lowest_order as RawOrder,
                                step: NftOrderStepEnum.BUY,
                                token_id: id
                              })
                              analyticsActions.trackEvent({
                                key: Analytics.NFT_BUY_NOW_CLICKED,
                                properties: {
                                  collection: collectionName,
                                  collection_id: id
                                }
                              })
                            }}
                          >
                            <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                          </Button>
                        </>
                      ) : null}
                    </Flex>
                  </>
                )}
              </CurrentPriceBox>
              <CustomTabMenu>
                <TabMenuItem width='33%' onClick={() => setTab('about')} selected={Tab === 'about'}>
                  <FormattedMessage id='copy.about' defaultMessage='About' />
                </TabMenuItem>
                <TabMenuItem
                  width='33%'
                  onClick={() => setTab('activity')}
                  selected={Tab === 'activity'}
                >
                  <FormattedMessage id='copy.activity' defaultMessage='Activity' />
                </TabMenuItem>
                <TabMenuItem
                  width='33%'
                  onClick={() => setTab('offers')}
                  selected={Tab === 'offers'}
                >
                  <FormattedMessage id='copy.offers' defaultMessage='Offers' />
                </TabMenuItem>
              </CustomTabMenu>
              {Tab === 'about' && (
                <DetailsAndOffers>
                  {currentAsset.traits?.length ? (
                    <TraitsWrapper>
                      {currentAsset.traits.map((trait) => {
                        if (!trait) return null

                        const assetTraits = currentAsset.traits?.find(
                          (t) => t?.trait_type === trait.trait_type
                        )
                        const traitCount = assetTraits?.trait_count
                        const rarity =
                          traitCount && currentAsset.collection.total_supply
                            ? `${parseFloat(
                                ((traitCount / currentAsset.collection.total_supply) * 100).toFixed(
                                  1
                                )
                              )}%`
                            : 'New Trait'

                        return (
                          <Trait
                            key={trait.value}
                            onClick={() => {
                              routerActions.push(`/nfts/collection/${currentAsset.collection.slug}`)
                              formActions.change(
                                'nftFilter',
                                `${trait.trait_type}.${trait.value}`,
                                true
                              )
                            }}
                          >
                            <Text capitalize color='blue400' size='12px' weight={400}>
                              <b>{trait?.trait_type}</b>
                            </Text>
                            <Text capitalize color='blue600' size='14px' weight={600}>
                              {trait?.value}
                            </Text>
                            <Text capitalize color='grey900' size='12px' weight={500}>
                              {rarity}
                            </Text>
                          </Trait>
                        )
                      })}
                    </TraitsWrapper>
                  ) : null}
                  <AdditionalDetailsWrapper>
                    <Detail>
                      <Text size='16px' weight={500} color='grey900'>
                        Blockchain
                      </Text>{' '}
                      <Text size='16px' weight={600} color='grey600'>
                        Ethereum
                      </Text>
                    </Detail>
                    <Detail>
                      <Text size='16px' weight={500} color='grey900'>
                        Contract Address
                      </Text>

                      {currentAsset.contract?.address ? (
                        <Link
                          href={`https://www.blockchain.com/eth/address/${currentAsset.contract?.address}`}
                          target='_blank'
                          onClick={() =>
                            analyticsActions.trackEvent({
                              key: Analytics.NFT_CONTRACT_ADDRESS_CLICKED,
                              properties: {}
                            })
                          }
                        >
                          <CreatorOwnerAddressLinkText>
                            <CryptoAddress>{currentAsset.contract?.address}</CryptoAddress>
                          </CreatorOwnerAddressLinkText>
                        </Link>
                      ) : (
                        <Text size='16px' weight={500}>
                          Not Available
                        </Text>
                      )}
                    </Detail>
                    <Detail>
                      <Text size='16px' weight={500} color='grey900'>
                        Token ID
                      </Text>

                      <TokenDisplay size='16px' weight={600} color='grey600'>
                        {currentAsset.token_id}{' '}
                      </TokenDisplay>
                    </Detail>
                    <Detail>
                      <Text size='16px' weight={500} color='grey900'>
                        Token Standard
                      </Text>{' '}
                      <Text size='16px' weight={600} color='grey600'>
                        {currentAsset.contract?.schema_name}
                      </Text>
                    </Detail>
                  </AdditionalDetailsWrapper>
                </DetailsAndOffers>
              )}
              {Tab === 'activity' && (
                <ActivityWrapper>
                  <Events
                    noBorder
                    columns={['event_type', 'price', 'from', 'date']}
                    isFetchingParent={false}
                    filters={[
                      {
                        field: EventFilterFields.AssetContractAddress,
                        value: currentAsset.contract?.address
                      },
                      { field: EventFilterFields.AssetTokenId, value: currentAsset.token_id }
                    ]}
                    key='events'
                  />
                </ActivityWrapper>
              )}
              {Tab === 'offers' ? (
                bidsAndOffers.length > 0 ? (
                  <ActivityWrapper>
                    <Offers
                      asset={openSeaAsset.data}
                      columns={['price', 'from', 'expiration', 'action']}
                      bidsAndOffers={bidsAndOffers}
                      defaultEthAddr={defaultEthAddr}
                    />
                  </ActivityWrapper>
                ) : openSeaAsset.isLoading ? (
                  <Flex justifyContent='center'>
                    <SpinningLoader height='14px' width='14px' borderWidth='3px' />
                  </Flex>
                ) : (
                  <Flex justifyContent='center' alignItems='center' flexDirection='column'>
                    <Image height='100px' name='no-activity' />
                    <Text style={{ marginTop: '8px' }} size='16px' weight={600}>
                      <FormattedMessage id='copy.no_offers' defaultMessage='No Offers' />
                    </Text>
                  </Flex>
                )
              ) : null}
            </RightColWrapper>
          </Top>
          {currentAsset &&
          ((currentAsset?.collection?.total_supply && currentAsset.collection.total_supply > 2) ||
            !currentAsset.collection.total_supply) ? (
            <AssetMoreItems asset={currentAsset} />
          ) : null}
        </div>
      </>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    comWalletApp: 'https://login.blockchain.com',
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { contract: string; id: string } }
}

export default connector(NftAsset)
