import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Wallets from './Wallets'
import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'

class BtcAddressesContainer extends React.PureComponent {
  render () {
    return (
      <React.Fragment>
        <Wallets context={this.props.data} />
        <ImportedAddresses />
        <ArchivedAddresses />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(
  mapStateToProps,
  undefined
)(BtcAddressesContainer)
