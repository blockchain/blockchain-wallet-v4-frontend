import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

import { Props as OwnProps } from '..'
import {
  Asset,
  AssetCollection,
  AssetDetails,
  CollectionWrapper,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'

const YourCollection: React.FC<Props> = ({ assetsR, nftsActions }) => {
  return (
    <div>
      <PageTitle>
        <div>
          <Title>
            <Text color='grey800' size='24px' weight={600}>
              <FormattedMessage id='copy.nfts.collection' defaultMessage='Your Collection' />
            </Text>
          </Title>
          <SubTitle>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.nfts.collection.sub'
                defaultMessage='View your NFT collection'
              />
            </Text>
          </SubTitle>
        </div>
      </PageTitle>
      {assetsR.cata({
        Failure: (e) => e,
        Loading: () => 'Loading...',
        NotAsked: () => 'Loading...',
        Success: (assets) => (
          <CollectionWrapper>
            {assets.map((asset) => {
              if (!asset) return null
              return (
                <Asset key={asset.token_id}>
                  <ImageContainer
                    backgroundColor={`#${asset.background_color}` || '#fff'}
                    background={`url(${asset.image_url})`}
                  />
                  <AssetDetails>
                    <div>
                      <AssetCollection>
                        <Text size='12px' color='grey600' weight={600}>
                          {asset.collection.name}
                        </Text>
                      </AssetCollection>
                      <Text style={{ marginTop: '4px' }} size='12px' color='grey800' weight={600}>
                        {asset.name}
                      </Text>
                    </div>
                    <PriceInfo>
                      <Text size='12px' color='grey600' weight={600}>
                        <FormattedMessage id='copy.price' defaultMessage='Price' />
                      </Text>
                      <Text size='12px' color='grey800' weight={600}>
                        {asset.last_sale ? (
                          <StyledCoinDisplay
                            size='12px'
                            color='grey800'
                            weight={600}
                            coin={asset.last_sale.payment_token.symbol}
                          >
                            {asset.last_sale?.total_price}
                          </StyledCoinDisplay>
                        ) : (
                          asset.top_bid
                        )}
                      </Text>
                    </PriceInfo>
                  </AssetDetails>
                  {asset.sell_orders ? (
                    <Button
                      data-e2e='sellNft'
                      nature='primary'
                      onClick={() => nftsActions.cancelListings({ asset })}
                    >
                      {asset.sell_orders.length > 1 ? (
                        <FormattedMessage
                          id='copy.cancel_listings'
                          defaultMessage='Cancel Listings'
                        />
                      ) : (
                        <FormattedMessage
                          id='copy.cancel_listing'
                          defaultMessage='Cancel Listing'
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      data-e2e='sellNft'
                      nature='primary'
                      onClick={() => nftsActions.createSellOrder({ asset })}
                    >
                      <FormattedMessage id='copy.sell' defaultMessage='Sell' />
                    </Button>
                  )}
                </Asset>
              )
            })}
          </CollectionWrapper>
        )
      })}
    </div>
  )
}

type Props = OwnProps

export default YourCollection
