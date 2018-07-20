import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptTemplate from './template.js'

class ConfirmContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onSubmit () {
    this.props.actions.submitConfirmation(this.props.value)
  }

  onCancel () {
    this.props.modalActions.closeModal()
  }

  render () {
    return (
      <PromptTemplate
        {...this.props}
        onSubmit={this.onSubmit}
        handleCancel={this.onCancel}
      />
    )
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
