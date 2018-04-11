import React from 'react'
import styled from 'styled-components'
import AddressesLayout from 'layouts/Addresses'
import Wallets from './Wallets'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`

export default class BchAddressesContainer extends React.Component {
  render () {
    return (
      <AddressesLayout>
        <Wrapper>
          <Wallets />
          <ImportedAddresses />
        </Wrapper>
      </AddressesLayout>
    )
  }
}
