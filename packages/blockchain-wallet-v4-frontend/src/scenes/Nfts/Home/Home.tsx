import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconBlockchain } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import {
  AssetFilterFields,
  CollectionSortFields,
  SortDirection,
  useAssetQuery,
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
  justify-content: space-between;
  padding: 100px 64px;
  z-index: 2;
  ${media.mobile`
    flex-direction: column;
    padding: 30px 16px;
    border-radius: unset;
  `}
`

const AssetCard = styled.img`
  border-radius: 16px;
  border: 1.18px solid ${colors.grey000};
  z-index: 2;
  position: relative;
`

const BackOfCard = styled.div`
  border: 1.18px solid ${colors.grey000};
  width: 250px;
  top: 225px;
  position: absolute;
  background: white;
  opacity: 50%;
  border-radius: 16px;
  height: 250px;
  transform: rotate(-15deg);
  z-index: 1;
  ${media.atLeastMobile`
    top: 100px;
    right: 60px;
  `}
`

const Explore: React.FC<Props> = (props) => {
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')
  const [results] = useCollectionsQuery({
    variables: {
      sort: { by: CollectionSortFields.OneDayVolume, direction: SortDirection.Desc }
    }
  })
  // TO-DO: change to cryptoadz (0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6),
  // and grab random tokenId (1-6969) for mainnet
  const [asset] = useAssetQuery({
    requestPolicy: 'network-only',
    variables: {
      filter: [
        {
          field: AssetFilterFields.ContractAddress,
          value: '0xb74bf94049d2c01f8805b8b15db0909168cabf46'
        },
        { field: AssetFilterFields.TokenId, value: '964' }
      ]
    }
  })

  return (
    <NftPageV2>
      {!isTablet && !isMobile ? (
        <>
          <Banner>
            <div>
              <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                <Icon label='logo'>
                  <IconBlockchain />
                </Icon>
                &nbsp;|&nbsp;
                <Text color='black' size='20px' weight={600}>
                  NFT
                </Text>
              </div>
              <Text size='32px' weight={600} color='black'>
                Discover, Collect & Create NFTs.
              </Text>
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
            </div>
            <div>
              <BackOfCard />
              <AssetCard width='250px' alt='asset' src={asset.data?.assets[0]?.image_url || ''} />
            </div>
          </Banner>
          <div>
            <Text
              color='black'
              style={{ marginBottom: '16px', marginTop: '24px' }}
              size='24px'
              weight={600}
            >
              Trending Collections
            </Text>
          </div>
        </>
      ) : (
        <>
          <Banner style={{ height: '510px' }}>
            <div>
              <Text size='20px' style={{ textAlign: 'center' }} weight={600} color='black'>
                Discover, Collect & Create NFTs.
              </Text>
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
              <Flex justifyContent='space-between' style={{ margin: '0em 2em 0em 2em' }}>
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
            </div>
            <BackOfCard />
            <AssetCard width='250px' alt='asset' src={asset.data?.assets[0]?.image_url || ''} />
          </Banner>
          <div>
            <Text
              color='black'
              style={{ marginBottom: '16px', marginLeft: '16px', marginTop: '24px' }}
              size='20px'
              weight={600}
            >
              Trending Collections
            </Text>
          </div>
        </>
      )}
      {results.data?.collections ? (
        <TrendingCollectionsTable collections={results.data.collections} {...props} />
      ) : (
        <SpinningLoader width='14px' height='14px' borderWidth='3px' />
      )}
    </NftPageV2>
  )
}

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
