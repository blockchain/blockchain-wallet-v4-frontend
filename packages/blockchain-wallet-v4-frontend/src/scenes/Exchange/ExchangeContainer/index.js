import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model } from 'data'

import ExchangeForm from '../ExchangeForm'
import ExchangeConfirm from '../ExchangeConfirm'
import { getData } from './selectors'

const { EXCHANGE_STEPS } = model.components.exchange

class ExchangeContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.setStep(EXCHANGE_STEPS.EXCHANGE_FORM)
  }

  componentWillUnmount () {
    this.props.actions.clearSubscriptions()
  }

  render () {
    const { step } = this.props
    switch (step) {
      case EXCHANGE_STEPS.EXCHANGE_FORM:
        return <ExchangeForm />
      case EXCHANGE_STEPS.CONFIRM:
        return <ExchangeConfirm />
      default:
        return <ExchangeForm />
    }
  }
}

ExchangeContainer.propTypes = {
  step: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeContainer)
