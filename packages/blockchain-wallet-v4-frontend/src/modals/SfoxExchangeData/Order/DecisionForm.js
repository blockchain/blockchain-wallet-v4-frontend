import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Info } from 'components/BuySell/Signup'
import SelectBar from './SelectBar'
import SelectBarOption from './SelectBarOption'
import SelectBarHeader from './SelectBarHeader'

const TRANSITION_TIME = '250ms'

const methodOptions = ['buy', 'sell']
const outputOptions = ['btc', 'eth', 'bch']
const inputOptions = ['usd'].concat(outputOptions)

const decisions = {
  buy: (selection, onSelect) => (
    <SelectBarOption key='buy' id='buy' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='Buy' />
    </SelectBarOption>
  ),
  sell: (selection, onSelect) => (
    <SelectBarOption key='sell' id='sell' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='Sell' />
    </SelectBarOption>
  ),
  btc: (selection, onSelect) => (
    <SelectBarOption key='btc' id='btc' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='Bitcoin' />
    </SelectBarOption>
  ),
  eth: (selection, onSelect) => (
    <SelectBarOption key='eth' id='eth' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='Ethereum' />
    </SelectBarOption>
  ),
  bch: (selection, onSelect) => (
    <SelectBarOption key='bch' id='bch' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='Bitcoin Cash' />
    </SelectBarOption>
  ),
  usd: (selection, onSelect) => (
    <SelectBarOption key='usd' id='usd' selection={selection} onClick={onSelect}>
      <FormattedMessage id='placeholder' defaultMessage='USD' />
    </SelectBarOption>
  )
}

class DecisionForm extends Component {
  constructor (props) {
    super(props)
    this.handleSelectMethod = this.handleSelectMethod.bind(this)
    this.handleSelectCrypto = this.handleSelectCrypto.bind(this)
    this.handleSelectFiat = this.handleSelectFiat.bind(this)
  }

  applyChange (change) {
    this.props.onChange(Object.assign({}, this.props.spec, change))
  }

  handleSelectMethod (value) {
    this.applyChange({ method: this.props.spec.method ? null : value, output: null, input: null })
  }

  handleSelectCrypto (value) {
    this.applyChange({ output: this.props.spec.output ? null : value, input: null })
  }

  handleSelectFiat (value) {
    this.applyChange({ input: this.props.spec.input ? null : value })
  }

  render () {
    let { spec } = this.props
    let { method, output, input } = spec

    let selections = [
      <Info>
        <SelectBarHeader selected={!!method} timing={TRANSITION_TIME}>
          <FormattedMessage id='placeholder' defaultMessage='What would you like to do?' />
        </SelectBarHeader>
        <SelectBar selection={method} timing={TRANSITION_TIME}>
          {methodOptions
              .map(m => decisions[m](method, this.handleSelectMethod))}
        </SelectBar>
      </Info>
    ]

    if (method) {
      selections = selections.concat(
        <Info>
          <SelectBarHeader selected={!!output} timing={TRANSITION_TIME}>
            {method === 'buy'
              ? <FormattedMessage id='placeholder' defaultMessage='What would you like to buy?' />
              : <FormattedMessage id='placeholder' defaultMessage='What would you like to sell?' />}
          </SelectBarHeader>
          <SelectBar selection={output} timing={TRANSITION_TIME}>
            {outputOptions
                .map(m => decisions[m](output, this.handleSelectCrypto))}
          </SelectBar>
        </Info>
      )
    }

    if (output) {
      selections = selections.concat(
        <Info>
          <SelectBarHeader selected={!!input} timing={TRANSITION_TIME}>
            {method === 'buy'
              ? <FormattedMessage id='placeholder' defaultMessage='What will you use to buy?' />
              : <FormattedMessage id='placeholder' defaultMessage='What will you receive in exchange?' />}
          </SelectBarHeader>
          <SelectBar selection={input} timing={TRANSITION_TIME}>
            {inputOptions
                .filter(input => input !== output)
                .map(m => decisions[m](input, this.handleSelectFiat))}
          </SelectBar>
        </Info>
      )
    }

    return selections
  }
}

DecisionForm.propTypes = {
  spec: PropTypes.shape({
    method: PropTypes.oneOf(methodOptions),
    output: PropTypes.oneOf(outputOptions),
    input: PropTypes.oneOf(inputOptions)
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default DecisionForm
