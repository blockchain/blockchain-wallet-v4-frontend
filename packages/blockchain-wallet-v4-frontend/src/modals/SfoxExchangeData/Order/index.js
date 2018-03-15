import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { dissoc, merge, identity } from 'ramda'
import { actions, selectors } from 'data'
import { Row, ColLeft, ColRight, ColLeftInner, Title, Subtitle } from '../styled'
import DecisionForm from './DecisionForm'
import FiatConvertor from 'components/Form/FiatConvertor/template.success'
import { Remote } from 'blockchain-wallet-v4/src'
// import styled from 'styled-components'
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

class Order extends Component {
  constructor (props) {
    super(props)

    this.state = {
      spec: {
        method: 'buy',
        output: 'btc',
        input: 'fiat'
      },
      side: 'left',
      left: '250.00',
      right: null
    }

    this.fetchQuote = this.fetchQuote.bind(this)
    this.handleChangeSpec = this.handleChangeSpec.bind(this)
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
    let { side, spec } = this.state
    let convert = side === 'left' ? toCents : toSatoshi
    let toCurrCode = (c) => c === 'fiat' ? 'USD' : c.toUpperCase()
    return {
      amt: convert(this.state[side]),
      baseCurr: toCurrCode(side === 'left' ? spec.input : spec.output),
      quoteCurr: toCurrCode(side === 'left' ? spec.output : spec.input)
    }
  }

  isSpecComplete () {
    let { spec } = this.state
    return spec.method && spec.output && spec.input
  }

  handleChangeSpec (spec) {
    this.setState({ spec })
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
    this.fetchQuoteTimeout = setTimeout(this.fetchQuote, 500)
  }

  fetchQuote () {
    this.props.fetchQuote({ quote: this.getQuoteValues() })
  }

  render () {
    let { quoteR } = this.props
    let { spec, left, right } = this.state

    let rateView = quoteR.map(q => (
      <Text size='12px' weight={300}>
        {parseFloat(q.rate).toFixed(2)} {q.quoteCurrency} = 1 {q.baseCurrency}
      </Text>
    ))

    return (
      <Row>
        <ColLeft>
          <ColLeftInner>
            <Title>
              <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Create Your Order' />
            </Title>
            <Subtitle>
              <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='You can buy or sell any of the available currencies.' />
            </Subtitle>
            <DecisionForm fiat='USD' spec={spec} onChange={this.handleChangeSpec} />
            {this.isSpecComplete() && (
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
            )}
          </ColLeftInner>
        </ColLeft>
        <ColRight>
          <span>Implement Ordering</span>
          <pre>{JSON.stringify(spec, null, 2)}</pre>
          {quoteR.map(q => (
            <pre>{JSON.stringify(dissoc('_delegate', q), null, 2)}</pre>
          )).getOrElse(null)}
        </ColRight>
      </Row>
    )
  }
}

const mapState = (state) => ({
  quoteR: selectors.core.data.sfox.getQuote(state)
})

const mapDispatch = actions.core.data.sfox

export default connect(mapState, mapDispatch)(Order)
