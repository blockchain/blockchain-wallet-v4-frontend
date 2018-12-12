import React from 'react'
import styled from 'styled-components'

import Wallets from './Wallets'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.section`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`

export default class BchAddressesContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Wallets />
        <ImportedAddresses />
      </Wrapper>
    )
  }
}
