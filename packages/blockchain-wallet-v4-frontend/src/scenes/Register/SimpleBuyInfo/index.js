import { CoinType } from 'core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { prop, propOr, toLower } from 'ramda'
import React from 'react'
import styled from 'styled-components'

const SimpleBuyItemWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
`

const SimpleWrapper = styled.div`
  display: flex;
`

const AmountWrapper = styled.div`
  display: flex;
  border-radius: 0.5rem;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  border: 1px solid ${props => props.theme.grey100};
  padding: 0.75rem;
  margin-right: 1rem;
  margin-top: 2rem;
`

const CryptoWrapper = styled(AmountWrapper)`
  flex: 3;
  justify-content: initial;
  margin-right: 0;

  > * {
    margin-right: 0.5rem;
  }
`

const getIcon = (crypto: CoinType) => {
  switch (crypto) {
    case 'BTC':
      return 'btc-circle-filled'
    case 'ETH':
      return 'eth-circle-filled'
    case 'BCH':
      return 'bch-circle-filled'
    case 'XLM':
      return 'xlm-circle-filled'
    case 'PAX':
      return 'usd-d'
    case 'ALGO':
      return 'algo'
    case 'USDT':
      return 'usdt'
    default:
      return 'btc-circle-filled'
  }
}

const SimpleBuyInfo = ({ goalData }) => (
  <SimpleBuyItemWrapper>
    <AmountWrapper>
      <SimpleWrapper>
        <Text size='16px' color='grey400' weight={500}>
          $
        </Text>
        <Text size='16px' color='black' weight={500}>
          {prop('amount', goalData)}
        </Text>
      </SimpleWrapper>
      <Image name='us-flag' height='24px' />
    </AmountWrapper>

    <CryptoWrapper>
      <Icon
        color={toLower(propOr('BTC', 'crypto', goalData))}
        name={getIcon(propOr('BTC', 'crypto', goalData))}
        size='24px'
        weight={400}
      />
      <Text capitalize color='black' size='16px' weight={500}>
        {prop('displayName', goalData)}
      </Text>
      <Text color='grey400' size='16px' uppercase weight={500}>
        {prop('crypto', goalData)}
      </Text>
    </CryptoWrapper>
  </SimpleBuyItemWrapper>
)

export default SimpleBuyInfo
