import React from 'react'

import Wallets from './Wallets'
import ImportedAddresses from './ImportedAddresses'

export default class BchAddressesContainer extends React.PureComponent {
  render () {
    return (
      <React.Fragment>
        <Wallets />
        <ImportedAddresses />
      </React.Fragment>
    )
  }
}
