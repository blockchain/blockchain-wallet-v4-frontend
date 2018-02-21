import React from 'react'
import { equals } from 'ramda'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { change, Field, reduxForm, focus } from 'redux-form'
import { Button, Icon, Text, Tooltip } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, NumberBox } from 'components/Form'

const Wrapper = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.theme['gray-1']};
`
const RequiredMessage = styled.div`
  padding: 15px 0;
  border-top: 1px solid ${props => props.theme['gray-1']};
`
const ReasonMessage = styled.div`
  font-size: 12px;
  margin-top: 3px;
  .link {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const AccountsContainer = styled.div`
`
const CheckoutInput = styled(FormGroup)`
  margin-bottom: 0px;
`
const Account = styled.div`
  display: flex;
  padding: 5px 10px;
  align-items: center;
  border: 1px solid ${props => props.theme['gray-1']};
`
const AccountDetails = styled.div`
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  span:first-child { text-transform: capitalize; }
`
const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
`
const Rate = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;
`
const Amount = styled.span`
  font-size: 12px;
  margin-right: 5px;
`

class ExchangeCheckout extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    const { base, quote } = nextProps

    if (quote && !equals(this.props.quote, quote)) {
      if (base === 'fiat') {
        this.props.change('crypto', parseFloat(quote.quoteAmount / 1e8))
        this.setState({ rate: +((1 / (Math.abs(quote.quoteAmount) / 1e8)) * Math.abs(quote.baseAmount)).toFixed(2) })
      }
      if (base === 'crypto') {
        this.props.change('fiat', parseFloat(quote.quoteAmount))
        this.setState({ rate: +((1 / (Math.abs(quote.baseAmount) / 1e8)) * Math.abs(quote.quoteAmount)).toFixed(2) })
      }
    }
  }

  setMax () {
    this.props.dispatch(focus('exchangeCheckout', 'fiat'))
    this.props.dispatch(change('exchangeCheckout', 'fiat', this.props.limit))
    this.props.fetchQuote({ amt: this.props.limit * 100, baseCurr: 'USD', quoteCurr: 'BTC' })
  }

  render () {
    const { rate } = this.state
    const { accounts, continueButton, requiredMsg, reasonMsg, fetchQuote, onSubmit, showRequiredMsg, showReasonMsg } = this.props
    // TODO: Currenices need to be dynamic
    const fiat = 'USD'
    const crypto = 'BTC'

    return (
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <LabelWrapper>
            <Label>
              <FormattedMessage id='scenes.buysell.exchangecheckout.enter_amount' defaultMessage='Enter Amount:' />
            </Label>
            { rate &&
              <Rate>
                <Amount>1 { crypto } = { rate } { fiat }</Amount>
                <Tooltip>
                  <FormattedMessage id='scenes.buysell.exchangecheckout.rate' defaultMessage="The rate offered by your region's exchange partner. May include fees." />
                </Tooltip>
              </Rate>
            }
          </LabelWrapper>
          <CheckoutInput inline>
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
          </CheckoutInput>
          { showReasonMsg && <ReasonMessage onClick={this.setMax.bind(this)}> { reasonMsg } </ReasonMessage> }
          { showRequiredMsg && <RequiredMessage> { requiredMsg } </RequiredMessage> }
          {
            accounts &&
            <AccountsContainer>
              <Text size='14px' weight={300} style={{'margin-bottom': '5px'}}>
                <FormattedMessage id='scenes.buysell.exchangecheckout.synced' defaultMessage='Synced Bank Account:' />
              </Text>
              { accounts.map((account) => {
                return (
                  <Account>
                    <Icon size='24px' name='bank' />
                    <AccountDetails>
                      <span>{account.accountType} ({account.routingNumber})</span>
                      <span>Account Holder: {account.name}</span>
                    </AccountDetails>
                  </Account>
                )
              }) }
            </AccountsContainer>
          }
          <Button type='submit' nature='primary' fullwidth>
            { continueButton }
          </Button>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm({ form: 'exchangeCheckout' })(ExchangeCheckout)
