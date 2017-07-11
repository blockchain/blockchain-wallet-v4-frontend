import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Modal from './template.js'

class ModalContainer extends React.Component {
  constructor (props) {
    super(props)
    this.closeCallback = this.closeCallback.bind(this)
  }

  closeCallback () {
    this.props.actions.closeModal()
  }

  render () {
    return (
      <Modal {...this.props} closeCallback={this.closeCallback} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ModalContainer)
