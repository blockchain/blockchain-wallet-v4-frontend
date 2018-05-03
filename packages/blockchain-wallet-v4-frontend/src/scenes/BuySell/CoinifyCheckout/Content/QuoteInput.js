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
//
// QuoteInput.propTypes = {
//   quoteR: PropTypes.any.isRequired,
//   initialAmount: PropTypes.string,
//   debounce: PropTypes.number,
//   spec: PropTypes.shape({
//     method: PropTypes.string,
//     output: PropTypes.string,
//     input: PropTypes.string
//   }).isRequired,
//   onFetchQuote: PropTypes.func.isRequired,
//   initialQuoteId: PropTypes.string
// }
//
// QuoteInput.defaultProps = {
//   initialAmount: 0,
//   debounce: 500,
//   initialQuoteId: null
// }

const mapStateToProps = state => ({
  hello: 'world',
  checkoutError: state.coinify.checkoutError
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(QuoteInput)
