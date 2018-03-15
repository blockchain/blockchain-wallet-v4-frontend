import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions } from 'data'
import { reduxForm, formValueSelector, Field } from 'redux-form'

import { TextBox, Form, SelectBoxBankAccountType } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'

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
const AddAccountButton = styled(Button)`
  margin-top: 0px !important;
`

class AddManually extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.onInputClick = this.onInputClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onInputClick (id) {
    this.setState({ id })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSetBankManually(
      this.props.routingNumber,
      this.props.accountNumber,
      this.props.fullName,
      this.props.type
    )
  }

  render () {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Container>
          <InputContainer>
            <Text size='14px' weight={500}>
              Full Name of Primary Account Holder
            </Text>
            <Field name='fullName' component={TextBox} validate={[required]} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Routing Number
            </Text>
            <Field name='routingNumber' component={TextBox} validate={[required]} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Account Number
            </Text>
            <Field name='accountNumber' component={TextBox} validate={[required]} />
          </InputContainer>
          <InputContainer>
            <Text size='14px' weight={500}>
              Account Type
            </Text>
            <Field name='type' component={SelectBoxBankAccountType} validate={[required]} />
          </InputContainer>
          <AddAccountButton type='submit' fullwidth nature='primary' disabled={this.props.invalid || this.props.submitting}>
            Add Account
          </AddAccountButton>
        </Container>
      </Form>
    )
  }
}

const mapStateToProps = (state) => ({
  fullName: formValueSelector('sfoxAddManually')(state, 'fullName'),
  routingNumber: formValueSelector('sfoxAddManually')(state, 'routingNumber'),
  accountNumber: formValueSelector('sfoxAddManually')(state, 'accountNumber'),
  type: formValueSelector('sfoxAddManually')(state, 'type')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default reduxForm({ form: 'sfoxAddManually' })(enhance(AddManually))
