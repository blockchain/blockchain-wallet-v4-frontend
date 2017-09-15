import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepVerification from './template.js'

class TwoStepVerificationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.modalActions.showModal(value)
  }

  render () {
    return (
      <TwoStepVerification {...this.props} handleClick={this.handleClick} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepVerification'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(TwoStepVerificationContainer)
