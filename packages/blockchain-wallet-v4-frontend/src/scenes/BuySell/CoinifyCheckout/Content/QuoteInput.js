import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toUpper } from 'ramda'
import FiatConvertor from './QuoteInputTemplate'
import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const WrappedFiatConverter = ({ leftVal, leftUnit, rightVal, rightUnit, disabled, onChangeLeft, onChangeRight, limits, defaultCurrency, symbol, setMax }) => (
  <FiatConvertor
    value={leftVal}
    fiat={rightVal}
    data={Remote.of({
      unit: leftUnit,
      currency: 'BTC'
    })}
    disabled={disabled}
    handleCoinChange={onChangeLeft}
    handleFiatChange={onChangeRight}
    unit={'__required__'}
    currency={'__required__'}
    handleBlur={() => {}}
    handleFocus={() => {}}
    handleErrorClick={() => {}}
    meta={{}}
    limits={limits}
    defaultCurrency={defaultCurrency}
    symbol={symbol}
    setMax={setMax}
  />
)

const otherSide = (side) => {
  return side === 'input' ? 'output' : 'input'
}

class QuoteInput extends Component {
  // static getDerivedStateFromProps (nextProps, lastState) {
  //   const convert = {
  //     from: {
  //       btc: (value) => Math.floor(parseFloat(value) * 1e8),
  //       [nextProps.defaultCurrency]: (value) => Math.floor(parseFloat(value) * 100)
  //     },
  //     to: {
  //       btc: (value) => (value / 1e8).toFixed(8).replace(/\.?0+$/, ''),
  //       [nextProps.defaultCurrency]: (value) => String(value)// .replace(/\.?0+$/, '')
  //     }
  //   }
  //   let { quoteR, spec } = nextProps
  //   let { side } = lastState
  //   return quoteR.map((quote) => {
  //     if (quote && quote.id !== lastState.lastQuoteId) {
  //       return {
  //         [side]: convert.to[spec[side]](quote.baseAmount) * -1,
  //         [otherSide(side)]: convert.to[spec[otherSide(side)]](quote.quoteAmount),
  //         lastQuoteId: quote.id
  //       }
  //     } else {
  //       return null
  //     }
  //   }).getOrElse(null)
  // }

  constructor (props) {
    super(props)

    this.state = {
      side: 'input',
      input: this.props.initialAmount,
      output: '0',
      lastQuoteId: this.props.initialQuoteId
    }

    // this.handleChangeLeft = this.handleChangeLeft.bind(this)
    // this.handleChangeRight = this.handleChangeRight.bind(this)
    // this.getQuoteValues = this.getQuoteValues.bind(this)
    // this.fetchQuote = this.fetchQuote.bind(this)
  }

  componentDidMount () {
    // this.fetchQuoteDebounced()
  }

  componentDidUpdate (prevProps) {
    // if (prevProps.type !== this.props.type) this.fetchQuoteDebounced()
    // console.log('cDU QuoteInput', this.state, this.props, prevProps)
  }

  handleChangeLeft (event) {
    // this.setState({ side: 'input', input: event.target.value })
    // this.fetchQuoteDebounced()
  }

  handleChangeRight (event) {
    // this.setState({ side: 'output', output: event.target.value })
    // this.fetchQuoteDebounced()
  }

  fetchQuoteDebounced () {
    // clearTimeout(this.fetchQuoteTimeout)
    // this.fetchQuoteTimeout = setTimeout(this.fetchQuote, this.props.debounce)
  }

  fetchQuote () {
    const getQuoteValues = (props, state) => {
      console.log('inside getQuoteValues', props, state)
      let { spec } = props
      let { side } = state

      const convert = {
        from: {
          btc: (value) => Math.floor(parseFloat(value) * 1e8),
          [props.defaultCurrency]: (value) => Math.floor(parseFloat(value) * 100)
        },
        to: {
          btc: (value) => (value / 1e8).toFixed(8).replace(/\.?0+$/, ''),
          [props.defaultCurrency]: (value) => String(value)// .replace(/\.?0+$/, '')
        }
      }

      return {
        amt: convert.from[spec[side]](this.state[side]),
        baseCurr: toUpper(spec[side]),
        quoteCurr: toUpper(spec[otherSide(side)])
      }
    }
    console.log('inside fetchQuote', this.props, this.state)
    let quote = getQuoteValues(this.props, this.state)
    if ((quote.amt / 100) < this.props.limits.min) return
    this.props.onFetchQuote(quote)
  }

  render () {
    let { symbol, setMax } = this.props
    // let { input, output } = this.state

    return (
      <WrappedFiatConverter
        // leftVal={input}
        // leftUnit={toUpper(spec.input)}
        onChangeLeft={this.handleChangeLeft}
        // rightVal={output}
        rightUnit='BTC'
        onChangeRight={this.handleChangeRight}
        limits={this.props.limits}
        // disabled={disabled}
        defaultCurrency={this.props.defaultCurrency}
        symbol={symbol}
        setMax={setMax}
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
  hello: 'world'
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(QuoteInput)
