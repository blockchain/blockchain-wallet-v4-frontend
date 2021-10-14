import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { NftAssetsType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'
import { media } from 'services/styles'

const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 8px;
  gap: 20px;
  margin-bottom: 100px;
  ${media.laptopM`
    gap: 16px;
    margin-bottom: 24px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}
  ${media.tabletL`
    gap: 12px;
    margin-bottom: 24px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}
`
const Asset = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: ${(props) => `1px solid ${props.theme.grey100}`};
`
const AssetImage = styled.img`
  object-fit: contain;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0px;
`
const AssetDetails = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: ${(props) => props.theme.white};
  > div {
    width: 50%;
  }
`
const AssetCollection = styled.div``
const PriceInfo = styled.div`
  text-align: right;
`

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
              return (
                <Asset key={asset.token_id}>
                  <div style={{ backgroundColor: `#${asset.background_color}` || '#fff' }}>
                    <AssetImage
                      alt={asset.image_url}
                      style={{ width: '100%' }}
                      src={asset.image_url}
                    />
                  </div>
                  <AssetDetails>
                    <div>
                      <AssetCollection>
                        <Text size='14px' color='grey600' weight={600}>
                          {asset.collection.name}
                        </Text>
                      </AssetCollection>
                      <Text size='14px' color='grey800' weight={600}>
                        {asset.name}
                      </Text>
                    </div>
                    <PriceInfo>
                      <Text size='14px' color='grey600'>
                        <FormattedMessage id='copy.price' defaultMessage='Price' />
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
