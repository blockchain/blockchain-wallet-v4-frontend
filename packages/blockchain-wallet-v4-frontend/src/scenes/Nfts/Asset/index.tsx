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
import moment from 'moment'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Exchange } from '@core'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import {
  Button,
  Icon as BlockchainIcon,
  Link,
  SpinningLoader,
  TabMenu,
  TabMenuItem,
  Text,
  TextGroup
} from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { RootState } from 'data/rootReducer'
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
  margin-right: 2em;

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

const MoreAssets = styled.div`
  width: 100%;
  position: sticky;
  height: 100%;
  top: 64px;
`

const MoreAssetsList = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
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
  border: 1px solid ${colors.grey0};
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
  background: white;
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
  color: ${colors.grey0};
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
  border: 1px solid ${colors.grey0};
  border-radius: 8px;
  margin-top: 24px;
`

const Detail = styled(Text)`
  display: flex;
  justify-content: space-between;
  color: ${colors.grey900};
  padding: 1em 1.5em;
  border-bottom: 1px solid ${colors.grey0};
  font-size: 16px;
  font-weight: 500;
  &:last-child {
    border-bottom: none;
  }
`

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
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
  defaultEthAddr,
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
    variables: { filter: [{ field: AssetFilterFields.ContractAddress, value: contract }] }
  })
  const [Tab, setTab] = useState('details')
  const [Countdown, setCountdown] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const WETH_ADDRESS = window.coins.WETH.coinfig.type.erc20Address!
  useEffect(() => {
    nftsActions.fetchOpenseaAsset({
      address: contract,
      token_id: id
    })
  }, [])

  const currentAsset = asset.data?.assets[0]
  const owner = currentAsset?.owners ? currentAsset.owners[0] : null

  if (!currentAsset) return null

  return (
    <Wrapper>
      {rest.openSeaAsset.cata({
        Failure: () => <Text size='40px'>404 Not Found</Text>,
        Loading: () => (
          <>
            <LoadingWrapper>
              <SpinningLoader width='28px' height='28px' borderWidth='6px' />
              <Text weight={600} size='14px' color='grey600' style={{ marginTop: '12px' }}>
                <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
              </Text>
            </LoadingWrapper>
          </>
        ),
        NotAsked: () => (
          <>
            <LoadingWrapper>
              <SpinningLoader width='28px' height='28px' borderWidth='6px' />
              <Text weight={600} size='14px' color='grey600' style={{ marginTop: '12px' }}>
                <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
              </Text>
            </LoadingWrapper>
          </>
        ),
        Success: (assetFromDirectCall) => {
          let bids =
            assetFromDirectCall.orders?.filter((x) => {
              return x.side === 0 && x.taker.address !== NULL_ADDRESS
            }, []) || []
          // Offers have taker as null address
          let offers =
            assetFromDirectCall.orders?.filter((x) => {
              return x.side === 0 && x.taker.address === NULL_ADDRESS
            }, []) || []
          const sellOrders =
            assetFromDirectCall.orders?.filter((x) => {
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
                          borderRadius: '10%',
                          borderWidth: '1px',
                          boxSizing: 'border-box',
                          marginBottom: '0.5rem',
                          padding: '10px'
                        }}
                        src={currentAsset.image_url || ''}
                      />
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
                      <CustomLink to={`/nfts/${currentAsset.collection?.slug}`}>
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
                    <AssetName>
                      {currentAsset.name || `${currentAsset.collection?.name}${' #'}`}
                    </AssetName>
                    {owner?.address ? (
                      <TextGroup inline style={{ marginTop: '24px' }}>
                        <Text size='16px' color='grey600' weight={600}>
                          <FormattedMessage id='copy.owner' defaultMessage='Owner' />
                        </Text>
                        <Text
                          color='blue600'
                          weight={600}
                          cursor='pointer'
                          onClick={() => routerActions.push(`/nfts/address/${owner.address}`)}
                        >
                          <CryptoAddress>{owner.address}</CryptoAddress>
                        </Text>
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
                            <CoinIcon
                              name={bidsAndOffers[0].payment_token_contract.symbol || 'ETH'}
                            />
                            <CoinDisplay
                              weight={600}
                              color={colors.grey900}
                              size='24px'
                              coin={bidsAndOffers[0].payment_token_contract.symbol}
                            >
                              {bidsAndOffers[0].base_price}
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
                              Sale ends{' '}
                              {moment(lowest_order?.expiration_time * 1000).from(moment())}:
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
                            <Text
                              size='16px'
                              weight={500}
                              style={{ display: 'flex' }}
                              color='grey500'
                            >
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
                            <Text
                              size='16px'
                              weight={500}
                              style={{ display: 'flex' }}
                              color='grey500'
                            >
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
                      <Button
                        data-e2e='openNftFlow'
                        nature='primary'
                        jumbo
                        fullwidth
                        onClick={() => {
                          if (lowest_order) {
                            nftsActions.nftOrderFlowOpen({
                              asset_contract_address: contract,
                              order: lowest_order,
                              step: NftOrderStepEnum.BUY,
                              token_id: id,
                              walletUserIsAssetOwnerHack: false
                            })
                          } else {
                            nftsActions.nftOrderFlowOpen({
                              asset_contract_address: contract,
                              step: NftOrderStepEnum.MAKE_OFFER,
                              token_id: id,
                              walletUserIsAssetOwnerHack: false
                            })
                          }
                        }}
                      >
                        {highest_bid ? (
                          <FormattedMessage id='copy.place_an_bid' defaultMessage='Place Bid' />
                        ) : lowest_order ? (
                          <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                        ) : (
                          <FormattedMessage
                            id='copy.make_an_offer'
                            defaultMessage='Make an Offer'
                          />
                        )}
                      </Button>
                    </CurrentPriceBox>
                    <CustomTabMenu>
                      <TabMenuItem
                        width='33%'
                        onClick={() => setTab('details')}
                        selected={Tab === 'details'}
                      >
                        <FormattedMessage id='copy.day' defaultMessage='Details' />
                      </TabMenuItem>
                      <TabMenuItem
                        width='33%'
                        onClick={() => setTab('offers')}
                        selected={Tab === 'offers'}
                      >
                        <FormattedMessage id='copy.week' defaultMessage='Offers' />
                      </TabMenuItem>
                      <TabMenuItem
                        width='33%'
                        onClick={() => setTab('history')}
                        selected={Tab === 'history'}
                      >
                        <FormattedMessage id='copy.week' defaultMessage='History' />
                      </TabMenuItem>
                    </CustomTabMenu>
                    {Tab === 'details' && (
                      <DetailsAndOffers>
                        {currentAsset.traits?.length ? (
                          <TraitsWrapper>
                            {currentAsset.traits.map((trait) => {
                              if (!trait) return null

                              const assetTraits = assetFromDirectCall.traits.find(
                                (t) => t.trait_type === trait.trait_type
                              )
                              const traitCount = assetTraits?.trait_count
                              const traitMaxVal = assetTraits?.trait_max_value
                              const rarity =
                                traitCount && traitMaxVal
                                  ? `${(traitCount / traitMaxVal) * 100}%`
                                  : 'N/A'

                              return (
                                <Trait
                                  key={trait.value}
                                  onClick={() => {
                                    routerActions.push(`/nfts/${currentAsset.collection.slug}`)
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
                            <Text size='16px' weight={600} color={colors.grey900}>
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

                            <TokenDisplay size='16px' weight={600} color={colors.grey900}>
                              {currentAsset.token_id}{' '}
                            </TokenDisplay>
                          </Detail>
                          <Detail>
                            <Text size='16px' weight={500} color='grey900'>
                              Token Standard
                            </Text>{' '}
                            <Text size='16px' weight={600} color={colors.grey900}>
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
                      (bidsAndOffers.length ? (
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
                                {offer?.payment_token_contract?.address === WETH_ADDRESS
                                  ? 'WETH'
                                  : 'ETH'}
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
                        })
                      ) : (
                        <Text>No offers made on this asset (yet!)</Text>
                      ))}
                    {Tab === 'history' && <Text>No history available for this asset.</Text>}
                  </RightColWrapper>
                </Top>
                <div style={{ display: 'flex' }}>
                  <MoreAssets>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '5em 1em 1em 1em'
                      }}
                    >
                      <Text
                        color={colors.grey700}
                        capitalize
                        style={{ fontWeight: 'bold', padding: '1em', width: 'fit-content' }}
                      >
                        More from this collection
                      </Text>
                      <CustomLink to={`/nfts/${currentAsset.collection?.slug}`}>
                        <Button
                          data-e2e='goToCollection'
                          nature='empty-blue'
                          width='10%'
                          padding='1em'
                        >
                          See All
                        </Button>
                      </CustomLink>
                    </div>
                    <MoreAssetsList>
                      {assets?.data?.assets?.length // @ts-ignore
                        ? assets?.data?.assets?.slice(0, 5).map((asset, index) => {
                            const link = `${'/nfts/'}${currentAsset.contract?.address}/${
                              currentAsset.token_id
                            }`
                            return (
                              <CustomLink
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                to={link}
                                onClick={() => {
                                  nftsActions.fetchOpenseaAsset({
                                    address: currentAsset.contract?.address || '',
                                    token_id: currentAsset.token_id || ''
                                  })
                                }}
                                style={{
                                  border: `1px solid ${colors.grey100}`,
                                  borderRadius: '10%',
                                  borderWidth: '1px',
                                  boxSizing: 'border-box',
                                  justifyContent: 'center',
                                  margin: '1em',
                                  marginBottom: '0.5rem',
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
                                      src={currentAsset.collection?.image_url || ''}
                                    />
                                    <div style={{ lineHeight: '2em', paddingLeft: '0.5em' }}>
                                      {currentAsset.collection?.name}
                                    </div>
                                  </CollectionName>
                                  <img
                                    alt='Asset Logo'
                                    height='200px'
                                    width='auto'
                                    style={{
                                      borderRadius: '10%',
                                      boxSizing: 'border-box',
                                      marginBottom: '0.5rem'
                                    }}
                                    src={currentAsset.image_url || ''}
                                  />
                                  <Text
                                    style={{ textAlign: 'center' }}
                                    size='14px'
                                    weight={600}
                                    capitalize
                                  >
                                    {currentAsset.name || currentAsset.token_id}
                                  </Text>
                                </div>
                              </CustomLink>
                            )
                          })
                        : null}
                    </MoreAssetsList>
                  </MoreAssets>
                </div>
              </div>
            </>
          )
        }
      })}
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  openSeaAsset: selectors.components.nfts.getOpenSeaAsset(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { contract: string; id: string } }
}

export default connector(NftAsset)
