import React, { Component } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { TextBox, Form } from 'components/Form'
import { Text } from 'blockchain-info-components'
import { required } from 'services/FormHelper'
import Bank from './bank'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  button {
    margin-top: 20px;
  }
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
          {
            this.props.data.map(bank => {
              return (
                <Bank bank={bank} onInputClick={this.onInputClick} />
              )
            })
          }
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.link.accountholdername' defaultMessage="Account Holder's Name" />
          </Text>
          <Field name='accountHolder' component={TextBox} validate={required} onChange={this.onInputChange} />
        </Form>
      </Container>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(BankAccounts)
