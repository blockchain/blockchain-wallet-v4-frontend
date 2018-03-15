import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { dissoc } from 'ramda'
import { actions, selectors } from 'data'
import { Row, ColLeft, ColRight, ColLeftInner, Title, Subtitle } from '../styled'
import DecisionForm from './DecisionForm'
import QuoteInput from './QuoteInput'

class Order extends Component {
  constructor (props) {
    super(props)
    this.state = {
      spec: {
        method: null,
        output: null,
        input: null
      }
    }
    this.handleChangeSpec = this.handleChangeSpec.bind(this)
  }

  isSpecComplete () {
    let { spec } = this.state
    return spec.method && spec.output && spec.input
  }

  handleChangeSpec (spec) {
    this.setState({ spec })
  }

  render () {
    let { quoteR, fetchQuote } = this.props
    let { spec } = this.state

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
              <QuoteInput quoteR={quoteR} spec={spec} debounce={500} onFetchQuote={fetchQuote} />
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
