import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import ConfirmTemplate from './template'
import modalEnhancer from 'providers/ModalEnhancer'

class ConfirmContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.actions.submitConfirmation(this.props.value)
    this.props.close()
  }

  render () {
    return <ConfirmTemplate {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  actions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  modalEnhancer('Confirm'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(ConfirmContainer)
