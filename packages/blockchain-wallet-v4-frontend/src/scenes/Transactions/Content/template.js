import React from 'react'
import styled from 'styled-components'
import EmptyTx from 'components/EmptyTx'
import Empty from './Empty'
import Pages from './Pages'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const Success = props => {
  return (
    <Wrapper>
      {props.empty ? (
        props.search ? (
          <EmptyTx />
        ) : (
          <Empty />
        )
      ) : (
        props.pages.map((value, index) => (
          <Pages
            key={index}
            data={value}
            coin={props.coin}
            currency={props.currency}
            onRefresh={props.onRefresh}
            buySellPartner={props.buySellPartner}
          />
        ))
      )}
    </Wrapper>
  )
}

export default Success
