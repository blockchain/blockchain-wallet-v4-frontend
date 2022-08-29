import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { IconBlockchain, IconVerified, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import { Button, SkeletonCircle, SkeletonRectangle, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import {
  AssetFilterFields,
  CollectionSortFields,
  SortDirection,
  useAssetsQuery,
  useTrendingCollectionsQuery
} from 'generated/graphql.types'
import { media, useMedia } from 'services/styles'

import { NftPageV2 } from '../components'
import TrendingCollectionsTable from './TrendingCollectionsTable'

// Special case of hardcoding colors
// don't let this be a bad influence on the rest of the app
const Banner = styled.div`
  background: linear-gradient(40deg, #121d33, ${PaletteColors['blue-300']}, #f00699);
  background-size: 600% 600%;
  -webkit-animation: AnimationName 40s ease infinite;
  -moz-animation: AnimationName 40s ease infinite;
  animation: AnimationName 40s ease infinite;
  @-webkit-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  height: 400px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 100px 64px;
  z-index: 2;
  ${media.mobile`
    flex-direction: column;
    padding: 30px 16px;
    border-radius: unset;
  `}
`

const AssetFooter = styled.div`
  border-radius: 0px 0px 16px 16px;
  border: 1px solid ${PaletteColors['grey-000']};
  z-index: 2;
  height: 50px;
  background: white;
  left: 3em;
  top: 1em;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  margin-top: -8px;
  ${media.atLeastMobile`
    left: unset;
    top: unset;
  `}
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em 0em;
`

const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12px 0;
  > div:last-child {
    flex: 1;
    margin-left: 16px;
  }
`

const CustomRectangleHeader = styled(SkeletonRectangle)`
  border-radius: 24px 24px 0px 0px;
  ${media.mobile`
      border-radius: unset;
  `}
`

const Explore: React.FC<Props> = (props) => {
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')
  const contracts = props.openseaApi.includes('testnet')
    ? ['azuki-god', 'dragon-age', 'baychonorarymembers', 'doodles-2sgb43ekw0']
    : ['nouns', 'mfers', 'superrare']
  const [randomContract] = useState(Math.floor(Math.random() * contracts.length))
  const [assetId, setAssetId] = useState(0)
  const limit = 5
  const [assets] = useAssetsQuery({
    variables: {
      filter: [{ field: AssetFilterFields.CollectionSlug, value: contracts[randomContract] }],
      limit
    }
  })
  const loadedAssets = assets.data?.assets.filter((asset) => {
    return !!asset.image_url
  })
  useEffect(() => {
    if (loadedAssets?.length) {
      const interval = setInterval(() => {
        if (assetId < loadedAssets.length - 1) {
          setAssetId(assetId + 1)
        } else {
          setAssetId(0)
        }
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [assetId, loadedAssets])
  const [results] = useTrendingCollectionsQuery({
    variables: {
      sort: { by: CollectionSortFields.OneDayVolume, direction: SortDirection.Desc }
    }
  })
  const Carousel = loadedAssets
    ? loadedAssets.map((asset, i) => {
        return (
          <Text
            key={asset.image_url}
            onClick={() => setAssetId(i)}
            style={{ cursor: 'pointer' }}
            size='64px'
            lineHeight='12px'
            color={assetId === i ? 'white' : 'grey900'}
          >
            .
          </Text>
        )
      })
    : null
  const handleAssetClick = (assets) => {
    props.routerActions.push(
      `/nfts/assets/${assets.data?.assets[assetId]?.contract?.address}/${assets.data?.assets[assetId]?.token_id}`
    )
  }
  const handleGetFeatured = () => {
    props.modalActions.showModal(ModalName.GET_FEATURED, {
      closeAllModals: props.modalActions.closeAllModals,
      origin: 'Nfts'
    })
  }

  const Loading = () => (
    <>
      <CustomRectangleHeader height='40px' width='100%' />
      <SkeletonLoader>
        <SkeletonCircle height='32px' width='32px' />
        <SkeletonRectangle height='40px' width='100%' />
      </SkeletonLoader>
      <SkeletonLoader>
        <SkeletonCircle height='32px' width='32px' />
        <SkeletonRectangle height='40px' width='100%' />
      </SkeletonLoader>
      <SkeletonLoader>
        <SkeletonCircle height='32px' width='32px' />
        <SkeletonRectangle height='40px' width='100%' />
      </SkeletonLoader>
    </>
  )

  return (
    <NftPageV2 style={{ padding: 0 }}>
      <>
        <Banner style={{ height: '100%' }}>
          <div style={{ lineHeight: '2em' }}>
            {!isMobile && !isTablet && (
              <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                <IconBlockchain color={PaletteColors['white-900']} label='logo' />
                <Text color='white'>&nbsp;|&nbsp;</Text>
                <Text color='white' size='20px' weight={600}>
                  NFT
                </Text>
              </div>
            )}

            <Text
              size={isTablet || isMobile ? '20px' : '32px'}
              style={isTablet || isMobile ? { paddingTop: '1em', textAlign: 'center' } : {}}
              weight={600}
              color='white'
            >
              Discover, Collect & Create NFTs.
            </Text>

            {isMobile || isTablet ? (
              <>
                <Text
                  style={{
                    lineHeight: '20px',
                    marginTop: '8px',
                    maxWidth: '500px',
                    textAlign: 'center'
                  }}
                  size='14px'
                  weight={500}
                  color='white'
                >
                  Access the world’s most popular NFT collections right from your Blockchain.com
                  Wallet
                </Text>
                <Flex
                  justifyContent={isMobile || isTablet ? 'space-evenly' : 'space-between'}
                  style={{ margin: '0em 2em 0em 2em' }}
                >
                  <LinkContainer to='/nfts/explore' style={{ marginTop: '16px' }}>
                    <Button nature='primary' data-e2e='Explore'>
                      <FormattedMessage id='copy.explore' defaultMessage='Explore' />
                    </Button>
                  </LinkContainer>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      paddingTop: '1em',
                      width: '6em'
                    }}
                  >
                    <Text color='blue600' weight={600}>
                      Create
                    </Text>
                  </div>
                </Flex>
              </>
            ) : (
              <>
                <Text
                  style={{ marginTop: '8px', maxWidth: '500px' }}
                  size='20px'
                  weight={500}
                  color='white'
                >
                  Access the world’s most popular NFT collections right from your Blockchain.com
                  Wallet
                </Text>
                <LinkContainer to='/nfts/explore' style={{ marginTop: '16px' }}>
                  <Button jumbo nature='primary' data-e2e='Explore'>
                    <FormattedMessage id='copy.explore' defaultMessage='Explore' />
                  </Button>
                </LinkContainer>
              </>
            )}
          </div>
          <div>
            {assets && loadedAssets && loadedAssets[assetId]?.image_url ? (
              <CardWrapper>
                <div
                  role='button'
                  tabIndex={0}
                  onClick={() => handleAssetClick(assets)}
                  onKeyDown={() => handleAssetClick(assets)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    style={{
                      borderRadius: '16px 16px 0px 0px',
                      display: 'block',
                      height: isMobile || isTablet ? '300.35px' : '350px',
                      width: isMobile || isTablet ? '300.35px' : '350px'
                    }}
                    alt='assetImage'
                    src={loadedAssets[assetId]?.image_url || ''}
                  />
                </div>
                <AssetFooter>
                  <Flex alignItems='center'>
                    <div
                      role='button'
                      tabIndex={0}
                      onClick={() => handleAssetClick(assets)}
                      onKeyDown={() => handleAssetClick(assets)}
                      style={{ cursor: 'pointer', lineHeight: '18px' }}
                    >
                      <Text
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '125px'
                        }}
                        color='grey900'
                        weight={600}
                        size='16px'
                      >
                        {loadedAssets[assetId]?.name}
                      </Text>
                      <Flex gap={2} alignItems='center'>
                        {loadedAssets[assetId]?.collection?.safelist_request_status ===
                          'verified' && (
                          <IconVerified
                            size='small'
                            label='verified'
                            color={PaletteColors['orange-400']}
                          />
                        )}
                        <Text
                          weight={500}
                          size='14px'
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '125px'
                          }}
                        >
                          {loadedAssets[assetId]?.collection?.name}
                        </Text>
                      </Flex>
                    </div>
                  </Flex>
                  <Flex alignItems='center'>
                    <Button
                      onClick={handleGetFeatured}
                      small
                      data-e2e='Featured'
                      nature='empty-blue'
                    >
                      <FormattedMessage id='copy.get_featured' defaultMessage='Get Featured' />
                    </Button>
                  </Flex>
                </AssetFooter>
                <Flex justifyContent='center' gap={4}>
                  {Carousel}
                </Flex>
              </CardWrapper>
            ) : (
              <CardWrapper style={{ opacity: '50%' }}>
                <div>
                  <SkeletonRectangle
                    height={isMobile || isTablet ? '300.35px' : '350px'}
                    width={isMobile || isTablet ? '300.35px' : '350px'}
                    bgColor='white'
                  />
                </div>
                <AssetFooter>
                  <Flex alignItems='center'>
                    <Button
                      onClick={handleGetFeatured}
                      small
                      data-e2e='Featured'
                      nature='empty-blue'
                    >
                      <FormattedMessage id='copy.get_featured' defaultMessage='Get Featured' />
                    </Button>
                  </Flex>
                </AssetFooter>
                <div style={{ height: '12px' }} />
              </CardWrapper>
            )}
          </div>
        </Banner>
        <div style={{ padding: '1em' }}>
          <div>
            <Text
              color='black'
              style={
                isMobile || isTablet
                  ? { marginBottom: '16px', marginLeft: '16px', marginTop: '36px' }
                  : { marginBottom: '16px', marginTop: '36px' }
              }
              size={isMobile || isTablet ? '20px' : '24px'}
              weight={600}
            >
              Trending Collections
            </Text>
          </div>
        </div>
      </>
      <div style={isTablet ? { padding: 0 } : { marginTop: '0px', padding: '1em' }}>
        {results.data?.collections ? (
          <TrendingCollectionsTable collections={results.data.collections} {...props} />
        ) : (
          <Loading />
        )}
      </div>
    </NftPageV2>
  )
}

const mapStateToProps = (state: RootState) => ({
  openseaApi: selectors.core.walletOptions
    .getDomains(state)
    .getOrElse({ opensea: 'https://api.opensea.io' } as WalletOptionsType['domains']).opensea
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
