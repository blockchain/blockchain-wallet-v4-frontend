import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toUpper, path } from 'ramda'
import FiatConvertor from './QuoteInputTemplate'
import { Remote } from 'blockchain-wallet-v4/src'

const WrappedFiatConverter = ({ leftVal, leftUnit, rightVal, rightUnit, disabled, onChangeLeft, onChangeRight, limits }) => (
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
    limits={limits}
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
  constructor (props) {
    super(props)
    this.state = {
      side: 'input',
      input: this.props.initialAmount,
      output: '',
      lastQuoteId: this.props.initialQuoteId,
      userInput: false
    }

    this.updateFields = this.updateFields.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.type !== this.props.type) this.fetchQuoteDebounced()
    this.props.quoteR.map(quote => {
      if (quote.id !== path(['quoteR', 'data', 'id'], prevProps)) {
        this.updateFields(quote)
      }
    })
  }

  updateFields (quote) {
    if (!this.state.userInput) return null
    let fiat = this.state.side === 'input' ? quote.baseAmount : quote.quoteAmount
    let crypto = this.state.side === 'output' ? quote.baseAmount / 1e8 : quote.quoteAmount / 1e8
    this.setState({
      input: fiat,
      output: crypto
    })
  }

  getQuoteValues = () => {
    let { spec } = this.props
    let { side } = this.state
    return {
      amt: convert.from[spec[side]](this.state[side]),
      baseCurrency: toUpper(spec[side]),
      quoteCurrency: toUpper(spec[otherSide(side)])
    }
  }

  handleChangeLeft = (event) => {
    this.setState({ side: 'input', input: event.target.value, userInput: true })
    if (!event.target.value) {
      this.setState({ input: '', output: '' })
      return null
    }
    this.fetchQuoteDebounced()
  }

  handleChangeRight = (event) => {
    this.setState({ side: 'output', output: event.target.value, userInput: true })
    if (!event.target.value) {
      this.setState({ input: '', output: '' })
      return null
    }
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
    let { spec, disabled, limits } = this.props
    let { input, output, fiatAmount, userInput } = this.state

    if (fiatAmount > limits.max || fiatAmount < limits.min) this.props.disableButton()
    else this.props.enableButton()

    return (
      <WrappedFiatConverter
        leftVal={input}
        leftUnit={toUpper(spec.input)}
        onChangeLeft={this.handleChangeLeft}
        rightVal={output}
        rightUnit={toUpper(spec.output)}
        onChangeRight={this.handleChangeRight}
        limits={this.props.limits}
        disabled={disabled}
        userInput={userInput}
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
  onFetchQuote: PropTypes.func.isRequired,
  initialQuoteId: PropTypes.string
}

QuoteInput.defaultProps = {
  initialAmount: '',
  debounce: 500,
  initialQuoteId: null
}

export default QuoteInput
