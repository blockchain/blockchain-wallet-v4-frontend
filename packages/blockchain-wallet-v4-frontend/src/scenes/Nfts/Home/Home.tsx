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
  justify-content: space-around;
  padding: 100px 64px;
  z-index: 2;
  ${media.mobile`
    flex-direction: column;
    padding: 30px 16px;
    border-radius: unset;
  `}
`

const AssetCard = styled.div`
  border-radius: 16px;
  border: 1.18px solid ${colors.grey000};
  z-index: 2;
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.4);
  left: 3em;
  top: 1em;
  ${media.atLeastMobile`
    left: unset;
    top: unset;
  `}
`

const BackOfCard = styled.div`
  border: 1.18px solid ${colors.grey000};
  width: 250px;
  position: absolute;
  background: white;
  opacity: 24%;
  border-radius: 16px;
  height: 250px;
  transform: rotate(-15deg);
  z-index: 1;
  top: 200px;
  ${media.atLeastMobile`
    top: 150px;
  `}
  ${media.atLeastTablet`
    top: 50px;
  `}
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
      <>
        <Banner style={isTablet || isMobile ? { height: '510px' } : {}}>
          <div>
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
              style={isTablet || isMobile ? { textAlign: 'center' } : {}}
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
            <BackOfCard />
            <CardWrapper>
              <div>
                <Text
                  color='black'
                  weight={600}
                  size='16px'
                  style={
                    isMobile || isTablet
                      ? {
                          background: 'white',
                          borderRadius: '18px',
                          left: '1em',
                          lineHeight: '2',
                          padding: '4px 16px',
                          position: 'relative',
                          top: '4em',
                          whiteSpace: 'nowrap',
                          width: '12em',
                          zIndex: '3'
                        }
                      : {
                          background: 'white',
                          borderRadius: '18px',
                          lineHeight: '2',
                          margin: '1em',
                          padding: '4px 16px',
                          position: 'absolute',
                          whiteSpace: 'nowrap',
                          width: '12em',
                          zIndex: '3'
                        }
                  }
                >
                  CrypToadz by GREMPLIN
                </Text>
              </div>
              <AssetCard>
                <img
                  width='155px'
                  height='auto'
                  alt='asset'
                  src=''
                  style={{ padding: '5em 3em' }}
                />
              </AssetCard>
              <Text
                color='blue600'
                size='14px'
                weight={500}
                style={
                  isMobile || isTablet
                    ? {
                        bottom: '2.5em',
                        lineHeight: '2',
                        padding: '0em 1em',
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        width: '12em',
                        zIndex: '3'
                      }
                    : {
                        bottom: '4em',
                        lineHeight: '2',
                        margin: '1em',
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        width: '12em',
                        zIndex: '3'
                      }
                }
              >
                #1059 | CrypToadz by GREMPLIN
              </Text>
            </CardWrapper>
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

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
