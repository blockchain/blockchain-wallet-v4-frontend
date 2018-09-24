import React, { Component } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { TextBox, Form, FormGroup, FormItem, FormLabel } from 'components/Form'
import { required } from 'services/FormHelper'
import Bank from './Bank'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 15px;
  button {
    margin-top: 20px;
  }
`
const BankHolderFormGroup = styled(FormGroup)`
  margin-top: 20px;
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
          <BankHolderFormGroup inline>
            <FormItem>
              <FormLabel for='accountHolderFirst'>
                <FormattedMessage
                  id='sfoxexchangedata.link.accountholderfirstname'
                  defaultMessage="Account Holder's First Name"
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
                  defaultMessage="Account Holder's Last Name"
                />
              </FormLabel>
              <Field
                name='accountHolderLast'
                component={TextBox}
                validate={required}
              />
            </FormItem>
          </BankHolderFormGroup>
        </Form>
      </Container>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(BankAccounts)
