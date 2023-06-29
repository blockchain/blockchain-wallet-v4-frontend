import React from 'react'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import type { CoinType } from '@core/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { useFilteredList } from '../hooks'
import Empty from './Empty'
import { TokenBalanceColumn, TokenDetails, TokenIcon, TokenListWrapper, TokenRow } from './styles'
import TokenName from './TokenName'
import { SelectTokenListProps } from './types'
import ViewEtherscan from './ViewEtherscan'

const NATIVE_TOKEN = 'ETH'
const BASE = 'BASE'
const COUNTER = 'COUNTER'

const SelectTokenList = ({
  baseToken,
  counterToken,
  items,
  onTokenSelect,
  search,
  swapSide,
  walletCurrency
}: SelectTokenListProps) => {
  const filteredItems = useFilteredList({ items, search })

  if (filteredItems.length === 0) return <Empty search={search} swapSide={swapSide} />

  return (
    <TokenListWrapper>
      {filteredItems.slice(0, 100).map(({ address, balance, name, symbol }) => {
        const balanceString = (typeof balance !== 'number' ? balance : balance).toString()
        if (swapSide === BASE && balanceString === '0') return null

        if (swapSide === COUNTER && baseToken === symbol) return null
        if (swapSide === BASE && counterToken === symbol) return null
        return (
          <TokenRow key={symbol} onClick={() => onTokenSelect(symbol)}>
            <TokenIcon name={symbol as CoinType} size='24px' />
            <TokenDetails>
              <Flex flexDirection='column'>
                <TokenName name={name} />
                <Flex alignItems='center'>
                  <Text color={SemanticColors.muted} variant='paragraph1'>
                    {symbol}
                  </Text>
                  <Padding left={0.5} />
                  {symbol !== NATIVE_TOKEN && <ViewEtherscan tokenAddress={address} />}
                </Flex>
              </Flex>
              <TokenBalanceColumn>
                <FiatDisplay
                  coin={symbol}
                  color='textBlack'
                  currency={walletCurrency}
                  cursor='pointer'
                  data-e2e={`${symbol}FiatBalance`}
                  lineHeight='150%'
                  loadingHeight='20px'
                  size='16px'
                  weight={600}
                >
                  {balance}
                </FiatDisplay>
                <CoinDisplay
                  coin={symbol}
                  color='grey600'
                  cursor='pointer'
                  data-e2e={`${symbol}Balance`}
                  lineHeight='20px'
                  size='14px'
                  weight={500}
                >
                  {balance}
                </CoinDisplay>
              </TokenBalanceColumn>
            </TokenDetails>
          </TokenRow>
        )
      })}
    </TokenListWrapper>
  )
}

export default SelectTokenList
