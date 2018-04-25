import React from 'react'

import UsedAddressesTemplate from './template'

export default class UsedAddressesContainer extends React.PureComponent {
  render () {
    const onShowUsedAddresses = (i) => window.alert('hi')

    return <UsedAddressesTemplate onShowUsedAddresses={onShowUsedAddresses} />
  }
}
