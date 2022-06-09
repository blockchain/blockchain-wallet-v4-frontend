import React, { memo, useEffect, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import EmptyState from './EmptyState'

const listItemHeight = 73

const ListRowStyled = styled.div`
  display: flex;
  height: ${() => `${listItemHeight}px`};
`

const Cell: any = styled.div`
  width: 100%;
  height: 100%;
  color: #ffffff;
  display: flex;
  text-align: ${(p: { align: string }) => p.align || 'left'};
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  & > * {
    width: 100%;
  }
`

const ListRow = memo(
  ({ data, index, style }: { data: any; index: number; style: { height: number } }) => {
    const { name, symbol } = data[index][1].coinfig
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
          <Text color='white900' size='16px' weight={600}>
            5.3655 {symbol}
          </Text>
          <Text color='grey400' size='12px' weight={500}>
            3,225.01 USD
          </Text>
        </Cell>
      </ListRowStyled>
    )
  }
)

const CoinsList = (): JSX.Element => {
  const [coins, setCoins] = useState<Array<any> | null>(null)

  useEffect(() => {
    setTimeout(() => {
      if (window.coins) {
        const coinsArr: Array<any> = Object.entries(window.coins) || []
        setCoins(coinsArr)
      }
    }, 500)
  }, [window.coins])

  if (coins && !coins.length) {
    return <EmptyState />
  }

  const coinsCount = coins ? coins.length : 0

  return (
    <AutoSizer style={{ height: '100%', width: '100%' }}>
      {({ height, width }: { height: number; width: number }) => (
        <List
          style={{ flex: 'auto', overflowX: 'hidden' }}
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
