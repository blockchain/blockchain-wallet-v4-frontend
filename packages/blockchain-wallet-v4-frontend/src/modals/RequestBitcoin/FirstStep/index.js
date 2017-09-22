import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickQRCode = this.handleClickQRCode.bind(this)
  }

  handleClickQRCode () {
    const { receiveAddress } = this.props
    this.props.modalActions.clickRequestBitcoinQRCode(receiveAddress)
  }

  render () {
    return <FirstStep {...this.props} handleClickQRCode={this.handleClickQRCode} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

FirstStepContainer.propTypes = {
  receiveAddress: PropTypes.string
}

export default connect(undefined, mapDispatchToProps)(FirstStepContainer)
