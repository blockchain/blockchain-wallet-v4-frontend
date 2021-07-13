import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import ArchivedAddresses from './ArchivedAddresses'
import ImportedAddresses from './ImportedAddresses'
import { getData } from './selectors'
import Wallets from './Wallets'

class BtcAddressesContainer extends React.PureComponent<Props> {
  render() {
    return (
      <>
        <Wallets context={this.props.data} />
        <ImportedAddresses />
        <ArchivedAddresses />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(BtcAddressesContainer)
