import React from 'react'
import styled from 'styled-components'
import { equals, isEmpty, length } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
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
  const hasNoTransactions = equals(length(props.pages), 1) && Remote.Success.is(props.pages[0]) && isEmpty(props.pages[0].getOrElse([]))

  return (
    <Wrapper>
      { !hasNoTransactions
        ? props.pages.map((value, index) => <Pages key={index} data={value} />)
        : <Empty />
      }
    </Wrapper>
  )
}

export default Success
