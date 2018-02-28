import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions } from 'data'
import { reduxForm, formValueSelector, Field } from 'redux-form'

import { TextBox, Form } from 'components/Form'
import { Text, Button } from 'blockchain-info-components'

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
    this.state = {}

    this.onInputClick = this.onInputClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onInputClick (id) {
    this.setState({ id })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSetBankAccount({
      id: this.state.id,
      name: this.props.holderName
    })
  }

  render () {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
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
          <Field name='accountHolder' component={TextBox} validate={required} />
          <Button type='submit' fullwidth nature='primary' disabled={this.props.submitting || this.props.invalid || !this.state.id}>
            <FormattedMessage id='sfoxexchangedata.link.addaccount' defaultMessage='Add Account' />
          </Button>
        </Form>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  holderName: formValueSelector('sfoxLink')(state, 'accountHolder')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default reduxForm({ form: 'sfoxLink' })(enhance(BankAccounts))
