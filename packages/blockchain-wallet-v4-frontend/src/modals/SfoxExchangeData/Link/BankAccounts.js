import React, { Component } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { TextBox, Form, FormGroup, FormItem, FormLabel } from 'components/Form'
import { required } from 'services/FormHelper'
import Bank from './Bank'
import { Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 15px;
  button {
    margin-top: 20px;
  }
`
const HolderText = styled(Text)`
  margin-top: 20px;
  margin-bottom: 5px;
`

class BankAccounts extends Component {
  constructor (props) {
    super(props)
    this.onInputClick = this.onInputClick.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputClick (id) {
    this.props.onBankSelection(id)
  }

  onInputChange (e) {
    this.props.handleNameChange(e.target.value)
  }

  render () {
    return (
      <Container>
        <Form>
          {this.props.data.map(bank => {
            return <Bank bank={bank} onInputClick={this.onInputClick} />
          })}
          <HolderText size='18px' weight={400}>
            <FormattedMessage
              id='sfoxexchangedata.link.accountholder'
              defaultMessage='Account Holder'
            />
          </HolderText>
          <FormGroup inline>
            <FormItem>
              <FormLabel for='accountHolderFirst'>
                <FormattedMessage
                  id='sfoxexchangedata.link.accountholderfirstname'
                  defaultMessage='First Name'
                />
              </FormLabel>
              <Field
                name='accountHolderFirst'
                component={TextBox}
                validate={required}
              />
            </FormItem>
            <FormItem>
              <FormLabel for='accountHolderLast'>
                <FormattedMessage
                  id='sfoxexchangedata.link.accountholderlastname'
                  defaultMessage='Last Name'
                />
              </FormLabel>
              <Field
                name='accountHolderLast'
                component={TextBox}
                validate={required}
              />
            </FormItem>
          </FormGroup>
        </Form>
      </Container>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(BankAccounts)
