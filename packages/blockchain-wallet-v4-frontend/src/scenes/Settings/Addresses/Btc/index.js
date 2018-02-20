import React from 'react'
import styled from 'styled-components'
import Wallets from './Wallets'
import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`

export default class BtcAddressesContainer extends React.Component {
  render () {
    return (
      <Wrapper>
        <Wallets />
        <ImportedAddresses />
        <ArchivedAddresses />
      </Wrapper>
    )
  }
}
