import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import { actions, selectors } from 'adapter'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ShapeshiftContainer extends React.Component {
  componentDidMount() {
    this.props.actions.initialized()
  }

  render() {
    switch (this.props.step) {
      case 1: return <FirstStep actions={actions} />
      case 2: return <SecondStep actions={actions} />
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
