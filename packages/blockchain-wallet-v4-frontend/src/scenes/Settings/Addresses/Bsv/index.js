import React from 'react'
import styled from 'styled-components'

import Wallets from './Wallets'
import Transactions from './Transactions'

const Wrapper = styled.div`
  & > :last-child {
    margin-top: 30px;
  }
`
export default class BsvContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Wallets />
        <Transactions />
      </Wrapper>
    )
  }
}
