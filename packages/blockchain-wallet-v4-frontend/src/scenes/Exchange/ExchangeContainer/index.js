import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model } from 'data'

import ExchangeForm from '../ExchangeForm'
import ExchangeConfirm from '../ExchangeConfirm'
import { getData } from './selectors'

const { EXCHANGE_STEPS } = model.components.exchange

export class ExchangeContainer extends React.PureComponent {
  componentDidMount () {
    this.props.profileActions.fetchUser()
    this.props.actions.setStep(EXCHANGE_STEPS.EXCHANGE_FORM)
  }

  componentDidUpdate () {
    // Clear location state when going to confirm screen
    // So that it won't force swap when going back to exchange
    if (this.props.step === EXCHANGE_STEPS.CONFIRM)
      this.props.routerActions.replace('/swap', {})
  }

  componentWillUnmount () {
    this.props.actions.clearSubscriptions()
  }

  render () {
    const { step, from, to, fix, amount } = this.props
    switch (step) {
      case EXCHANGE_STEPS.EXCHANGE_FORM:
        return <ExchangeForm {...{ from, to, fix, amount }} />
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
  actions: bindActionCreators(actions.components.exchange, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ExchangeContainer)
