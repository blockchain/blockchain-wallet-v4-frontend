import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
// import ExchangeTimeline from 'components/ExchangeTimeline'

class ShapeshiftContainer extends React.Component {
  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep />
      case 2: return <SecondStep />
      case 3: return <ThirdStep />
      default: return <FirstStep />
    }
    // return <ExchangeTimeline status='no_deposit' />
  }
}

const mapStateToProps = state => ({
  step: selectors.components.exchange.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShapeshiftContainer)
