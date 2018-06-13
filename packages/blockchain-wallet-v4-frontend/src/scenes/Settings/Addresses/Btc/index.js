import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import ErrorBoundary from 'layouts/ErrorBoundary'
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
      <ErrorBoundary>
        <AddressesLayout>
          <Wrapper>
            <Wallets context={this.props.data} />
            <ImportedAddresses />
            <ArchivedAddresses />
          </Wrapper>
        </AddressesLayout>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps, undefined)(BtcAddressesContainer)
