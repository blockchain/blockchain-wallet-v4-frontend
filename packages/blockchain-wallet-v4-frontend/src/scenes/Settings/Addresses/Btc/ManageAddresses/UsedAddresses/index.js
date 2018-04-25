import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UsedAddressesTemplate from './template'

class UsedAddressesContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.onShowUsedAddresses = this.onShowUsedAddresses.bind(this)
  }

  onShowUsedAddresses () {
    if (this.props.showUsedAddresses) {
      this.props.actions.toggleUsedAddresses()
    } else {
      this.props.modalsActions.showModal('ShowUsedAddresses')
    }
  }

  render () {
    return <UsedAddressesTemplate usedAddressesVisible={this.props.showUsedAddresses} onShowUsedAddresses={this.onShowUsedAddresses} />
  }
}

const mapStateToProps = state => ({
  showUsedAddresses: selectors.components.usedAddresses.getUsedAddressesVisiblity(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalsActions: bindActionCreators(actions.modals, dispatch),
  actions: bindActionCreators(actions.components.usedAddresses, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UsedAddressesContainer)
