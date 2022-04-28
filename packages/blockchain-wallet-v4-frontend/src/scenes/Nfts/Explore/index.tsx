import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from '@blockchain-com/constellation'
import { IconBlockchain } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

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
  `}
`

const Explore: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  return (
    <NftPageV2>
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
            color='grey400'
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
      <Text
        color='black'
        style={{ marginBottom: '16px', marginTop: '24px' }}
        size='24px'
        weight={600}
      >
        Trending Collections
      </Text>
      {props.collectionsR.cata({
        Failure: () => null,
        Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
        NotAsked: () => null,
        Success: (val) => {
          return <TrendingCollectionsTable collections={val} {...props} />
        }
      })}
    </NftPageV2>
  )
}

const mapStateToProps = (state: RootState) => ({
  collectionsR: selectors.components.nfts.getNftCollections(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Explore)
