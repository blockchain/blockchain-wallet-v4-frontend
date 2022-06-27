import React, { memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

import {
  CoinDataItem,
  useSelfCustodyCoinsBalances
} from '../../../hooks/useSelfCustodyCoinsBalances'
import EmptyState from './EmptyState'

const listItemHeight = 74

const ListRowStyled = styled.div`
  display: flex;
  height: ${() => `${listItemHeight}px`};
`

const Cell = styled.div<{ align?: string }>`
  width: 100%;
  height: 100%;
  color: ${(p) => p.theme.white};
  display: flex;
  text-align: ${(p) => p.align || 'left'};
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  & > * {
    width: 100%;
  }
`

const ListRow = memo(
  ({ data, index, style }: { data: CoinDataItem; index: number; style: { height: number } }) => {
    const {
      balance,
      coinfig: { displaySymbol, name, symbol }
    } = data[index]
    return (
      <ListRowStyled style={style}>
        <Cell style={{ flex: '30%', paddingLeft: '14px' }}>
          <Icon size='24' name={symbol} />
        </Cell>
        <Cell>
          <Text color='white900' size='16px' weight={600}>
            {displaySymbol}
          </Text>
          <Text color='grey400' size='12px' weight={500}>
            {name}
          </Text>
        </Cell>
        <Cell align='right'>
          <Flex justifyContent='flex-end'>
            <CoinDisplay
              coin={symbol}
              size='16px'
              color='white900'
              weight={600}
              data-e2e={`${symbol}Balance`}
            >
              {balance}
            </CoinDisplay>
          </Flex>
          <Flex justifyContent='flex-end'>
            <FiatDisplay color='grey400' size='12px' weight={500} coin={symbol}>
              {balance}
            </FiatDisplay>
          </Flex>
        </Cell>
      </ListRowStyled>
    )
  }
)

const CoinsList: React.FC = () => {
  const coins: CoinDataItem[] | null = useSelfCustodyCoinsBalances()

  const coinsCount: number = coins ? coins.length : 0

  if (coins && !coinsCount) {
    return <EmptyState />
  }

  return (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <List
          height={height}
          width={width}
          itemCount={coinsCount}
          itemData={coins || []}
          itemSize={listItemHeight}
        >
          {(props) => <ListRow {...props} />}
        </List>
      )}
    </AutoSizer>
  )
}

export default CoinsList
