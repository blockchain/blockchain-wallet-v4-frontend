import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  render () {
    return <SecondStep {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
