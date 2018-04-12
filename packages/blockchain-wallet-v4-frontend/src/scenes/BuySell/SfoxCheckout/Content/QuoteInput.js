import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toUpper } from 'ramda'
import FiatConvertor from 'components/Form/FiatConvertor/template.success'
import { Remote } from 'blockchain-wallet-v4/src'

const WrappedFiatConverter = ({ leftVal, leftUnit, rightVal, rightUnit, disabled, onChangeLeft, onChangeRight }) => (
  <FiatConvertor
    value={leftVal}
    fiat={rightVal}
    data={Remote.of({
      unit: leftUnit,
      currency: rightUnit
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
  />
)

const convert = {
  from: {
    btc: (value) => Math.floor(parseFloat(value) * 1e8),
    usd: (value) => Math.floor(parseFloat(value) * 100)
  },
  to: {
    btc: (value) => (value / 1e8).toFixed(8).replace(/\.?0+$/, ''),
    usd: (value) => String(value).replace(/\.?0+$/, '')
  }
}

const otherSide = (side) => {
  return side === 'input' ? 'output' : 'input'
}

class QuoteInput extends Component {
  state = {
    side: 'input',
    input: this.props.initialAmount,
    output: '0',
    lastQuoteId: null
  }

  static getDerivedStateFromProps (nextProps, lastState) {
    let { quoteR, spec } = nextProps
    let { side } = lastState
    return quoteR.map((quote) => {
      if (quote && quote.id !== lastState.lastQuoteId) {
        return {
          [side]: convert.to[spec[side]](quote.baseAmount),
          [otherSide(side)]: convert.to[spec[otherSide(side)]](quote.quoteAmount),
          lastQuoteId: quote.id
        }
      } else {
        return null
      }
    }).getOrElse(null)
  }

  componentDidMount () {
    this.fetchQuoteDebounced()
  }

  getQuoteValues = () => {
    let { spec } = this.props
    let { side } = this.state
    return {
      amt: convert.from[spec[side]](this.state[side]),
      baseCurr: toUpper(spec[side]),
      quoteCurr: toUpper(spec[otherSide(side)])
    }
  }

  handleChangeLeft = (event) => {
    this.setState({ side: 'input', input: event.target.value })
    this.fetchQuoteDebounced()
  }

  handleChangeRight = (event) => {
    this.setState({ side: 'output', output: event.target.value })
    this.fetchQuoteDebounced()
  }

  fetchQuoteDebounced = () => {
    clearTimeout(this.fetchQuoteTimeout)
    this.fetchQuoteTimeout = setTimeout(this.fetchQuote, this.props.debounce)
  }

  fetchQuote = () => {
    let quote = this.getQuoteValues()
    this.props.onFetchQuote(quote)
  }

  render () {
    let { quoteR, spec } = this.props
    let { input, output } = this.state
    return (
      <WrappedFiatConverter
        leftVal={input}
        leftUnit={toUpper(spec.input)}
        onChangeLeft={this.handleChangeLeft}
        rightVal={output}
        rightUnit={toUpper(spec.output)}
        onChangeRight={this.handleChangeRight}
      />
    )
  }
}

QuoteInput.propTypes = {
  quoteR: PropTypes.any.isRequired,
  initialAmount: PropTypes.string,
  debounce: PropTypes.number,
  spec: PropTypes.shape({
    method: PropTypes.string,
    output: PropTypes.string,
    input: PropTypes.string
  }).isRequired,
  onFetchQuote: PropTypes.func.isRequired
}

QuoteInput.defaultProps = {
  initialAmount: 0,
  debounce: 500
}

export default QuoteInput
