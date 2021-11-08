import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { PageTitle, SubTitle, Title } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImage,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'
import MarketForm from './MarketForm'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  > div {
    display: grid;
    overflow: scroll;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    margin-top: 8px;
    gap: 20px;
    margin-bottom: 20px;
    ${media.laptopM`
      gap: 16px;
      margin-bottom: 12px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    `}
    ${media.tabletL`
      gap: 12px;
      margin-bottom: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    `}
  }
`

const Marketplace: React.FC<Props> = (props: Props) => {
  const { nftsActions, orders } = props

  return (
    <div>
      <PageTitle>
        <div>
          <Title>
            <Text color='grey800' size='24px' weight={600}>
              <FormattedMessage id='copy.nfts.marketplace' defaultMessage='Marketplace' />
            </Text>
          </Title>
          <SubTitle>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.nfts.marketplace.sub'
                defaultMessage='Buy/Sell NFTs directly from your blockchain.com Wallet.'
              />
            </Text>
          </SubTitle>
        </div>
      </PageTitle>
      <div>
        <MarketForm {...props} />
        <SubTitle>
          <Text color='grey600' size='14px' weight={600}>
            <FormattedMessage
              id='scenes.nfts.marketplace.sub2'
              defaultMessage='Note: Orders are sorted by most recently created.'
            />
          </Text>
        </SubTitle>
        <LazyLoadWrapper onLazyLoad={nftsActions.fetchNftOrders} triggerDistance={300}>
          {orders.list.map((order) => {
            if (!order.paymentTokenContract) return null
            if (!window.coins[order.paymentTokenContract.symbol]) return null
            if (!order.asset) return null

            return (
              <Asset key={order.calldata}>
                <ImageContainer
                  style={{
                    backgroundColor: `#${order.asset?.backgroundColor}` || '#fff'
                  }}
                >
                  <AssetImage
                    alt={order.asset.imageUrl}
                    style={{ width: '100%' }}
                    src={order.asset.imageUrl}
                  />
                </ImageContainer>
                <AssetDetails>
                  <div>
                    <AssetCollection>
                      <Text
                        style={{ whiteSpace: 'nowrap' }}
                        size='12px'
                        color='grey600'
                        weight={600}
                      >
                        {order.asset.collection.name}
                      </Text>
                    </AssetCollection>
                    <Text style={{ marginTop: '4px' }} size='12px' color='grey800' weight={600}>
                      {order.asset.name}
                    </Text>
                  </div>
                  <PriceInfo>
                    <Text size='12px' color='grey600' weight={600}>
                      <FormattedMessage id='copy.price' defaultMessage='Price' />
                    </Text>
                    <Text style={{ marginTop: '4px' }} size='12px' color='grey800' weight={600}>
                      <StyledCoinDisplay
                        size='12px'
                        color='grey800'
                        weight={600}
                        coin={order.paymentTokenContract.symbol}
                      >
                        {order.basePrice}
                      </StyledCoinDisplay>
                    </Text>
                    <FiatDisplay coin={order.paymentTokenContract.symbol}>
                      {order.basePrice}
                    </FiatDisplay>
                  </PriceInfo>
                </AssetDetails>
                <Button
                  data-e2e='buyNft'
                  nature='primary'
                  onClick={() => nftsActions.createBuyOrder({ order })}
                >
                  <FormattedMessage id='copy.buy' defaultMessage='Buy' />
                </Button>
                <Link href={order.asset.openseaLink} target='_blank'>
                  <Button data-e2e='buyNft' nature='primary'>
                    View on Opensea
                  </Button>
                </Link>
              </Asset>
            )
          })}
          {props.orders.isLoading ? <div>Loading</div> : null}
        </LazyLoadWrapper>
        {/* {props.marketplace.atBound ? <div>No more NFTs for sale in this collection</div> : null} */}
        {/* <Button data-e2e='removethis' nature='primary' onClick={() => nftsActions.fetchNftOrders()}>
          get more
        </Button> */}
      </div>
    </div>
  )
}

type Props = OwnProps

export default Marketplace
