import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import DeleteAddressLabel from './template'

class DeleteAddressLabelContainer extends React.PureComponent {
  onDeleteConfirm = () => {
    const {
      accountIdx,
      addressIdx,
      close,
      componentActions,
      derivation,
      walletIdx
    } = this.props
    componentActions.deleteAddressLabel(
      accountIdx,
      walletIdx,
      addressIdx,
      derivation
    )
    close()
  }

  render() {
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
  modalEnhancer('DELETE_ADDRESS_LABEL_MODAL'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(DeleteAddressLabelContainer)
