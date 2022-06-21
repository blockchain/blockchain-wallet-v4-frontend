import React, { memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { useCoinBalances } from '../../../hooks/useCoinBalances'
import EmptyState from './EmptyState'
import { CoinDataItem } from './types'

const listItemHeight = 73

const ListRowStyled = styled.div`
  display: flex;
  height: ${() => `${listItemHeight}px`};
`

const Cell = styled.div<{ align?: string }>`
  width: 100%;
  height: 100%;
  color: #ffffff;
  display: flex;
  text-align: ${(p) => p.align || 'left'};
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  & > * {
    width: 100%;
  }
`

const BalanceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ListRow = memo(
  ({ data, index, style }: { data: CoinDataItem; index: number; style: { height: number } }) => {
    const {
      balance,
      coinfig: { name, symbol }
    } = data[index]
    return (
      <ListRowStyled style={style}>
        <Cell style={{ flex: '20%', paddingLeft: '14px' }}>
          <Icon size='32' name={symbol} />
        </Cell>
        <Cell>
          <Text color='white900' size='16px' weight={600}>
            {symbol}
          </Text>
          <Text color='grey400' size='12px' weight={500}>
            {name}
          </Text>
        </Cell>
        <Cell align='right'>
          <BalanceWrapper>
            <CoinDisplay
              coin={symbol}
              size='16px'
              color='white900'
              weight={600}
              data-e2e={`${symbol}Balance`}
            >
              {balance}
            </CoinDisplay>
          </BalanceWrapper>
          <BalanceWrapper>
            <FiatDisplay color='grey400' size='12px' weight={500} coin={symbol}>
              {balance}
            </FiatDisplay>
          </BalanceWrapper>
        </Cell>
      </ListRowStyled>
    )
  }
)

const CoinsList: React.FC = () => {
  const coins: CoinDataItem[] | null = useCoinBalances()

  const coinsCount: number = coins ? coins.length : 0

  if (coins && !coinsCount) {
    return <EmptyState />
  }

  return (
    <AutoSizer style={{ height: '300px', width: '100%' }}>
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
