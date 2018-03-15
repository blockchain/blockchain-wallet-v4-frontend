import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { merge, identity } from 'ramda'
import FiatConvertor from 'components/Form/FiatConvertor/template.success'
import { Remote } from 'blockchain-wallet-v4/src'
import { Text } from 'blockchain-info-components'
import { flex, spacing } from 'services/StyleService'

const toCents = (x) => parseFloat(x) * 100
// const fromCents = (x) => (x / 100).toString()
const toSatoshi = (x) => parseFloat(x) * 1e8
const fromSatoshi = (x) => (x / 1e8).toString()

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
      side: 'left',
      left: '0',
      right: '0'
    }
    this.fetchQuote = this.fetchQuote.bind(this)
    this.handleChangeLeft = this.handleChangeLeft.bind(this)
    this.handleChangeRight = this.handleChangeRight.bind(this)
  }

  componentWillMount () {
    this.fetchQuoteDebounced()
  }

  componentWillReceiveProps (props) {
    let quoteAmount = props.quoteR.map(q => (q.quoteCurrency === 'USD' ? identity : fromSatoshi)(q.quoteAmount)).getOrElse(0)
    this.setState({ [this.getQuoteSide()]: quoteAmount })
  }

  getQuoteSide () {
    return this.state.side === 'left' ? 'right' : 'left'
  }

  getQuoteValues () {
    let { spec } = this.props
    let { side } = this.state
    let convert = side === 'left' ? toCents : toSatoshi
    let toCurrCode = (c) => c === 'fiat' ? 'USD' : c.toUpperCase()
    return {
      amt: convert(this.state[side]),
      baseCurr: toCurrCode(side === 'left' ? spec.input : spec.output),
      quoteCurr: toCurrCode(side === 'left' ? spec.output : spec.input)
    }
  }

  handleChangeLeft (event) {
    this.setState({ side: 'left', left: event.target.value })
    this.fetchQuoteDebounced()
  }

  handleChangeRight (event) {
    this.setState({ side: 'right', right: event.target.value })
    this.fetchQuoteDebounced()
  }

  fetchQuoteDebounced () {
    clearTimeout(this.fetchQuoteTimeout)
    this.fetchQuoteTimeout = setTimeout(this.fetchQuote, this.props.debounce)
  }

  fetchQuote () {
    let quote = this.getQuoteValues()
    if (isNaN(quote.amt) || quote.amt <= 0) return
    this.props.onFetchQuote({ quote: this.getQuoteValues() })
  }

  render () {
    let { spec, quoteR } = this.props
    let { left, right } = this.state

    let rateView = quoteR.map(q => (
      <Text size='12px' weight={300}>
        {parseFloat(q.rate).toFixed(2)} {q.quoteCurrency} = 1 {q.baseCurrency}
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
          leftVal={left}
          leftUnit={spec.input === 'fiat' ? 'USD' : spec.input.toUpperCase()}
          onChangeLeft={this.handleChangeLeft}
          rightVal={right}
          rightUnit={spec.output.toUpperCase()}
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
