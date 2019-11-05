import React from 'react'
import styled from 'styled-components'

import Empty from './Empty'
import EmptyTx from 'components/EmptyTx'
import LazyLoadContainer from 'components/LazyLoadContainer'
import Pages from './Pages'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
`

const Success = props => {
  return (
    <LazyLoadWrapper onLazyLoad={props.onLoadMore}>
      {props.empty ? (
        props.search ? (
          <EmptyTx />
        ) : (
          <Empty coin={props.coin} />
        )
      ) : (
        props.pages.map((value, index) => (
          <Pages
            key={index}
            data={value}
            coin={props.coin}
            currency={props.currency}
            onRefresh={props.onRefresh}
            onLoadMore={props.onLoadMore}
            buySellPartner={props.buySellPartner}
            onArchive={props.onArchive}
          />
        ))
      )}
    </LazyLoadWrapper>
  )
}

export default Success
