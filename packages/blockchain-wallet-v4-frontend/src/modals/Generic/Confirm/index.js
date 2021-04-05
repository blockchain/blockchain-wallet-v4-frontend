import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ConfirmTemplate from './template'

class ConfirmContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.actions.submitConfirmation(this.props.value)
    this.props.close()
  }

  render() {
    return <ConfirmTemplate {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  actions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  modalEnhancer('Confirm'),
  connect(null, mapDispatchToProps)
)

export default enhance(ConfirmContainer)
