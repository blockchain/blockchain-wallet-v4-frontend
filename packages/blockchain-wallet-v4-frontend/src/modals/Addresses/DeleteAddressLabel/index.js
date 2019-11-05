import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import DeleteAddressLabel from './template'
import modalEnhancer from 'providers/ModalEnhancer'

class DeleteAddressLabelContainer extends React.PureComponent {
  onDeleteConfirm = () => {
    const { accountIdx, addressIdx, derivation, walletIdx } = this.props
    this.props.componentActions.deleteAddressLabel(
      accountIdx,
      walletIdx,
      addressIdx,
      derivation
    )
    this.props.close()
  }

  render () {
    return (
      <DeleteAddressLabel
        {...this.props}
        onDeleteConfirm={this.onDeleteConfirm}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('DeleteAddressLabel'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(DeleteAddressLabelContainer)
