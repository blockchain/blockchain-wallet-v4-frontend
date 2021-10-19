import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftAssetsType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImage,
  CollectionWrapper,
  ImageContainer,
  PriceInfo,
  StyledCoinDisplay
} from '../components'

const YourCollection: React.FC<Props> = ({ assetsR }) => {
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
                    style={{
                      backgroundColor: `#${asset.background_color}` || '#fff'
                    }}
                  >
                    <AssetImage
                      alt={asset.image_url}
                      style={{ width: '100%' }}
                      src={asset.image_url}
                    />
                  </ImageContainer>
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
                </Asset>
              )
            })}
          </CollectionWrapper>
        )
      })}
    </div>
  )
}

type Props = {
  assetsR: RemoteDataType<string, NftAssetsType['assets']>
}

export default YourCollection
