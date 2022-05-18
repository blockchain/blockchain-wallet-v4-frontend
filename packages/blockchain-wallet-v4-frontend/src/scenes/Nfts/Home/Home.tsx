import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconBlockchain, IconVerified } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { WalletOptionsType } from '@core/types'
import { Button, Image, SkeletonRectangle, SpinningLoader, Text } from 'blockchain-info-components'
import { ImageType } from 'blockchain-info-components/src/Images/Images'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AssetFilterFields,
  CollectionSortFields,
  SortDirection,
  useAssetsQuery,
  useCollectionsQuery
} from 'generated/graphql.types'
import { media, useMedia } from 'services/styles'

import { NftPageV2 } from '../components'
import TrendingCollectionsTable from './TrendingCollectionsTable'

// Special case of hardcoding colors
// don't let this be a bad influence on the rest of the app
const Banner = styled.div`
  background: linear-gradient(
      97.19deg,
      rgba(250, 251, 255, 0) -0.9%,
      rgba(255, 0, 149, 0.16) 49.02%,
      rgba(91, 165, 210, 0.48) 100%
    ),
    #f0f2f7;
  height: 400px;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
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
  border: 1.18px solid ${colors.grey000};
  z-index: 2;
  width: 266px;
  height: 50px;
  background: white;
  left: 3em;
  top: 1em;
  margin-top: -12px;
  padding: 0em 1em;
  display: flex;
  justify-content: space-between;
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

const Explore: React.FC<Props> = (props) => {
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')
  const contracts = props.openseaApi.includes('testnet')
    ? ['azuki-god', 'dragon-age', 'baychonorarymembers', 'doodles-2sgb43ekw0']
    : ['nouns', 'mfers', 'superrare']
  const [randomContract] = useState(Math.floor(Math.random() * 4))
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
  const [results] = useCollectionsQuery({
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
            size='36px'
            color={assetId === i ? 'blue600' : 'white'}
          >
            .
          </Text>
        )
      })
    : null
  const handleAssetClick = (assets) => {
    props.routerActions.push(
      `/nfts/asset/${assets.data?.assets[assetId]?.contract?.address}/${assets.data?.assets[assetId]?.token_id}`
    )
  }
  const handleGetFeatured = () => {
    props.modalActions.showModal('GET_FEATURED', {
      closeAllModals: props.modalActions.closeAllModals,
      origin: 'Nfts'
    })
  }
  return (
    <NftPageV2>
      <>
        <Banner style={{ height: '600px' }}>
          <div style={{ lineHeight: '2em' }}>
            {!isMobile && !isTablet && (
              <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                <Icon label='logo'>
                  <IconBlockchain />
                </Icon>
                &nbsp;|&nbsp;
                <Text color='black' size='20px' weight={600}>
                  NFT
                </Text>
              </div>
            )}

            <Text
              size={isTablet || isMobile ? '20px' : '32px'}
              style={isTablet || isMobile ? { paddingTop: '1em', textAlign: 'center' } : {}}
              weight={600}
              color='black'
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
                  color='grey900'
                >
                  Unlock a best in class NFT experience with the Blockchain.com NFT Marketplace
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
                  color='grey600'
                >
                  Unlock a best in class NFT experience with the Blockchain.com NFT Marketplace
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
                      height: '300.35px',
                      width: '300.35px'
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
                          <Icon size='sm' label='verified' color='blue600'>
                            <IconVerified />
                          </Icon>
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
                  <SkeletonRectangle height='300.35px' width='300.35px' bgColor='white' />
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
              </CardWrapper>
            )}
          </div>
        </Banner>
        <div>
          <Text
            color='black'
            style={
              isMobile || isTablet
                ? { marginBottom: '16px', marginLeft: '16px', marginTop: '24px' }
                : { marginBottom: '16px', marginTop: '24px' }
            }
            size={isMobile || isTablet ? '20px' : '24px'}
            weight={600}
          >
            Trending Collections
          </Text>
        </div>
      </>
      {results.data?.collections ? (
        <TrendingCollectionsTable collections={results.data.collections} {...props} />
      ) : (
        <SpinningLoader width='14px' height='14px' borderWidth='3px' />
      )}
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
