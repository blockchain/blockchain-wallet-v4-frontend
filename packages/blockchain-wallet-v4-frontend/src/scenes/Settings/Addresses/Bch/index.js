import React from 'react'
import styled from 'styled-components'
import Wallets from './Wallets'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`

export default class BchAddressesContainer extends React.Component {
  render () {
    return (
      <Wrapper>
        <Wallets />
        <ImportedAddresses />
      </Wrapper>
    )
  }
}
