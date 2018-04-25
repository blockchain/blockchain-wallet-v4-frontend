import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import UsedAddressesTemplate from './template'

class UsedAddressesContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = { usedAddressesVisible: false }
    this.onShowUsedAddresses = this.onShowUsedAddresses.bind(this)
  }

  onShowUsedAddresses () {
    this.props.modalsActions.showModal('ShowUsedAddresses')
    this.setState({ usedAddressesVisible: !this.state.usedAddressesVisible })
  }

  render () {
    return <UsedAddressesTemplate usedAddressesVisible={this.state.usedAddressesVisible} onShowUsedAddresses={this.onShowUsedAddresses} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(UsedAddressesContainer)
