import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import DeleteAddressLabel from './template'

class DeleteAddressLabelContainer extends React.PureComponent {
  onDeleteConfirm = () => {
    const { accountIdx, addressIdx, walletIdx } = this.props

    this.props.componentActions.deleteAddressLabel(
      accountIdx,
      walletIdx,
      addressIdx
    )
    this.props.close()
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
  modalEnhancer('DeleteAddressLabel'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(DeleteAddressLabelContainer)
