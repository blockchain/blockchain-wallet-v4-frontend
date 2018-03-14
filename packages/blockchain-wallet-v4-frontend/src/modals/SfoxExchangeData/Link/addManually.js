import React, { Component } from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'

import { TextBox, SelectBoxBankAccountType, Form } from 'components/Form'
import { Text } from 'blockchain-info-components'

import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 25px;
  button {
    margin-top: 20px;
  }
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  button {
    margin-top: 0px;
  }
`

class AddManually extends Component {
  render () {
    return (
      <Form>
        <Container>
          <InputContainer>
            <Text size='14px' weight={500}>
              Full Name of Primary Account Holder
            </Text>
            <Field name='fullName' component={TextBox} validate={[required]} onChange={(e) => this.props.handleFullName(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Routing Number
            </Text>
            <Field name='routingNumber' component={TextBox} validate={[required]} onChange={(e) => this.props.handleRoutingNumber(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Account Number
            </Text>
            <Field name='accountNumber' component={TextBox} validate={[required]} onChange={(e) => this.props.handleAccountNumber(e)} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Account Type
            </Text>
            <Field name='type' component={SelectBoxBankAccountType} validate={[required]} onChange={(e, val) => this.props.handleAccountType(e, val)} />
          </InputContainer>
        </Container>
      </Form>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(AddManually)
