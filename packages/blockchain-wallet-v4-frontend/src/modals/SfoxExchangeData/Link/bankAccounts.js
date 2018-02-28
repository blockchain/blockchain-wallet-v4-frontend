import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
// import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { actions } from 'data'

import { Field, reduxForm } from 'redux-form'
import { TextBox, SelectBoxUSState, Form } from 'components/Form'
import { Text } from 'blockchain-info-components'

import Bank from './bank'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

class BankAccounts extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Form>
          {
            this.props.data.map(bank => {
              return (
                // <Field name='bank' type='radio' component={Bank} bank={bank} value={bank} />
                <Bank bank={bank} />
              )
            })
          }
        </Form>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  bank: 'bank selection'
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

// export default enhance(BankAccounts)
export default reduxForm({ form: 'sfoxLink' })(enhance(BankAccounts))
