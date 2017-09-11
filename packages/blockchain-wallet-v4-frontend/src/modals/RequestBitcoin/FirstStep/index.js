import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickCode = this.handleClickCode.bind(this)
  }

  handleClickCode () {
    this.props.modalActions.showModal('QRCode', { address: this.props.receiveAddress })
  }

  render () {
    return <FirstStep {...this.props} handleClickCode={this.handleClickCode} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

FirstStepContainer.propTypes = {
  receiveAddress: PropTypes.string
}

export default connect(undefined, mapDispatchToProps)(FirstStepContainer)
