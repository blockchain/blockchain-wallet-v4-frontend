import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ReactMarkdown from 'react-markdown'
import { connect, ConnectedProps } from 'react-redux'
import {
  IconComputer,
  IconInstagram,
  IconLink,
  IconTwitter,
  PaletteColors
} from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import NftDropdown from 'blockchain-wallet-v4-frontend/src/modals/Nfts/components/NftDropdown'
import {
  AvatarGradientColors,
  LinksContainer
} from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components'
import Avatar from 'boring-avatars'
import { formatDistanceToNow } from 'date-fns'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { NftAsset as NftAssetType, WyvernRawOrder } from '@core/network/api/nfts/types'
import { WalletOptionsType } from '@core/types'
import {
  Button,
  Icon as BlockchainIcon,
  Image,
  Link,
  SkeletonRectangle,
  SpinningLoader,
  Text
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
import { isMobile, media, useMedia } from 'services/styles'

import NftCollectionImage from '../components/NftCollectionImage'
import NftError from '../components/NftError'
import NftRefreshIcon from '../components/NftRefreshIcon'
import Events from '../Events'
import Offers from '../Offers'
import { getIsSharedStorefront } from '../utils/NftUtils'
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
  border-radius: 16px;
  margin-bottom: 0.5rem;
  padding: 30px;
  ${media.mobile`
    padding: 0;
  `};
`

const AssetImg = styled.img`
  border-radius: 18px;
  box-shadow: 0px 0px 40px 0px ${(props) => props.theme.grey200};
  box-sizing: border-box;
`

const Description = styled.div`
  margin-bottom: 1em;
  padding: 1em;
  background: rgb(240, 242, 247, 0.3);
  border: 1px solid ${(props) => props.theme.greyFade000};
  border-radius: 16px;
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
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-right: 0;
  }
`

const ActivityWrapper = styled.div`
  max-height: 300px;
  overflow: auto;
`

const CreatorOwnerAddress = styled.div`
  font-size: 16px;
  color: ${PaletteColors['grey-700']};
  display: flex;
`

const CreatorOwnerAddressLinkText = styled(CreatorOwnerAddress)`
  color: ${PaletteColors['blue-600']};
  font-weight: 600;
`

const TokenDisplay = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  text-align: right;
`
const DropdownPadding = styled.div`
  padding-bottom: 1em;
`

const Detail = styled(Text)`
  display: flex;
  justify-content: space-between;
  color: ${PaletteColors['grey-900']};
  padding: 1em 1.5em;
  border-bottom: 1px solid ${PaletteColors['grey-000']};
  font-size: 16px;
  font-weight: 500;
  &:last-child {
    border-bottom: none;
  }
`

const ShadowTag = styled.div`
  background: ${PaletteColors['white-900']};
  box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.1);
  border-radius: 16px;
  padding: 6px 6px;
  width: fit-content;
`

const CollectionHeader = styled.div`
  ${media.atLeastTablet`
    justify-content: left;
    gap: 24px;
  `};
  display: flex;
  margin-top: 2px;
  width: 100%;
  justify-content: space-between;
`

