import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ExchangeForm from '../ExchangeForm'
import PropTypes from 'prop-types'
import React from 'react'

export class ExchangeContainer extends React.PureComponent {
  componentDidMount () {
    this.props.ratesActions.fetchAvailablePairs()
  }

  componentWillUnmount () {
    this.props.actions.clearSubscriptions()
  }

  render () {
    const { from, to, fix, amount } = this.props
    return <ExchangeForm {...{ from, to, fix, amount }} />
  }
}

ExchangeContainer.propTypes = {
  step: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  ratesActions: bindActionCreators(actions.modules.rates, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ExchangeContainer)
