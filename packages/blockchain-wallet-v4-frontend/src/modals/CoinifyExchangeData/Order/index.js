import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class OrderContainer extends Component {
  constructor (props) {
    super(props)

    this.getBuyQuote = this.getBuyQuote.bind(this)
    this.nextStep = this.nextStep.bind(this)
  }
  getBuyQuote () {
    this.props.coinifyDataActions.fetchQuote({ amt: 15000, baseCurrency: 'EUR', quoteCurrency: 'BTC' })
  }
  nextStep () {
    this.props.coinifyDataActions.getPaymentMediums(this.props.quote.data)
    this.props.coinifyActions.coinifyNextStep('payment')
  }

  render () {
    return (
      <div>
        <h3>Order Step</h3>
        <button onClick={this.getBuyQuote}>Buy</button>
        <button onClick={this.nextStep}>next step</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  quote: selectors.core.data.coinify.getQuote(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(OrderContainer)
