import React from 'react'
import styled from 'styled-components'
import EmptyTx from 'components/EmptyTx'
import Empty from './Empty'
import List from './List'

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
      {props.empty
        ? props.search ? <EmptyTx /> : <Empty />
        : <List data={props.list} />
      }
    </Wrapper>
  )
}

export default Success
