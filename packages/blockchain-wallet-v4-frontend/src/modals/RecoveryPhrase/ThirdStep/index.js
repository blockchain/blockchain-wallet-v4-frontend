import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.Component {
  render () {
    return <ThirdStep {...this.props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
