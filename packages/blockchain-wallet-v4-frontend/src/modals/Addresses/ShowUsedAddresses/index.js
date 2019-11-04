import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import ShowUsedAddresses from './template'

class ShowUsedAddressesContainer extends React.PureComponent {
  state = { busy: false }

  handleContinue = () => {
    const { derivation, walletIndex } = this.props
    this.setState({ busy: true })
    // ensure busy is set before address derivation begins
    setTimeout(() => {
      this.props.actions.toggleUsedAddresses(walletIndex, derivation, true)
    }, 0)
  }

  render () {
    return (
      <ShowUsedAddresses
        {...this.props}
        busy={this.state.busy}
        handleContinue={this.handleContinue}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  actions: bindActionCreators(actions.components.manageAddresses, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('ShowUsedAddresses'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(ShowUsedAddressesContainer)
