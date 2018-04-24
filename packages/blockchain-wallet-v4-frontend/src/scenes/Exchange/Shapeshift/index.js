import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ShapeshiftContainer extends React.Component {
  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep />
      case 2: return <SecondStep />
      default: return <div />
    }
  }
}

const mapStateToProps = state => ({
  step: selectors.components.exchange.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShapeshiftContainer)
