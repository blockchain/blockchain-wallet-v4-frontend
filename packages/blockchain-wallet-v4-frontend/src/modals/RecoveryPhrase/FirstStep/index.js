import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <FirstStep {...this.props} handleClose={this.handleClose} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mnemonic: selectors.core.wallet.getSeedHex(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
