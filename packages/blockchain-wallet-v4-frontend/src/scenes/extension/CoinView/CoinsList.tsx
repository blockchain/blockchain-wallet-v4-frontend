import React, { memo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

const listItemHeight = 73

const ListRowStyled = styled.div`
  display: flex;
  height: ${() => `${listItemHeight}px`};
  border: solid 1px #ffffff;
`

const Cell = styled.div`
  width: 100%;
  height: 100%;
  color: #ffffff;
`

const ListRow = memo(({ data, index, style }: any) => {
  return (
    <ListRowStyled style={style}>
      <Cell>{index}</Cell>
      <Cell>{index}</Cell>
      <Cell>{index}</Cell>
    </ListRowStyled>
  )
})

const CoinsList = () => {
  return (
    // eslint-disable-next-line sort-keys
    <AutoSizer style={{ height: '100%', width: '100%' }}>
      {({ height, width }: { height: number; width: number }) => (
        <List
          style={{ flex: 'auto', overflowX: 'hidden' }}
          height={height}
          width={width}
          itemCount={100}
          itemData={[]}
          itemSize={listItemHeight}
        >
          {(props) => <ListRow {...props} />}
        </List>
      )}
    </AutoSizer>
  )
}

export default CoinsList
