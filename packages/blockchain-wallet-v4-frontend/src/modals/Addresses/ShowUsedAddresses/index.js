import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ShowUsedAddresses from './template'

class ShowUsedAddressesContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { busy: false }
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue() {
    this.setState({ busy: true })
    // ensure busy is set before address derivation begins
    setTimeout(() => {
      this.props.actions.toggleUsedAddresses(this.props.walletIndex, true)
    }, 0)
  }

  render() {
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
  connect(undefined, mapDispatchToProps)
)

export default enhance(ShowUsedAddressesContainer)
