import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import { useAssetQuery, useAssetsQuery } from 'blockchain-wallet-v4-frontend/src/generated/graphql'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Exchange } from '@core'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/utils'
import {
  Button,
  Color,
  Icon,
  Image,
  SpinningLoader,
  TabMenu,
  TabMenuItem,
  Text
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

export const CoinIcon = styled(Icon).attrs({ className: 'coin-icon' })``

const Wrapper = styled.div`
  ${media.atLeastTabletL`
  background-color: ${colors.white1};
  height: 50%;
  min-height: 100%;
  width: 100%;
  padding: 1em;
  overflow: auto;
  display: flex;
  flex-direction: columns;
  `}
  display: block;
  height: 100%;
`
export const LeftColWrapper = styled.div`
  ${media.atLeastTabletL`
  top: 72px;
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
  position: sticky;
  padding-right: 3em;
  margin-right: 2em;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;
`

export const RightColWrapper = styled.div`
  ${media.atLeastTabletL`
  top: 72px;
  margin-right: 20px;
  max-width: 500px;
  width: 40%;
  `} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  overflow-x: hidden;
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;
`

export const MoreAssets = styled.div`
  ${media.atLeastTabletL`
  width: 20%;
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  `}
  width: 100%;
`

const CollectionName = styled.div`
  padding-bottom: 1em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  display: flex;
  align-items: left;
  color: ${colors.grey900};
`

const AssetName = styled.div`
  height: 20px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 125%;
  display: flex;
  align-items: left;
  color: ${colors.grey900};
`

const PriceHistoryTitle = styled(AssetName)`
  font-size: 24px;
  line-height: 135%;
  padding: 2em 0em 2em 0em;
`

const PriceHistory = styled(PriceHistoryTitle)`
  font-size: 14px;
  height: 340px;
  background: ${colors.grey0};
  opacity: 0.2;
  padding: 2em;
  border: 1px solid ${colors.grey0};
  box-sizing: border-box;
  border-radius: 8px;
`

const CurrentPriceBox = styled.div`
  border: 1px solid ${colors.grey0};
  box-sizing: border-box;
  border-radius: 8px;
  padding: 1em;
`
const Highest = styled.div`
  padding: 0.5em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #677184;
`

const CustomTabMenu = styled(TabMenu)`
  color: ${colors.grey900};
  margin: 1em 0em 1em 0em;
  background: white;
`

const EthText = styled(Highest)`
  font-size: 24px;
  display: flex;
  line-height: 135%;
  color: ${colors.grey900};
`

const CreatorOwnerBox = styled(CurrentPriceBox)`
  margin-top: 2em;
  max-width: 100%;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding: 1em;
`

const CreatorOwnerAddress = styled.div`
  font-size: 16px;
  line-height: 150%;
  color: #828b9e;
  overflow: hidden;
  padding-left: 1em;
`

const Divider = styled.hr`
  margin-bottom: 2em;
  position: static;
  width: 100%;
  left: 48px;
  top: 51px;
  opacity: 0.3;
  color: ${colors.grey0};
`

const DividerNoMargin = styled(Divider)`
  margin-bottom: unset;
`

const Description = styled.div`
  padding: 3em 0em 3em 0em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #677184;
`

const TraitsWrapper = styled(CurrentPriceBox)`
  margin-top: 2em;
  padding: 1em;
  height: unset;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: #677184;
`
const TraitCell = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 100%;
`

const Trait = styled.div`
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  background: rgba(240, 242, 247, 0.4);
  border-radius: 8px;
`

const AddressDisplay = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 90%;
`

const AdditionalDetailsWrapper = styled(TraitsWrapper)``

const AdditionalDetails = styled.div`
  padding: 1em;
  color: #828b9e;
`

const SocialLinksWrap = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  border-radius: 20px;
`

const SocialLinks = styled.a.attrs({
  target: '_blank'
})`
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  background-color: ${Color('white')} !important;
  color: white;
  transition: all 0.5s;
  margin-right: 0.5rem;
  justify-content: center;

  .social-icons {
    opacity: 0.5;
  }

  &:hover {
    .social-icons {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 48rem) {
    height: 2rem;
    width: 2rem;
    margin-top: 2rem;

    img {
      padding: 0.5rem;
    }
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

const NftAsset: React.FC<Props> = ({ defaultEthAddr, nftsActions, ...rest }) => {
  const { contract, id } = rest.computedMatch.params
  // @ts-ignore
  const [asset] = useAssetQuery({
    variables: { filter: { contract_address: contract, token_id: id } }
  })
  const [assets] = useAssetsQuery({
    variables: { filter: { contract_address: contract } }
  })
  const [Tab, setTab] = useState('details')

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const WETH_ADDRESS = window.coins.WETH.coinfig.type.erc20Address!
  useEffect(() => {
    nftsActions.fetchOpenseaAsset({
      address: asset?.data?.asset?.contract_address || contract,
      token_id: asset.data?.asset?.token_id || id
    })
  }, [])
  return (
    <>
      {rest.openSeaAsset.cata({
        Failure: () => <Text size='40px'>404 Not Found</Text>,
        Loading: () => (
          <>
            <LoadingWrapper>
              <SpinningLoader />
              <Text weight={600} color='grey600' style={{ marginLeft: '8px' }}>
                <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
              </Text>
            </LoadingWrapper>
          </>
        ),
        NotAsked: () => (
          <>
            <LoadingWrapper>
              <SpinningLoader />
              <Text weight={600} color='grey600' style={{ marginLeft: '8px' }}>
                <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
              </Text>
            </LoadingWrapper>
          </>
        ),
        Success: (assetFromDirectCall) => {
          let bids = assetFromDirectCall.orders.filter((x) => {
            return x.side === 0 && x.taker.address !== NULL_ADDRESS
          }, [])
          // Offers have taker as null address
          let offers = assetFromDirectCall.orders.filter((x) => {
            return x.side === 0 && x.taker.address === NULL_ADDRESS
          }, [])
          // const sellOrders = assetFromDirectCall.orders.filter((x) => {
          //   return x.side === 1 && x.maker.address ===
          // })
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
          const highest_bid = bids[0]
          const highest_offer = offers[0]
          const coin = Exchange.convertCoinToCoin({
            coin: 'ETH',
            value: highest_bid?.base_price || highest_offer?.base_price
          })
          // eslint-disable-next-line no-console
          console.log(highest_bid, 'highest_bid')
          // eslint-disable-next-line no-console
          console.log(highest_offer, 'highest_offer')
          return (
            <Wrapper>
              <LeftColWrapper>
                <img
                  alt='Asset Logo'
                  width='100%'
                  style={{
                    border: '1px solid #dfe3eb',
                    borderRadius: '10%',
                    borderWidth: '1px',
                    marginBottom: '0.5rem',
                    padding: '10px'
                  }}
                  src={asset?.data?.asset?.image_url || ''}
                />
                <PriceHistoryTitle>Price History</PriceHistoryTitle>
                <Divider />
                <PriceHistory />
              </LeftColWrapper>
              <RightColWrapper>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <CollectionName>
                    <img
                      alt='Dapp Logo'
                      height='30px'
                      width='auto'
                      style={{ borderRadius: '50%', marginBottom: '0.5rem', paddingRight: '2px' }}
                      src={asset?.data?.asset?.collection?.image_url || ''}
                    />
                    <div style={{ lineHeight: '2em', paddingLeft: '0.5em' }}>
                      {asset?.data?.asset?.collection?.name}
                    </div>
                  </CollectionName>
                  <SocialLinksWrap>
                    {asset?.data?.asset?.collection?.telegram_url && (
                      <SocialLinks
                        href={`${'https://t.me/'}${asset?.data?.asset?.collection?.telegram_url}`}
                      >
                        <Image color='grey500' name='smartphone' />
                      </SocialLinks>
                    )}
                    {asset?.data?.asset?.collection?.twitter_username && (
                      <SocialLinks
                        href={`${'https://twitter.com/'}${
                          asset?.data?.asset?.collection?.twitter_username
                        }`}
                      >
                        <Image color='grey500' name='email-success' />
                      </SocialLinks>
                    )}
                    {asset?.data?.asset?.collection?.instagram_username && (
                      <SocialLinks
                        href={`${'http://instagram.com/'}${
                          asset?.data?.asset?.collection?.instagram_username
                        }`}
                      >
                        <Image color='grey500' name='instagram' />
                      </SocialLinks>
                    )}
                    {asset?.data?.asset?.collection?.wiki_url && (
                      <SocialLinks
                        href={`${'https://en.wikipedia.org/wiki/'}${
                          asset?.data?.asset?.collection?.instagram_username
                        }`}
                      >
                        <Image color='grey500' name='globe' />
                      </SocialLinks>
                    )}
                    {asset?.data?.asset?.collection?.external_url && (
                      <SocialLinks href={asset?.data?.asset?.collection?.external_url}>
                        <Image color='grey500' name='world-alert' />
                      </SocialLinks>
                    )}
                  </SocialLinksWrap>
                </div>
                <Divider />
                <AssetName>
                  {asset?.data?.asset?.name || `${asset?.data?.asset?.collection?.name}${' #'}`}
                </AssetName>
                <Description>{asset?.data?.asset?.collection?.description}</Description>
                <CurrentPriceBox>
                  {highest_bid && (
                    <>
                      <Highest>Highest Bid</Highest>
                      <EthText>
                        <CoinIcon name='ETH' style={{ padding: '0.5em' }} />
                        {coin}{' '}
                        {highest_bid.payment_token_contract.address === WETH_ADDRESS
                          ? 'WETH'
                          : 'ETH'}
                      </EthText>
                    </>
                  )}
                  {highest_offer && (
                    <>
                      <Highest>Highest Offer</Highest>
                      <EthText>
                        <CoinIcon name='ETH' style={{ padding: '0.5em' }} />
                        {coin}{' '}
                        {highest_offer.payment_token_contract.address === WETH_ADDRESS
                          ? 'WETH'
                          : 'ETH'}
                      </EthText>
                    </>
                  )}
                  <Button
                    data-e2e='openNftFlow'
                    nature='primary'
                    fullwidth
                    onClick={() =>
                      nftsActions.nftOrderFlowOpen({
                        // @ts-ignore
                        asset_contract_address: asset.data.asset.contract_address!,
                        // @ts-ignore
                        token_id: asset.data.asset.token_id!,
                        walletUserIsAssetOwnerHack: false
                      })
                    }
                  >
                    {asset?.data?.asset?.events &&
                    asset?.data?.asset?.events[0] &&
                    asset?.data?.asset?.events &&
                    asset?.data?.asset?.events[0].event_type === 'created' ? (
                      <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                    ) : (
                      <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
                    )}
                  </Button>
                </CurrentPriceBox>
                <Divider style={{ marginTop: '2em' }} />
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
                <Divider style={{ marginTop: '2em' }} />
                {Tab === 'details' && (
                  <>
                    <TraitsWrapper>
                      Traits
                      <TraitCell>
                        {asset?.data?.asset?.traits?.length
                          ? asset?.data?.asset?.traits.map((traits, index) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <Trait key={index}>
                                <Text
                                  capitalize
                                  color='grey500'
                                  size='12px'
                                  weight={500}
                                  style={{ padding: '0.5em' }}
                                >
                                  <b>{traits?.trait_type}</b>
                                </Text>
                                <Text
                                  capitalize
                                  color='blue600'
                                  size='14px'
                                  weight={600}
                                  style={{ padding: '0.5em' }}
                                >
                                  {traits?.value}
                                </Text>
                                <Text
                                  capitalize
                                  color='grey500'
                                  size='12px'
                                  weight={400}
                                  style={{ padding: '0.5em' }}
                                >
                                  0.1% Rarity
                                </Text>
                              </Trait>
                            ))
                          : null}
                      </TraitCell>
                    </TraitsWrapper>
                    <CreatorOwnerBox>
                      <div style={{ color: '#677184', padding: '1em' }}>Creator Address:</div>
                      <div style={{ display: 'flex', paddingLeft: '1em' }}>
                        {asset?.data?.asset?.creator?.profile_img_url && (
                          <img
                            alt='Creator Logo'
                            height='30px'
                            width='auto'
                            style={{ borderRadius: '50%', marginBottom: '0.5rem' }}
                            src={asset?.data?.asset?.creator?.profile_img_url}
                          />
                        )}
                        <CreatorOwnerAddress>
                          <AddressDisplay>{asset?.data?.asset?.creator?.address}</AddressDisplay>
                        </CreatorOwnerAddress>
                      </div>
                      <DividerNoMargin />
                      <div style={{ color: '#677184', padding: '1em' }}>Owner Address:</div>
                      <div style={{ display: 'flex', paddingLeft: '1em' }}>
                        <img
                          alt='Owner Logo'
                          height='30px'
                          width='auto'
                          style={{ borderRadius: '50%', marginBottom: '0.5rem' }}
                          src={asset?.data?.asset?.owner?.profile_img_url || ''}
                        />{' '}
                        <CreatorOwnerAddress>
                          <AddressDisplay>{asset?.data?.asset?.owner?.address}</AddressDisplay>
                        </CreatorOwnerAddress>
                      </div>
                    </CreatorOwnerBox>
                    <AdditionalDetailsWrapper>
                      Additional Details
                      <AdditionalDetails>
                        <div style={{ padding: '1em' }}>
                          <Text weight={500} size='16px'>
                            Contract Address:
                          </Text>
                          <AddressDisplay>{asset?.data?.asset?.contract_address}</AddressDisplay>
                        </div>
                        <DividerNoMargin />
                        <div style={{ padding: '1em' }}>
                          <Text weight={500} size='16px'>
                            Token ID:
                          </Text>
                          {asset?.data?.asset?.token_id}
                        </div>
                        <DividerNoMargin />
                        <div style={{ padding: '1em' }}>
                          <Text weight={500} size='16px'>
                            Token Standard:
                          </Text>{' '}
                          {asset?.data?.asset?.asset_contract?.schema_name}
                        </div>
                        <DividerNoMargin />
                        <div style={{ padding: '1em' }}>
                          <Text weight={500} size='16px'>
                            Blockchain:
                          </Text>{' '}
                          ETH
                        </div>
                      </AdditionalDetails>
                    </AdditionalDetailsWrapper>
                  </>
                )}
                {Tab === 'offers' &&
                  (offers.length ? (
                    offers?.map((offer, index) => {
                      const coin = Exchange.convertCoinToCoin({
                        coin: 'ETH',
                        value: offer?.base_price
                      })
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5em'
                          }}
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                        >
                          <Text>
                            {coin}{' '}
                            {offer?.payment_token_contract?.address === WETH_ADDRESS
                              ? 'WETH'
                              : 'ETH'}
                          </Text>{' '}
                          <Text>
                            {'Expires: '}
                            {moment.unix(offer.expiration_time).format('YYYY-MM-DD')}{' '}
                          </Text>
                        </div>
                      )
                    })
                  ) : (
                    <Text>No offers made on this asset (yet!)</Text>
                  ))}
                {Tab === 'history' && <Text>No history available for this asset.</Text>}
              </RightColWrapper>
              <MoreAssets>
                <Text
                  capitalize
                  style={{ fontWeight: 'bold', padding: '1em', textDecoration: 'underline' }}
                >
                  More from this collection...
                </Text>
                <div>
                  {assets?.data?.assets?.length // @ts-ignore
                    ? assets?.data?.assets?.map((asset, index) => {
                        const link = `${'/nfts/'}${asset?.contract_address}/${asset?.token_id}`
                        return (
                          <LinkContainer
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            to={link}
                            onClick={() => {
                              nftsActions.fetchOpenseaAsset({
                                address: asset?.contract_address || '',
                                token_id: asset?.token_id || ''
                              })
                            }}
                          >
                            <div style={{ display: 'flex' }}>
                              <Text capitalize style={{ padding: '1em' }}>
                                <b>{asset?.name || '#'}</b>
                              </Text>
                              <img
                                alt='Asset Logo'
                                height='200px'
                                width='auto'
                                style={{
                                  border: '1px solid #dfe3eb',
                                  borderRadius: '10%',
                                  borderWidth: '1px',
                                  marginBottom: '0.5rem',
                                  padding: '10px'
                                }}
                                src={asset?.image_url || ''}
                              />
                            </div>
                          </LinkContainer>
                        )
                      })
                    : null}
                </div>
              </MoreAssets>
            </Wrapper>
          )
        }
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  openSeaAsset: selectors.components.nfts.getOpenSeaAsset(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { contract: string; id: string } }
}

export default connector(NftAsset)
