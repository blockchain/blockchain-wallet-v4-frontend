import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftAssetsType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

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
        Success: (assets) =>
          assets.map((asset) => {
            return <div key={asset.token_id}>{asset.name}</div>
          })
      })}
    </div>
  )
}

type Props = {
  assetsR: RemoteDataType<string, NftAssetsType['assets']>
}

export default YourCollection
