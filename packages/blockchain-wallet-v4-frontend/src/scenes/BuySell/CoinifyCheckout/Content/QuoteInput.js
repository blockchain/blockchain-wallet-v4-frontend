import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FiatConvertor from './QuoteInputTemplate'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const WrappedFiatConverter = ({ checkoutError, disabled, limits, defaultCurrency, symbol, setMax }) => (
  <FiatConvertor
    disabled={disabled}
    unit={'__required__'}
    currency={'__required__'}
    limits={limits}
    defaultCurrency={defaultCurrency}
    symbol={symbol}
    setMax={setMax}
    checkoutError={checkoutError}
  />
)

class QuoteInput extends Component {
  componentDidMount () {
    this.props.actions.initializeCheckoutForm()
  }
  componentWillUnmount () {
    this.props.actions.initializeCheckoutForm()
  }
  render () {
    let { symbol, setMax, checkoutError } = this.props

    return (
      <WrappedFiatConverter
        rightUnit='BTC'
        limits={this.props.limits}
        // disabled={disabled}
        defaultCurrency={this.props.defaultCurrency}
        symbol={symbol}
        setMax={setMax}
        checkoutError={checkoutError}
      />
    )
  }
}

QuoteInput.propTypes = {
  limits: PropTypes.object.isRequired,
  defaultCurrency: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  setMax: PropTypes.func.isRequired,
  checkoutError: PropTypes.bool
}

const mapStateToProps = state => ({
  checkoutError: state.coinify.checkoutError
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(QuoteInput)