const GradientCoinDisplay = styled(CoinDisplay)`
  background: linear-gradient(92.99deg, #7663ff 0.55%, #0069fc 98.76%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  const IS_SHARED_STOREFRONT = getIsSharedStorefront({
    asset_contract: { address: contract }
  } as NftAssetType)
  const [isRefreshRotating, setIsRefreshRotating] = useState<boolean>(false)
  // @ts-ignore
  const [assetQuery, reExecuteQuery] = useAssetQuery({
    requestPolicy: 'network-only',
    variables: {
      filter: [
        { field: AssetFilterFields.ContractAddress, value: contract },
        { field: AssetFilterFields.TokenId, value: id }
      ]
    }
  })

  const openSeaAsset = useRemote(selectors.components.nfts.getOpenSeaAsset)
  const [moreAssetToggle, setMoreAssetToggle] = useState(true)
  const isTablet = useMedia('tablet')

  useEffect(() => {
    nftsActions.fetchOpenSeaAsset({
      asset_contract_address: contract,
      defaultEthAddr,
      token_id: id
    })
  }, [contract, id, nftsActions, defaultEthAddr])

  useEffect(() => {
    if (isRefreshRotating) {
      setTimeout(() => {
        setIsRefreshRotating(false)
      }, 500)
    }
  }, [isRefreshRotating])

  const currentAsset = assetQuery.data?.assets[0]
  const isOwner =
    openSeaAsset.data?.ownership?.owner.address.toLowerCase() === defaultEthAddr.toLowerCase()

  const owner = isOwner ? openSeaAsset.data?.ownership?.owner : openSeaAsset.data?.owner
  const collectionName = currentAsset?.collection?.name || ''
  const assetDecription = currentAsset?.description || ''
  const collectionDescription = currentAsset?.collection?.description || ''

  // seaport sell orders (aka listing)
  let asks =
    openSeaAsset.data?.seaport_sell_orders
      ?.filter(({ side }) => side === 'ask')
      ?.sort((a, b) => (new BigNumber(a.current_price).isLessThan(b.current_price) ? -1 : 1)) || []
  // seaport buy orders (aka offer)
  let bids =
    openSeaAsset.data?.seaport_sell_orders
      ?.filter(({ side }) => side === 'bid')
      ?.sort((a, b) => (new BigNumber(a.current_price).isLessThan(b.current_price) ? 1 : -1)) || []
  let highestBid = bids[0]
  let lowestAsk = asks[0]
  let isLowestAskDutch = !!lowestAsk?.protocol_data.parameters.consideration.find(
    (x) => x.token === window.coins.WETH.coinfig.type.erc20Address
  )
  // TODO: SEAPORT
  let isLowestAskEnglish = false
  let isLowestAskReserved = lowestAsk?.taker
    ? lowestAsk?.taker.address.toLowerCase() !== defaultEthAddr.toLowerCase()
    : false

  // TODO: SEAPORT - remove wyvern 👇
  if (IS_SHARED_STOREFRONT) {
    const bids_LEGACY =
      openSeaAsset.data?.orders?.filter((x) => {
        return x.side === 0
      }, []) || []
    const asks_LEGACY =
      openSeaAsset.data?.orders?.filter((x) => {
        return x.side === 1
      }) || []
    const highestBid_LEGACY = bids_LEGACY.sort((a, b) =>
      new BigNumber(a.current_price).isLessThan(b.current_price) ? 1 : -1
    )[0]
    const lowestAsk_LEGACY = asks_LEGACY.sort((a, b) =>
      new BigNumber(a.current_price).isLessThan(b.current_price) ? -1 : 1
    )[0]
    const isLowestAskDutch_LEGACY = lowestAsk_LEGACY && lowestAsk_LEGACY.sale_kind === 1
    const isLowestAskEnglish_LEGACY =
      lowestAsk_LEGACY && !lowestAsk_LEGACY.r && !lowestAsk_LEGACY.s && !lowestAsk_LEGACY.v
    const isLowestAskReserved_LEGACY = lowestAsk?.taker
      ? lowestAsk_LEGACY?.taker.address.toLowerCase() !== defaultEthAddr.toLowerCase()
      : false

    isLowestAskDutch = isLowestAskDutch_LEGACY
    isLowestAskEnglish = isLowestAskEnglish_LEGACY
    // @ts-ignore
    asks = asks_LEGACY
    // @ts-ignore
    bids = bids_LEGACY
    // @ts-ignore
    lowestAsk = lowestAsk_LEGACY
    // @ts-ignore
    highestBid = highestBid_LEGACY
    isLowestAskReserved = isLowestAskReserved_LEGACY
  }
  // TODO: SEAPORT - remove wyvern 👆

  const paymentTokenContractSymbol = isLowestAskDutch ? 'WETH' : 'ETH'

  if (assetQuery.error) return <NftError error={assetQuery.error} />

  if (assetQuery.fetching) return <NftAssetLoading />

  if (!currentAsset) return null

  const { network } = currentAsset
  const unsupportedNetwork = network !== 'ethereum' && network !== 'rinkeby'
  const sortedTraits =
    currentAsset?.traits?.sort((a, b) =>
      a?.trait_count && b?.trait_count && a.trait_count > b.trait_count ? 1 : -1
    ) || []

  return (
    <Wrapper>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'block' }}>
          <Top>
            <LeftColWrapper>
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
                ) : currentAsset.image_url ? (
                  <AssetImg alt='Asset Logo' width='100%' src={currentAsset.image_url || ''} />
                ) : (
                  <Image width='100%' height='500px' name='nft-img-placeholder' />
                )}
              </AssetImageContainer>
              {isTablet && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em 0' }}>
                  <Socials>
                    <SocialLink
                      id='nft-refresh'
                      role='button'
                      onClick={() => {
                        reExecuteQuery()
                        nftsActions.fetchOpenSeaAsset({
                          asset_contract_address: contract,
                          defaultEthAddr,
                          token_id: id
                        })
                        setIsRefreshRotating(true)
                      }}
                    >
                      <NftRefreshIcon isActive={isRefreshRotating} size='small' color='grey-700' />
                    </SocialLink>
                    <SocialLink>
                      <CopyClipboardButton
                        color='grey700'
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
                          role='button'
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
                          color='grey700'
                          name='send'
                        />
                      </SocialLink>
                    )}
                  </Socials>
                </div>
              )}
              {!isTablet && (
                <>
                  {assetDecription !== '' ? (
                    <Description>
                      <Flex flexDirection='column'>
                        <Text size='16px' color='grey900' weight={600}>
                          <FormattedMessage id='copy.description' defaultMessage='Description' />
                        </Text>
                        <Text
                          size='16px'
                          color='grey900'
                          weight={500}
                          style={{ wordBreak: 'break-word' }}
                        >
                          {moreAssetToggle && assetDecription?.length > 82 ? (
                            <ReactMarkdown linkTarget='_blank'>
                              {`${assetDecription.substring(0, 82)}...`}
                            </ReactMarkdown>
                          ) : (
                            <ReactMarkdown linkTarget='_blank'>{assetDecription}</ReactMarkdown>
                          )}
                        </Text>
                        {assetDecription?.length > 82 && (
                          <Text
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (assetDecription?.length > 82) setMoreAssetToggle(!moreAssetToggle)
                            }}
                            size='16px'
                            color='blue600'
                            weight={600}
                          >
                            {moreAssetToggle ? (
                              <FormattedMessage id='copy.more' defaultMessage='See More' />
                            ) : (
                              <FormattedMessage id='copy.less' defaultMessage='Less' />
                            )}
                          </Text>
                        )}
                      </Flex>
                    </Description>
                  ) : null}
                  {sortedTraits.length ? (
                    <DropdownPadding style={{ paddingTop: '1em' }}>
                      <NftDropdown expanded title='Traits'>
                        <div style={{ padding: '1em' }}>
                          <Flex flexDirection='column'>
                            <TraitsWrapper>
                              {sortedTraits.map((trait) => {
                                if (!trait) return null

                                const assetTraits = sortedTraits?.find(
                                  (t) => t?.trait_type === trait.trait_type
                                )
                                const traitCount = assetTraits?.trait_count
                                const rarity =
                                  traitCount && currentAsset.collection.total_supply
                                    ? `${parseFloat(
                                        (
                                          (traitCount / currentAsset.collection.total_supply) *
                                          100
                                        ).toFixed(1)
                                      )}% Rarity`
                                    : 'New Trait'

                                return (
                                  <Trait
                                    key={trait.value}
                                    onClick={() => {
                                      routerActions.push(
                                        `/nfts/collection/${currentAsset.collection.slug}`
                                      )
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
                          </Flex>
                        </div>
                      </NftDropdown>
                    </DropdownPadding>
                  ) : null}
                  {collectionDescription !== '' ? (
                    <DropdownPadding style={{ paddingTop: '1em' }}>
                      <NftDropdown expanded title={`About ${collectionName}`}>
                        <div style={{ padding: '1em' }}>
                          <div>
                            <Flex flexDirection='column'>
                              <Text
                                size='16px'
                                color='grey900'
                                weight={500}
                                style={{ wordBreak: 'break-word' }}
                              >
                                <ReactMarkdown linkTarget='_blank'>
                                  {collectionDescription}
                                </ReactMarkdown>
                              </Text>
                              <LinksContainer style={{ width: 'fit-content' }}>
                                {currentAsset?.collection.external_url ? (
                                  <Link
                                    target='_blank'
                                    href={currentAsset?.collection.external_url}
                                  >
                                    <IconLink
                                      size='small'
                                      label='globe'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.twitter_username ? (
                                  <Link
                                    target='_blank'
                                    href={`https://twitter.com/${currentAsset?.collection.twitter_username}`}
                                  >
                                    <IconTwitter
                                      size='small'
                                      label='twitter'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.instagram_username ? (
                                  <Link
                                    target='_blank'
                                    href={`https://instagram.com/${currentAsset?.collection.instagram_username}`}
                                  >
                                    <IconInstagram
                                      size='small'
                                      label='camera'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.discord_url ? (
                                  <Link
                                    target='_blank'
                                    href={`${currentAsset?.collection.discord_url}`}
                                  >
                                    <IconComputer
                                      size='small'
                                      label='computer'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                              </LinksContainer>
                            </Flex>
                          </div>
                        </div>
                      </NftDropdown>
                    </DropdownPadding>
                  ) : null}
                </>
              )}
            </LeftColWrapper>
            <RightColWrapper>
              {isTablet && (
                <AssetName>
                  {currentAsset?.name
                    ? currentAsset?.name?.length > 10
                      ? `${currentAsset?.name.substring(0, 10)}...`
                      : currentAsset?.name
                    : `#${currentAsset?.token_id}`}
                </AssetName>
              )}
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <CollectionHeader>
                  <div>
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
                    <div style={{ padding: '6px 0px' }}>
                      <ShadowTag>
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
                            ) : (
                              <Flex alignItems='center' flexDirection='row'>
                                <Avatar
                                  size={34}
                                  name={currentAsset.collection.slug || ''}
                                  variant='marble'
                                  colors={AvatarGradientColors}
                                />
                              </Flex>
                            )}
                            <Text
                              size='16px'
                              weight={600}
                              style={{
                                maxWidth: '120px',
                                overflow: 'hidden',
                                paddingLeft: '8px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {currentAsset.collection?.name}
                            </Text>
                          </CollectionName>
                        </CustomLink>
                      </ShadowTag>
                    </div>
                  </div>
                  {owner?.address ? (
                    <div>
                      <Text
                        size='14px'
                        weight={600}
                        style={{
                          alignItems: 'center',
                          padding: '0em 0em 0.5em 0em'
                        }}
                      >
                        Owner
                      </Text>
                      <div style={{ padding: '6px 0px' }}>
                        <ShadowTag>
                          <CustomLink to={`/nfts/address/${owner.address}`}>
                            <CollectionName>
                              {owner?.profile_img_url ? (
                                <NftCollectionImage
                                  alt='Owner Logo'
                                  src={owner?.profile_img_url || ''}
                                  isVerified={
                                    currentAsset.collection.safelist_request_status === 'verified'
                                  }
                                />
                              ) : (
                                <Flex alignItems='center' flexDirection='row'>
                                  <Avatar
                                    size={34}
                                    name={owner.address || ''}
                                    variant='marble'
                                    colors={AvatarGradientColors}
                                  />{' '}
                                </Flex>
                              )}

                              <Text
                                size='16px'
                                weight={600}
                                color='blue600'
                                style={{ paddingLeft: '8px' }}
                              >
                                <CryptoAddress>{owner.address}</CryptoAddress>
                              </Text>
                            </CollectionName>
                          </CustomLink>
                        </ShadowTag>
                      </div>
                    </div>
                  ) : null}
                </CollectionHeader>
                {!isTablet && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Socials>
                      <SocialLink
                        id='nft-refresh'
                        role='button'
                        onClick={() => {
                          reExecuteQuery()
                          nftsActions.fetchOpenSeaAsset({
                            asset_contract_address: contract,
                            defaultEthAddr,
                            token_id: id
                          })
                          setIsRefreshRotating(true)
                        }}
                      >
                        <NftRefreshIcon
                          isActive={isRefreshRotating}
                          size='small'
                          color='grey-700'
                        />
                      </SocialLink>
                      <SocialLink>
                        <CopyClipboardButton
                          color='grey700'
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
                            role='button'
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
                            color='grey700'
                            name='send'
                          />
                        </SocialLink>
                      )}
                    </Socials>
                  </div>
                )}
              </div>
              {!isTablet && (
                <AssetName>
                  {currentAsset?.name
                    ? currentAsset?.name?.length > 10
                      ? `${currentAsset?.name.substring(0, 10)}...`
                      : currentAsset?.name
                    : `#${currentAsset?.token_id}`}
                </AssetName>
              )}
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
                    {lowestAsk && !highestBid ? (
                      <>
                        <Highest>
                          {isLowestAskEnglish || isLowestAskDutch ? (
                            <div style={{ marginBottom: '1em' }}>Auction Ends In </div>
                          ) : (
                            <div style={{ marginBottom: '1em' }}>
                              Sale ends in{' '}
                              {formatDistanceToNow(
                                new Date(
                                  (isLowestAskEnglish
                                    ? lowestAsk.listing_time
                                    : lowestAsk?.expiration_time) * 1000
                                )
                              )}
                            </div>
                          )}

                          <NftAssetCountdown
                            countDownDate={
                              (isLowestAskEnglish
                                ? lowestAsk.listing_time
                                : lowestAsk?.expiration_time) * 1000
                            }
                          />
                        </Highest>
                        <Divider style={{ marginBottom: '1em' }} />
                        <Highest>{isLowestAskEnglish ? 'Minimum Bid' : 'Current Price'}</Highest>
                        <EthText>
                          <CoinIcon name={paymentTokenContractSymbol} />
                          <GradientCoinDisplay
                            weight={600}
                            color={PaletteColors['grey-900']}
                            size='24px'
                            coin={paymentTokenContractSymbol}
                          >
                            {lowestAsk.current_price}
                          </GradientCoinDisplay>
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
                              coin={paymentTokenContractSymbol}
                            >
                              {lowestAsk.current_price}
                            </FiatDisplay>
                            )
                          </Text>
                        </EthText>
                      </>
                    ) : highestBid ? (
                      <>
                        <Highest>
                          <div style={{ marginBottom: '1em' }}>
                            Offer expires in{' '}
                            {formatDistanceToNow(new Date(highestBid.expiration_time * 1000))}
                          </div>
                          <NftAssetCountdown countDownDate={highestBid.expiration_time * 1000} />
                        </Highest>
                        <Divider style={{ marginBottom: '1em' }} />
                        <Highest>Highest Offer</Highest>
                        <EthText>
                          {/* TODO: SEAPORT */}
                          <CoinIcon name='WETH' />
                          <GradientCoinDisplay
                            weight={600}
                            color={PaletteColors['grey-900']}
                            size='24px'
                            coin='WETH'
                          >
                            {highestBid.current_price}
                          </GradientCoinDisplay>
                          &nbsp;{' '}
                          <Text
                            size='16px'
                            weight={500}
                            style={{ display: 'flex' }}
                            color='grey500'
                          >
                            ({/* TODO: SEAPORT */}
                            <FiatDisplay
                              weight={500}
                              currency={walletCurrency}
                              color='grey500'
                              size='16px'
                              coin='WETH'
                            >
                              {highestBid.current_price}
                            </FiatDisplay>
                            )
                          </Text>
                        </EthText>
                      </>
                    ) : null}
                    <Flex gap={8}>
                      {isOwner ? (
                        <>
                          {!lowestAsk ||
                          lowestAsk.maker.address.toLowerCase() !== defaultEthAddr.toLowerCase() ? (
                            <Button
                              data-e2e='openNftFlow'
                              nature='primary'
                              jumbo
                              onClick={() => {
                                analyticsActions.trackEvent({
                                  key: Analytics.NFT_MARK_FOR_SALE,
                                  properties: {
                                    collection: collectionName,
                                    collection_id: id
                                  }
                                })
                                if (IS_SHARED_STOREFRONT) {
                                  nftsActions.nftOrderFlowOpen_LEGACY({
                                    asset_contract_address: contract,
                                    step: NftOrderStepEnum.MARK_FOR_SALE,
                                    token_id: id
                                  })
                                } else {
                                  nftsActions.nftOrderFlowOpen({
                                    asset_contract_address: contract,
                                    step: NftOrderStepEnum.MARK_FOR_SALE,
                                    token_id: id
                                  })
                                }
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
                              onClick={() => {
                                if (IS_SHARED_STOREFRONT) {
                                  nftsActions.nftOrderFlowOpen_LEGACY({
                                    asset_contract_address: contract,
                                    // @ts-ignore
                                    order: lowestAsk as WyvernRawOrder,
                                    step: NftOrderStepEnum.CANCEL_LISTING,
                                    token_id: id
                                  })
                                } else {
                                  nftsActions.nftOrderFlowOpen({
                                    asset_contract_address: contract,
                                    seaportOrder: lowestAsk,
                                    step: NftOrderStepEnum.CANCEL_LISTING,
                                    token_id: id
                                  })
                                }
                              }}
                            >
                              <FormattedMessage
                                id='copy.cancel_listing'
                                defaultMessage='Cancel Listing'
                              />
                            </Button>
                          )}

                          {highestBid && !asks.length ? (
                            <Button
                              data-e2e='acceptNftOffer'
                              nature='dark'
                              jumbo
                              onClick={() => {
                                if (IS_SHARED_STOREFRONT) {
                                  nftsActions.nftOrderFlowOpen_LEGACY({
                                    asset_contract_address: contract,
                                    // @ts-ignore
                                    order: highestBid,
                                    step: NftOrderStepEnum.ACCEPT_OFFER,
                                    token_id: id
                                  })
                                } else {
                                  nftsActions.nftOrderFlowOpen({
                                    asset_contract_address: contract,
                                    seaportOrder: highestBid,
                                    step: NftOrderStepEnum.ACCEPT_OFFER,
                                    token_id: id
                                  })
                                }
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
                        isLowestAskEnglish || isLowestAskDutch ? (
                          <Button
                            data-e2e='openNftFlow'
                            nature='primary'
                            width='50%'
                            jumbo
                            onClick={() => {
                              if (IS_SHARED_STOREFRONT) {
                                nftsActions.nftOrderFlowOpen_LEGACY({
                                  asset_contract_address: contract,
                                  // @ts-ignore
                                  order: lowestAsk,
                                  step: NftOrderStepEnum.MAKE_OFFER,
                                  token_id: id
                                })
                              } else {
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  step: NftOrderStepEnum.MAKE_OFFER,
                                  token_id: id
                                })
                              }
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
                            fullwidth={isMobile()}
                            jumbo
                            onClick={() => {
                              if (IS_SHARED_STOREFRONT) {
                                nftsActions.nftOrderFlowOpen_LEGACY({
                                  asset_contract_address: contract,
                                  step: NftOrderStepEnum.MAKE_OFFER,
                                  token_id: id
                                })
                              } else {
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  step: NftOrderStepEnum.MAKE_OFFER,
                                  token_id: id
                                })
                              }
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
                      {lowestAsk &&
                      !isOwner &&
                      !isLowestAskEnglish &&
                      !isLowestAskDutch &&
                      !isLowestAskReserved ? (
                        <>
                          <Button
                            data-e2e='openNftFlow'
                            nature='primary'
                            fullwidth={isMobile()}
                            jumbo
                            onClick={() => {
                              if (IS_SHARED_STOREFRONT) {
                                nftsActions.nftOrderFlowOpen_LEGACY({
                                  asset_contract_address: contract,
                                  // @ts-ignore
                                  order: lowestAsk,
                                  step: NftOrderStepEnum.BUY,
                                  token_id: id
                                })
                              } else {
                                nftsActions.nftOrderFlowOpen({
                                  asset_contract_address: contract,
                                  seaportOrder: lowestAsk,
                                  step: NftOrderStepEnum.BUY,
                                  token_id: id
                                })
                              }
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
              <DropdownPadding style={{ paddingTop: '1em' }}>
                <NftDropdown expanded title='Activity'>
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
                </NftDropdown>
              </DropdownPadding>
              <DropdownPadding>
                <NftDropdown title='Offers'>
                  {bids && bids.length > 0 ? (
                    <ActivityWrapper>
                      <Offers
                        asset={openSeaAsset.data}
                        isOwner={isOwner}
                        columns={['price', 'from', 'expiration', 'action']}
                        offers={bids}
                        defaultEthAddr={defaultEthAddr}
                      />
                    </ActivityWrapper>
                  ) : openSeaAsset.isLoading ? (
                    <Flex style={{ padding: '12px' }} justifyContent='center'>
                      <SpinningLoader height='14px' width='14px' borderWidth='3px' />
                    </Flex>
                  ) : (
                    <Flex
                      style={{ padding: '12px' }}
                      justifyContent='center'
                      alignItems='center'
                      flexDirection='column'
                    >
                      <Image height='80px' name='nft-img-placeholder' />
                      <Text style={{ margin: '8px 0' }} size='14px' weight={600}>
                        <FormattedMessage id='copy.no_offers' defaultMessage='No Offers' />
                      </Text>
                    </Flex>
                  )}
                </NftDropdown>
              </DropdownPadding>
              <DropdownPadding>
                <NftDropdown expanded title='Details'>
                  <DetailsAndOffers>
                    <Detail>
                      <Text size='16px' weight={500} color='grey900'>
                        Blockchain
                      </Text>{' '}
                      <Text capitalize size='16px' weight={600} color='grey600'>
                        {currentAsset.network}
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
                        {currentAsset.token_id.length > 20 ? (
                          <CryptoAddress canCopy>{currentAsset.token_id}</CryptoAddress>
                        ) : (
                          currentAsset.token_id
                        )}
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
                  </DetailsAndOffers>
                </NftDropdown>
              </DropdownPadding>
              {isTablet && (
                <>
                  {assetDecription !== '' ? (
                    <Description>
                      <Flex flexDirection='column'>
                        <Text size='16px' color='grey900' weight={600}>
                          <FormattedMessage id='copy.description' defaultMessage='Description' />
                        </Text>
                        <Text
                          size='16px'
                          color='grey900'
                          weight={500}
                          style={{ wordBreak: 'break-word' }}
                        >
                          {moreAssetToggle && assetDecription?.length > 82 ? (
                            <ReactMarkdown linkTarget='_blank'>
                              {`${assetDecription.substring(0, 82)}...`}
                            </ReactMarkdown>
                          ) : (
                            <ReactMarkdown linkTarget='_blank'>{assetDecription}</ReactMarkdown>
                          )}
                        </Text>
                        {assetDecription?.length > 82 && (
                          <Text
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (assetDecription?.length > 82) setMoreAssetToggle(!moreAssetToggle)
                            }}
                            size='16px'
                            color='blue600'
                            weight={600}
                          >
                            {moreAssetToggle ? (
                              <FormattedMessage id='copy.more' defaultMessage='See More' />
                            ) : (
                              <FormattedMessage id='copy.less' defaultMessage='Less' />
                            )}
                          </Text>
                        )}
                      </Flex>
                    </Description>
                  ) : null}
                  {sortedTraits.length ? (
                    <DropdownPadding>
                      <NftDropdown expanded title='Traits'>
                        <div style={{ padding: '1em' }}>
                          <Flex flexDirection='column'>
                            <TraitsWrapper>
                              {sortedTraits.map((trait) => {
                                if (!trait) return null

                                const assetTraits = sortedTraits?.find(
                                  (t) => t?.trait_type === trait.trait_type
                                )
                                const traitCount = assetTraits?.trait_count
                                const rarity =
                                  traitCount && currentAsset.collection.total_supply
                                    ? `${parseFloat(
                                        (
                                          (traitCount / currentAsset.collection.total_supply) *
                                          100
                                        ).toFixed(1)
                                      )}% Rarity`
                                    : 'New Trait'

                                return (
                                  <Trait
                                    key={trait.value}
                                    onClick={() => {
                                      routerActions.push(
                                        `/nfts/collection/${currentAsset.collection.slug}`
                                      )
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
                          </Flex>
                        </div>
                      </NftDropdown>
                    </DropdownPadding>
                  ) : null}
                  {collectionDescription !== '' ? (
                    <DropdownPadding>
                      <NftDropdown expanded title={`About ${collectionName}`}>
                        <div style={{ padding: '1em' }}>
                          <div>
                            <Flex flexDirection='column'>
                              <Text
                                size='16px'
                                color='grey900'
                                weight={500}
                                style={{ wordBreak: 'break-word' }}
                              >
                                <ReactMarkdown linkTarget='_blank'>
                                  {collectionDescription}
                                </ReactMarkdown>
                              </Text>
                              <LinksContainer style={{ width: 'fit-content' }}>
                                {currentAsset?.collection.external_url ? (
                                  <Link
                                    target='_blank'
                                    href={currentAsset?.collection.external_url}
                                  >
                                    <IconLink
                                      size='small'
                                      label='globe'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.twitter_username ? (
                                  <Link
                                    target='_blank'
                                    href={`https://twitter.com/${currentAsset?.collection.twitter_username}`}
                                  >
                                    <IconTwitter
                                      size='small'
                                      label='twitter'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.instagram_username ? (
                                  <Link
                                    target='_blank'
                                    href={`https://instagram.com/${currentAsset?.collection.instagram_username}`}
                                  >
                                    <IconInstagram
                                      size='small'
                                      label='camera'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                                {currentAsset?.collection.discord_url ? (
                                  <Link
                                    target='_blank'
                                    href={`${currentAsset?.collection.discord_url}`}
                                  >
                                    <IconComputer
                                      size='small'
                                      label='computer'
                                      color={PaletteColors['blue-600']}
                                    />
                                  </Link>
                                ) : null}
                              </LinksContainer>
                            </Flex>
                          </div>
                        </div>
                      </NftDropdown>
                    </DropdownPadding>
                  ) : null}
                </>
              )}
            </RightColWrapper>
          </Top>
          {currentAsset &&
          ((currentAsset?.collection?.total_supply && currentAsset.collection.total_supply > 2) ||
            !currentAsset.collection.total_supply) ? (
            <AssetMoreItems asset={currentAsset} />
          ) : null}
        </div>
      </div>
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
  isTestnet: boolean
}

export default connector(NftAsset)
