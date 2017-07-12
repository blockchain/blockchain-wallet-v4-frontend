import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  render () {
    return <SecondStep {...this.props} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(SecondStepContainer)
