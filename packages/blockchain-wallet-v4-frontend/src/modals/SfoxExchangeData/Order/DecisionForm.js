import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Info } from '../styled'
import SelectBar from './SelectBar'
import SelectBarOption from './SelectBarOption'

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
  fiat: (selection, onSelect, fiat) => (
    <SelectBarOption key='fiat' id='fiat' selection={selection} onClick={onSelect}>
      <span>{fiat}</span>
    </SelectBarOption>
  )
}

class DecisionForm extends Component {
  constructor (props) {
    super(props)
    this.state = { method: null, input: null, output: null }

    this.methodOptions = ['buy', 'sell']
    this.inputOptions = ['btc', 'eth', 'bch']
    this.outputOptions = ['fiat'].concat(this.inputOptions)

    this.handleSelectMethod = this.handleSelectMethod.bind(this)
    this.handleSelectCrypto = this.handleSelectCrypto.bind(this)
    this.handleSelectFiat = this.handleSelectFiat.bind(this)
  }

  handleSelectMethod (value) {
    let { method } = this.state
    this.setState({ method: method ? null : value, input: null, output: null })
  }

  handleSelectCrypto (value) {
    let { input } = this.state
    this.setState({ input: input ? null : value, output: null })
  }

  handleSelectFiat (value) {
    let { output } = this.state
    this.setState({ output: output ? null : value })
  }

  render () {
    let { fiat } = this.props
    let { method, input, output } = this.state

    let selections = [
      <Info>
        <FormattedMessage id='placeholder' defaultMessage='What would you like to do?' />
        <SelectBar selection={method}>
          {this.methodOptions.map(m => decisions[m](method, this.handleSelectMethod))}
        </SelectBar>
      </Info>
    ]

    if (method) {
      selections = selections.concat(
        <Info>
          {method === 'buy'
            ? <FormattedMessage id='placeholder' defaultMessage='What would you like to buy?' />
            : <FormattedMessage id='placeholder' defaultMessage='What would you like to sell?' />}
          <SelectBar selection={input}>
            {this.inputOptions
                .map(m => decisions[m](input, this.handleSelectCrypto))}
          </SelectBar>
        </Info>
      )
    }

    if (input) {
      selections = selections.concat(
        <Info>
          {method === 'buy'
            ? <FormattedMessage id='placeholder' defaultMessage='What will you use to buy?' />
            : <FormattedMessage id='placeholder' defaultMessage='What will you receive in exchange?' />}
          <SelectBar selection={output}>
            {this.outputOptions
                .filter(output => output !== input)
                .map(m => decisions[m](output, this.handleSelectFiat, fiat))}
          </SelectBar>
        </Info>
      )
    }

    return selections
  }
}

export default DecisionForm
