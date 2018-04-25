import React from 'react'

import UsedAddressesTemplate from './template'

export default class UsedAddressesContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = { usedAddressesVisible: false }
    this.onShowUsedAddresses = this.onShowUsedAddresses.bind(this)
  }

  onShowUsedAddresses () {
    this.setState({ usedAddressesVisible: !this.state.usedAddressesVisible })
  }

  render () {
    return <UsedAddressesTemplate usedAddressesVisible={this.state.usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} />
  }
}
