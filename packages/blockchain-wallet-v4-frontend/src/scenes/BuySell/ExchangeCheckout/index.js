import React from 'react'
import { equals } from 'ramda'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { Button } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, NumberBox } from 'components/Form'

const Wrapper = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.theme['gray-1']};
`
const MessageContainer = styled.div`
  padding: 15px 0;
  border-top: 1px solid ${props => props.theme['gray-1']};
`

class ExchangeCheckout extends React.Component {
  componentWillReceiveProps (nextProps) {
    const { base, quote } = nextProps

    if (quote && !equals(this.props.quote, quote)) {
      if (base === 'fiat') this.props.change('crypto', parseFloat(quote.quoteAmount / 1e8))
      if (base === 'crypto') this.props.change('fiat', parseFloat(quote.quoteAmount))
    }
  }

  render () {
    const { continueButton, continueMsg, fetchQuote, onSubmit } = this.props
    // Currenices need to be dynamic
    const fiat = 'USD'
    const crypto = 'BTC'
    // Currenices need to be dynamic
    return (
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <FormGroup inline>
            <FormItem width='50%'>
              <Field
                name='fiat'
                component={NumberBox}
                onChange={event => fetchQuote({ amt: event.target.value * 100, baseCurr: fiat, quoteCurr: crypto })}
              />
            </FormItem>
            <FormItem width='50%'>
              <Field
                name='crypto'
                component={NumberBox}
                onChange={event => fetchQuote({ amt: event.target.value * 1e8, baseCurr: crypto, quoteCurr: fiat })}
              />
            </FormItem>
          </FormGroup>
          <MessageContainer>
            { continueMsg }
          </MessageContainer>
          <Button type='submit' nature='primary' fullwidth>
            { continueButton }
          </Button>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm({ form: 'exchangeCheckout' })(ExchangeCheckout)
