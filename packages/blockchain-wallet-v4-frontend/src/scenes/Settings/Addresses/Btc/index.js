import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getData } from './selectors'
import AddressesLayout from 'layouts/Addresses'
import Wallets from './Wallets'
import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.section`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`

class BtcAddressesContainer extends React.PureComponent {
  render () {
    return (
      <AddressesLayout>
        <Wrapper>
          <Wallets context={this.props.data} />
          <ImportedAddresses />
          <ArchivedAddresses />
        </Wrapper>
      </AddressesLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps, undefined)(BtcAddressesContainer)
