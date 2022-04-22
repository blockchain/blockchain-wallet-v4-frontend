import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import {
  AssetFilterFields,
  useAssetQuery,
  useAssetsQuery
} from 'blockchain-wallet-v4-frontend/src/generated/graphql'
import { useRemote } from 'blockchain-wallet-v4-frontend/src/hooks'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Exchange } from '@core'
import { RawOrder } from '@core/network/api/nfts/types'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import { WalletOptionsType } from '@core/types'
import {
  Button,
  Icon as BlockchainIcon,
  Link,
  TabMenu,
  TabMenuItem,
  Text,
  TextGroup
} from 'blockchain-info-components'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

import { NftPage } from '../components'

const CoinIcon = styled(BlockchainIcon).attrs({ className: 'coin-icon' })`
  margin-right: 8px;
  > img {
    height: 24px;
    width: 24px;
  }
`
const Wrapper = styled(NftPage)`
  display: block;
  margin: 0 auto;
  padding: 20px 0 0 0;
  box-sizing: border-box;
  ${media.atLeastTabletL`
    height: 100%;
  `}
  ${media.tabletL`
    flex-direction: column;
  `}
`
const Top = styled.div`
  ${media.atLeastTabletL`
  display: flex;
  `}
  display: block;
`

const LeftColWrapper = styled.div`
  ${media.atLeastTabletL`
  box-sizing: border-box;
  max-width: 625px;
  width: 50%;
  `} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
  padding-right: 3em;

  top: 64px;
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;
`

const RightColWrapper = styled.div`
  ${media.atLeastTabletL`
  height: 100%;
  width: 50%;
  `} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;
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

const MoreAssets = styled.div`
  width: 100%;
  position: sticky;
  height: 100%;
  top: 64px;
`

const MoreAssetsList = styled.div`
  display: flex;
  width: 100%;
  ${media.tabletL`
    flex-direction: column;
  `}
`

const MoreAssetsListItem = styled.div`
  width: 25%;
  ${media.tabletL`width: 100%;`}
`

const CollectionName = styled.div`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: left;
  color: ${colors.grey900};
`

const CustomLink = styled(LinkContainer)`
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`
const AssetName = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  display: flex;
  align-items: left;
  margin-top: 30px;
  color: ${colors.grey900};
`

const CurrentPriceBox = styled.div`
  border: 1px solid ${colors.grey000};
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 20px;
  padding: 1.2em;
`
const Highest = styled(Text)`
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  color: ${colors.grey600};
`

const CustomTabMenu = styled(TabMenu)`
  color: ${colors.grey900};
  margin: 24px 0;
  background: ${colors.grey000};
`

const EthText = styled(Highest)`
  font-size: 24px;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  color: ${colors.grey900};
`

const CountdownText = styled(EthText)`
  font-size: 20px;
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

const Divider = styled.hr`
  margin-bottom: unset;
  opacity: 0.3;
  color: ${colors.grey000};
`

const TraitsWrapper = styled.div`
  margin-top: 1.5em;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Trait = styled.div`
  display: flex;
  cursor: pointer;
  padding: 0.5em 1em;
  flex-direction: column;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.blue000};
  border: 1px solid ${(props) => props.theme.blue600};
  &:hover {
    transform: scale(1.02);
    -webkit-transition: transform 0.1s ease-in-out;
  }
`

const AddressDisplay = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 5em;
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

const DetailsAndOffers = styled.div`
  position: 'absolute';
  width: '38em';
`

const StickyWrapper = styled.div`
  position: sticky;
  top: 20px;
`

