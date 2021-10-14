import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { NftAssetsType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
`
const Asset = styled.div`
  border-radius: 8px;
  height: 285px;
`
const AssetImage = styled.img`
  object-fit: contain;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0px;
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
                <Asset
                  style={{ backgroundColor: asset.background_color || '#fff' }}
                  key={asset.token_id}
                >
                  <AssetImage
                    alt={asset.image_url}
                    style={{ height: '285px', width: '100%' }}
                    src={asset.image_url}
                  />
                  {asset.name}
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
