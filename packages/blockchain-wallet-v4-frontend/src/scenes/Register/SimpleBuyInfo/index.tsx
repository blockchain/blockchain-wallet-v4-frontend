import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

const SimpleBuyItemWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  width: 100%;
`

const SimpleWrapper = styled.div`
  display: flex;
  min-width: 0;
`

const AmountWrapper = styled.div`
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  border: 1px solid ${(props) => props.theme.grey100};
  padding: 12px;
  margin-right: 16px;
  margin-top: 32px;
  min-width: 0;
`

const CryptoWrapper = styled(AmountWrapper)`
  flex: 3;
  justify-content: initial;
  margin-right: 0;
  min-width: initial;

  > * {
    margin-right: 8px;
  }
`

const Amount = styled(Text)`
  padding-left: 4px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SimpleBuyInfo = ({ goalData: { amount, crypto, fiatCurrency }, supportedCoins }) => (
  <SimpleBuyItemWrapper>
    <AmountWrapper>
      <SimpleWrapper>
        <Text size='16px' color='grey400' weight={500}>
          {Currencies[fiatCurrency].units[fiatCurrency].symbol}
        </Text>
        <Amount size='16px' color='black' weight={500}>
          {amount}
        </Amount>
      </SimpleWrapper>
    </AmountWrapper>

    <CryptoWrapper>
      <Icon
        color={supportedCoins[crypto].coinCode}
        name={supportedCoins[crypto].coinCode}
        size='24px'
        weight={400}
      />
      <Text capitalize color='black' size='16px' weight={500}>
        {supportedCoins[crypto].displayName}
      </Text>
      <Text color='grey400' size='16px' uppercase weight={500}>
        {crypto}
      </Text>
    </CryptoWrapper>
  </SimpleBuyItemWrapper>
)

export default SimpleBuyInfo
