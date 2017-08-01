import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickCode = this.handleClickCode.bind(this)
    this.handleQRCodeClickBack = this.handleQRCodeClickBack.bind(this)
  }

  handleQRCodeClickBack () {
    this.props.actions.closeModal()
  }

  handleClickCode () {
    this.props.actions.showModalQRCode(this.props.receiveAddress, this.handleQRCodeClickBack)
  }

  render () {
    return <FirstStep {...this.props} handleClickCode={this.handleClickCode} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FirstStepContainer)
