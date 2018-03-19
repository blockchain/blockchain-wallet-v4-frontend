import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { merge, toUpper } from 'ramda'
import FiatConvertor from 'components/Form/FiatConvertor/template.success'
import { Remote } from 'blockchain-wallet-v4/src'
import { Text } from 'blockchain-info-components'
import { flex, spacing } from 'services/StyleService'

const WrappedFiatConverter = ({ leftVal, leftUnit, rightVal, rightUnit, onChangeLeft, onChangeRight }) => (
  <FiatConvertor
    value={leftVal}
    fiat={rightVal}
    data={Remote.of({
      unit: leftUnit,
      currency: rightUnit
    })}
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

class QuoteInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      side: 'input',
      input: '0',
      output: '0'
    }
    this.fetchQuote = this.fetchQuote.bind(this)
    this.handleChangeLeft = this.handleChangeLeft.bind(this)
    this.handleChangeRight = this.handleChangeRight.bind(this)
  }

  componentWillMount () {
    this.fetchQuoteDebounced()
  }

  componentWillReceiveProps (props) {
    let changeState = props.quoteR
      .map(q => ({ input: q.quote_amount, output: q.base_amount }))
      .getOrElse({})
    this.setState(changeState)
  }

  getQuoteValues () {
    let { spec } = this.props
    let { side } = this.state
    return {
      action: spec.method,
      amount: this.state[side],
      amountCurrency: spec[side],
      baseCurrency: spec.output,
      quoteCurrency: spec.input
    }
  }

  handleChangeLeft (event) {
    this.setState({ side: 'input', input: event.target.value })
    this.fetchQuoteDebounced()
  }

  handleChangeRight (event) {
    this.setState({ side: 'output', output: event.target.value })
    this.fetchQuoteDebounced()
  }

  fetchQuoteDebounced () {
    clearTimeout(this.fetchQuoteTimeout)
    this.fetchQuoteTimeout = setTimeout(this.fetchQuote, this.props.debounce)
  }

  fetchQuote () {
    let quote = this.getQuoteValues()
    if (isNaN(quote.amount) || quote.amount <= 0) return
    this.props.onFetchQuote(quote)
  }

  render () {
    let { spec, quoteR } = this.props
    let { input, output } = this.state

    let rateView = quoteR.map(q => (
      <Text size='12px' weight={300}>
        {parseFloat(q.rate).toFixed(2)} {toUpper(q.quote_currency)} = 1 {toUpper(q.base_currency)}
      </Text>
    ))

    return (
      <div style={spacing('mt-30')}>
        <Text>
          <FormattedMessage id='placeholder' defaultMessage='How much do you want to buy?' />
        </Text>
        <div style={merge(flex('row justify/end'), spacing('mb-5'))}>
          {rateView.getOrElse(null)}
        </div>
        <WrappedFiatConverter
          leftVal={input}
          leftUnit={toUpper(spec.input)}
          onChangeLeft={this.handleChangeLeft}
          rightVal={output}
          rightUnit={toUpper(spec.output)}
          onChangeRight={this.handleChangeRight}
        />
      </div>
    )
  }
}

QuoteInput.propTypes = {
  quoteR: PropTypes.any.isRequired,
  debounce: PropTypes.number.isRequired,
  spec: PropTypes.shape({
    method: PropTypes.string,
    output: PropTypes.string,
    input: PropTypes.string
  }).isRequired,
  onFetchQuote: PropTypes.func.isRequired
}

export default QuoteInput
