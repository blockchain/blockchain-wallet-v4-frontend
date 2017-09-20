import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileNumberChange from './template.js'

class MobileNumberChangeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleUpdate () {
    this.props.modalActions.clickMobileNumberChangeUpdate()
  }

  handleCancel () {
    this.props.modalActions.clickMobileNumberChangeCancel()
  }

  render () {
    return (
      <MobileNumberChange {...this.props} handleUpdate={this.handleUpdate} handleCancel={this.handleCancel} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberChange'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(MobileNumberChangeContainer)
