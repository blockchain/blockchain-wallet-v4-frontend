import { connect } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'
import Wallets from './Wallets'

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

export default connect(mapStateToProps)(BtcAddressesContainer)
