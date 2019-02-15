import React from 'react'
import styled from 'styled-components'

import EmptyTx from 'components/EmptyTx'
import Empty from './Empty'
import Pages from './Pages'
import LazyLoadContainer from 'components/LazyLoadContainer'

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