const NftAsset: React.FC<Props> = ({
  analyticsActions,
  defaultEthAddr,
  domains,
  formActions,
  nftsActions,
  routerActions,
  ...rest
}) => {
  const { contract, id } = rest.computedMatch.params
  // @ts-ignore
  const [asset] = useAssetQuery({
    variables: {
      filter: [
        { field: AssetFilterFields.ContractAddress, value: contract },
        { field: AssetFilterFields.TokenId, value: id }
      ]
    }
  })
  const [assets] = useAssetsQuery({
    variables: { filter: [{ field: AssetFilterFields.ContractAddress, value: contract }], limit: 4 }
  })
  const openSeaOrders = useRemote(selectors.components.nfts.getOpenSeaOrders)
  const [Tab, setTab] = useState('about')
  const [Countdown, setCountdown] = useState('')

  useEffect(() => {
    nftsActions.fetchOpenseaAsset({
      asset_contract_address: contract,
      token_id: id
    })
    nftsActions.fetchOpenSeaOrders({
      asset_contract_address: contract,
      token_id: id
    })
  }, [contract, id, nftsActions])

  const currentAsset = asset.data?.assets[0]
  const owner = currentAsset?.owners ? currentAsset.owners[0] : null
  const collectionName = currentAsset?.collection?.name || ''

  if (!currentAsset) return null

  let bids =
    openSeaOrders.data?.filter((x) => {
      return x.side === 0 && x.taker.address !== NULL_ADDRESS
    }, []) || []
  // Offers have taker as null address
  let offers =
    openSeaOrders.data?.filter((x) => {
      return x.side === 0 && x.taker.address === NULL_ADDRESS
    }, []) || []
  const sellOrders =
    openSeaOrders.data?.filter((x) => {
      return x.side === 1
    }) || []
  bids = bids.length
    ? bids.sort((a: any, b: any) => {
        return b.base_price - a.base_price
      })
    : []
  offers = offers.length
    ? offers.sort((a: any, b: any) => {
        return b.base_price - a.base_price
      })
    : []
  const bidsAndOffers = bids.concat(offers).sort((a: any, b: any) => {
    return b.base_price - a.base_price
  })
  if (offers.length < 1) offers = bids
  const highest_bid = bids[0]
  const highest_offer = offers[0]
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.base_price).isLessThan(b.base_price) ? -1 : 1
  )[0]
  if (
    (highest_bid && lowest_order && lowest_order?.expiration_time) ||
    (lowest_order && lowest_order?.expiration_time)
  ) {
    const countDownDate =
      highest_bid && lowest_order && lowest_order?.expiration_time
        ? lowest_order?.expiration_time * 1000 - 604800000 // subtract 7 days for auction
        : lowest_order?.expiration_time * 1000
    // Update the count down every 1 second
    setInterval(function () {
      const now = new Date().getTime()
      const duration = countDownDate - now
      const days = Math.floor(duration / (1000 * 60 * 60 * 24))
      const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((duration % (1000 * 60)) / 1000)
      // Display the result in the element with id="demo"
      setCountdown(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`)
      // if duration < 0, expired
    }, 1000)
  }

  return (
    <Wrapper>
      <>
        <div style={{ display: 'block' }}>
          <Top>
            <LeftColWrapper>
              <StickyWrapper>
                <img
                  alt='Asset Logo'
                  width='100%'
                  style={{
                    border: `1px solid ${colors.grey100}`,
                    borderRadius: '8px',
                    borderWidth: '1px',
                    boxShadow: `inset 0px 0px 10px 0px  ${colors.grey000}`,
                    boxSizing: 'border-box',
                    marginBottom: '0.5rem',
                    padding: '30px'
                  }}
                  src={currentAsset.image_url || ''}
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Socials>
                    <SocialLink>
                      <CopyClipboardButton
                        color='grey600'
                        textToCopy={`${domains.comWalletApp}/#/nfts/${contract}/${id}`}
                        onClick={() =>
                          analyticsActions.trackEvent({
                            key: Analytics.NFT_SHARE_CLICKED,
                            properties: {}
                          })
                        }
                      />
                    </SocialLink>
                    {owner?.address === defaultEthAddr && (
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
                              token_id: id,
                              walletUserIsAssetOwnerHack: false
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
                <div style={{ display: 'block' }}>
                  <Text
                    size='14px'
                    weight={600}
                    style={{
                      alignItems: 'center',
                      lineHeight: '20px',
                      padding: '0em 0em 1em 0em'
                    }}
                  >
                    Collection
                  </Text>
                  <CustomLink to={`/nfts/collection/${currentAsset.collection?.slug}`}>
                    <CollectionName>
                      <img
                        alt='Dapp Logo'
                        height='30px'
                        width='auto'
                        style={{
                          borderRadius: '50%',
                          paddingRight: '2px'
                        }}
                        src={currentAsset.collection?.image_url || ''}
                      />
                      <div style={{ lineHeight: '2em', paddingLeft: '0.5em' }}>
                        {currentAsset.collection?.name}
                      </div>
                    </CollectionName>
                  </CustomLink>
                </div>
              </div>
              <AssetName>
                {currentAsset.name || `${currentAsset.collection?.name}${' #'}`}
              </AssetName>
              {owner?.address ? (
                <TextGroup inline style={{ marginTop: '24px' }}>
                  <Text size='16px' color='grey600' weight={600}>
                    <FormattedMessage id='copy.owned_by' defaultMessage='Owned by' />
                  </Text>
                  {owner?.address !== defaultEthAddr ? (
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
                {highest_bid ? (
                  <>
                    <Highest>
                      <div style={{ marginBottom: '1em' }}>
                        Sale ends{' '}
                        {moment(lowest_order?.expiration_time * 1000)
                          .subtract(7, 'day')
                          .from(moment())}
                        :
                      </div>
                      <CountdownText>{Countdown}</CountdownText>
                    </Highest>
                    <Divider style={{ marginBottom: '1em' }} />
                    <Highest>Top Bid</Highest>
                    <EthText>
                      <CoinIcon name={bidsAndOffers[0].payment_token_contract.symbol || 'ETH'} />
                      <CoinDisplay
                        weight={600}
                        color={colors.grey900}
                        size='24px'
                        coin={bidsAndOffers[0].payment_token_contract.symbol}
                      >
                        {bidsAndOffers[0].base_price}
                      </CoinDisplay>
                      &nbsp;{' '}
                      <Text size='16px' weight={500} style={{ display: 'flex' }} color='grey500'>
                        (
                        <FiatDisplay
                          weight={500}
                          currency='USD'
                          color='grey500'
                          size='16px'
                          coin={bidsAndOffers[0].payment_token_contract.symbol}
                        >
                          {bidsAndOffers[0].base_price}
                        </FiatDisplay>
                        )
                      </Text>
                    </EthText>
                  </>
                ) : lowest_order ? (
                  <>
                    <Highest>
                      <div style={{ marginBottom: '1em' }}>
                        Sale ends {moment(lowest_order?.expiration_time * 1000).from(moment())}:
                      </div>
                      <CountdownText>{Countdown}</CountdownText>
                    </Highest>
                    <Divider style={{ marginBottom: '1em' }} />
                    <Highest>Current Price</Highest>
                    <EthText>
                      <CoinIcon name={lowest_order.payment_token_contract.symbol || 'ETH'} />
                      <CoinDisplay
                        weight={600}
                        color={colors.grey900}
                        size='24px'
                        coin={lowest_order.payment_token_contract.symbol}
                      >
                        {lowest_order.base_price}
                      </CoinDisplay>
                      &nbsp;{' '}
                      <Text size='16px' weight={500} style={{ display: 'flex' }} color='grey500'>
                        (
                        <FiatDisplay
                          weight={500}
                          currency='USD'
                          color='grey500'
                          size='16px'
                          coin={lowest_order.payment_token_contract.symbol}
                        >
                          {lowest_order.base_price}
                        </FiatDisplay>
                        )
                      </Text>
                    </EthText>
                  </>
                ) : highest_offer ? (
                  <>
                    <Highest>Highest Offer</Highest>
                    <EthText>
                      <CoinIcon name={highest_offer.payment_token_contract.symbol || 'ETH'} />
                      <CoinDisplay
                        weight={600}
                        color={colors.grey900}
                        size='24px'
                        coin={highest_offer.payment_token_contract.symbol}
                      >
                        {highest_offer.base_price}
                      </CoinDisplay>
                      &nbsp;{' '}
                      <Text size='16px' weight={500} style={{ display: 'flex' }} color='grey500'>
                        (
                        <FiatDisplay
                          weight={500}
                          currency='USD'
                          color='grey500'
                          size='16px'
                          coin={highest_offer.payment_token_contract.symbol}
                        >
                          {highest_offer.base_price}
                        </FiatDisplay>
                        )
                      </Text>
                    </EthText>
                  </>
                ) : null}
                {owner?.address === defaultEthAddr && (
                  <Button
                    data-e2e='openNftFlow'
                    nature='primary'
                    jumbo
                    onClick={() => {
                      nftsActions.nftOrderFlowOpen({
                        asset_contract_address: contract,
                        step: NftOrderStepEnum.MARK_FOR_SALE,
                        token_id: id,
                        walletUserIsAssetOwnerHack: false
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
                    <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark For Sale' />
                  </Button>
                )}
                {lowest_order ? (
                  <div style={{ display: 'flex' }}>
                    <Button
                      data-e2e='openNftFlow'
                      nature='primary'
                      jumbo
                      style={{ marginRight: '1em', width: '10em' }}
                      onClick={() => {
                        nftsActions.nftOrderFlowOpen({
                          asset_contract_address: contract,
                          order: lowest_order as RawOrder,
                          step: NftOrderStepEnum.BUY,
                          token_id: id,
                          walletUserIsAssetOwnerHack: false
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
                    <Button
                      data-e2e='openNftFlow'
                      nature='dark'
                      jumbo
                      style={{ width: '10em' }}
                      onClick={() => {
                        nftsActions.nftOrderFlowOpen({
                          asset_contract_address: contract,
                          step: NftOrderStepEnum.MAKE_OFFER,
                          token_id: id,
                          walletUserIsAssetOwnerHack: false
                        })
                        analyticsActions.trackEvent({
                          key: Analytics.NFT_MAKE_AN_OFFER_CLICKED,
                          properties: {}
                        })
                      }}
                    >
                      <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                    </Button>
                  </div>
                ) : (
                  <Button
                    data-e2e='openNftFlow'
                    nature='primary'
                    jumbo
                    style={{ width: '20em' }}
                    onClick={() => {
                      nftsActions.nftOrderFlowOpen({
                        asset_contract_address: contract,
                        step: NftOrderStepEnum.MAKE_OFFER,
                        token_id: id,
                        walletUserIsAssetOwnerHack: false
                      })
                      analyticsActions.trackEvent({
                        key: Analytics.NFT_MAKE_AN_OFFER_CLICKED,
                        properties: {}
                      })
                    }}
                  >
                    <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                  </Button>
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

                        // const assetTraits = currentAsset.traits?.find(
                        //   (t) => t?.trait_type === trait.trait_type
                        // )
                        // const traitCount = assetTraits?.trait_count
                        // const traitMaxVal = assetTraits?.max_value
                        // const rarity =
                        //   traitCount && traitMaxVal ? `${(traitCount / traitMaxVal) * 100}%` : 'N/A'

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
                            {/* <Text capitalize color='grey900' size='12px' weight={500}>
                                    {rarity}
                                  </Text> */}
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
                      <Text size='16px' weight={500} color='grey600'>
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
              {Tab === 'offers' && bidsAndOffers.length > 0 && (
                <DetailsAndOffers>
                  <div
                    style={{
                      color: colors.grey600,
                      display: 'flex',
                      fontFamily: 'Inter, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      gap: '4em',
                      padding: '0.5em'
                    }}
                  >
                    <div style={{ width: '5em' }}>Price</div>
                    <div style={{ width: '5em' }}>USD Price</div>
                    <div style={{ width: '5em' }}>Expiration</div>
                    <div style={{ paddingLeft: '1em', width: '5em' }}>From</div>
                  </div>
                  <Divider style={{ marginBottom: '1em' }} />
                </DetailsAndOffers>
              )}
              {Tab === 'offers' &&
                bidsAndOffers.length > 0 &&
                bidsAndOffers?.map((offer, index) => {
                  const coin = Exchange.convertCoinToCoin({
                    coin: offer.payment_token_contract.symbol || 'ETH',
                    value: offer?.base_price
                  })
                  return (
                    <div
                      style={{
                        color: colors.grey600,
                        display: 'flex',
                        fontFamily: 'Inter, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        gap: '4em',
                        padding: '0.5em'
                      }}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                    >
                      <div style={{ display: 'flex', paddingRight: '0.2em', width: '5em' }}>
                        <AddressDisplay>{coin}</AddressDisplay>{' '}
                        {offer?.payment_token_contract?.symbol}
                      </div>
                      <div style={{ width: '5em' }}>
                        <FiatDisplay
                          weight={500}
                          currency='USD'
                          size='16px'
                          coin={offer.payment_token_contract.symbol}
                        >
                          {offer.base_price}
                        </FiatDisplay>
                      </div>
                      <div style={{ width: '7em' }}>
                        {moment(offer?.expiration_time * 1000).from(moment())}{' '}
                      </div>
                      <div style={{ width: '5em' }}>
                        <Link
                          href={`https://www.blockchain.com/eth/address/${offer?.maker?.address}`}
                          target='_blank'
                        >
                          <AddressDisplay>{offer?.maker?.address} </AddressDisplay>
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </RightColWrapper>
          </Top>
          <div style={{ display: 'flex' }}>
            <MoreAssets>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '40px'
                }}
              >
                <Text color={colors.grey700} weight={600} capitalize>
                  More from this collection
                </Text>
                <CustomLink to={`/nfts/collection/${currentAsset.collection?.slug}`}>
                  <Button data-e2e='goToCollection' nature='empty-blue' padding='1em'>
                    See All
                  </Button>
                </CustomLink>
              </div>
              <MoreAssetsList>
                {assets?.data?.assets?.length
                  ? assets?.data?.assets?.map((asset) => {
                      const link = `/nfts/asset/${currentAsset.contract?.address}/${asset.token_id}`
                      return (
                        <MoreAssetsListItem key={asset.token_id}>
                          <CustomLink
                            to={link}
                            style={{
                              border: `1px solid ${colors.grey100}`,
                              borderRadius: '10%',
                              borderWidth: '1px',
                              boxSizing: 'border-box',
                              justifyContent: 'center',
                              margin: '1em',
                              padding: '10px'
                            }}
                          >
                            <div>
                              <CollectionName
                                style={{ justifyContent: 'center', paddingBottom: 'unset' }}
                              >
                                <img
                                  alt='Dapp Logo'
                                  height='30px'
                                  width='auto'
                                  style={{
                                    borderRadius: '50%',
                                    marginBottom: '0.5rem',
                                    paddingRight: '2px'
                                  }}
                                  src={asset.collection?.image_url || ''}
                                />
                                <div style={{ lineHeight: '2em', paddingLeft: '0.5em' }}>
                                  {asset.collection?.name}
                                </div>
                              </CollectionName>
                              <img
                                alt='Asset Logo'
                                width='100%'
                                height='auto'
                                style={{
                                  borderRadius: '10%',
                                  boxSizing: 'border-box',
                                  marginBottom: '0.5rem'
                                }}
                                src={asset.image_url || ''}
                              />
                              <Text
                                style={{ textAlign: 'center' }}
                                size='14px'
                                weight={600}
                                capitalize
                              >
                                {asset.name || asset.token_id}
                              </Text>
                            </div>
                          </CustomLink>
                        </MoreAssetsListItem>
                      )
                    })
                  : null}
              </MoreAssetsList>
            </MoreAssets>
          </div>
        </div>
      </>
      )
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    comWalletApp: 'https://login.blockchain.com'
  } as WalletOptionsType['domains'])
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
