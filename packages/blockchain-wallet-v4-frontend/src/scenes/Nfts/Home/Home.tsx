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
import { CollectionSortFields, SortDirection, useCollectionsQuery } from 'generated/graphql.types'
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
  ${media.mobile`
    flex-direction: column;
    padding: 30px 16px;
    border-radius: unset;
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
          <Banner>
            <div>
              <Text size='20px' style={{ textAlign: 'center' }} weight={600} color='black'>
                Discover, Collect & Create NFTs.
              </Text>
              <Text
                style={{ marginTop: '8px', maxWidth: '500px', textAlign: 'center' }}
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
                    width: '6em'
                  }}
                >
                  <Text color={colors.blue600} weight={600}>
                    Create
                  </Text>
                </div>
              </Flex>
            </div>
          </Banner>
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
