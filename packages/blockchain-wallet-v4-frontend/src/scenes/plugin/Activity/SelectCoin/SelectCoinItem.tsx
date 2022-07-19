import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Color, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding-block: 16px;

  &:hover {
    background-color: ${Color('exchangeLogin')};
  }
`

const IconWrapper = styled.div`
  margin-right: 16px;
`

interface ISearchCoinItemProps {
  balance: number
  name: string
  onSelect(coin: string): void
  symbol: string
}

const SelectCoinItem: React.FC<ISearchCoinItemProps> = ({ balance, name, onSelect, symbol }) => {
  const handleSelectCoin = () => {
    onSelect(symbol)
  }

  return (
    <ItemWrapper onClick={handleSelectCoin}>
      <Flex alignItems='center'>
        <IconWrapper>
          <Icon name={symbol} size='24px' />
        </IconWrapper>

        <Flex flexDirection='column' alignItems='flex-start'>
          <Text size='16px' lineHeight='24px' weight={500} color='white'>
            {name}
          </Text>

          <Text size='12px' lineHeight='18px' color='grey400' weight={500}>
            {symbol}
          </Text>
        </Flex>
      </Flex>

      <Flex flexDirection='column' alignItems='flex-end'>
        <CoinDisplay size='16px' lineHeight='24px' weight={500} color='white' coin={symbol}>
          {balance}
        </CoinDisplay>

        <FiatDisplay size='12px' lineHeight='18px' color='grey400' weight={500} coin={symbol}>
          {new BigNumber(balance).toString()}
        </FiatDisplay>
      </Flex>
    </ItemWrapper>
  )
}

export default SelectCoinItem
