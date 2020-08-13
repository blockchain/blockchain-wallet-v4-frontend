import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'
import Wallets from './Wallets'

class BtcAddressesContainer extends React.PureComponent<Props> {
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

const connector = connect(mapStateToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(BtcAddressesContainer)
