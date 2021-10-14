import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftOrdersType } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { PageTitle, SubTitle, Title } from 'components/Layout'

const Marketplace: React.FC<Props> = ({ ordersR }) => {
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
                defaultMessage='Buy/Sell NFTs directly from your blockchain.com Wallet'
              />
            </Text>
          </SubTitle>
        </div>
      </PageTitle>
      <div>
        {ordersR.cata({
          Failure: (e) => e,
          Loading: () => 'Loading...',
          NotAsked: () => 'Loading...',
          Success: (orders) => {
            return orders.map((order) => <div key={order.id}>{order.target}</div>)
          }
        })}
      </div>
    </div>
  )
}

type Props = {
  ordersR: RemoteDataType<string, NftOrdersType['orders']>
}

export default Marketplace
