import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { TextBox, Form } from 'components/Form'
import { PartnerHeader } from 'components/BuySell/Signup'
import { required } from 'services/FormHelper'
import { Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 50%;
`

class MicroDeposits extends Component {
  render () {
    const { onStep } = this.props

    return (
      <Container>
        <PartnerHeader style={spacing('mb-25')}>
          <FormattedMessage id='sfoxexchangedata.link.micro.title' defaultMessage='Verify Your Bank Account' />
        </PartnerHeader>
        {
          onStep === 'welcome'
            ? <Fragment>
              <Text size='13px' weight={300}>
                <FormattedMessage id='sfoxexchangedata.link.micro.description' defaultMessage='To verify your bank details, SFOX will send two micro-deposits to your bank account for a few cents each. Once received, select Enter Deposit Details to finish setting up your account.' />
              </Text>
              <Text size='13px' weight={300} style={spacing('mt-10')}>
                <FormattedHTMLMessage id='sfoxexchangedata.link.micro.description' defaultMessage='<strong>Bear with us:</strong> receiving these deposits can take up to 5 business days.' />
              </Text>
            </Fragment>
            : <Form>
              <Container>
                <InputContainer>
                  <Text size='14px' weight={500} style={spacing('mb-10')}>
                    <FormattedMessage id='sfoxexchangedata.link.micro.deposit1' defaultMessage="Deposit 1" />
                  </Text>
                  <Field name='deposit1' component={TextBox} validate={[required]} type='number' />
                </InputContainer>
                <InputContainer>
                  <Text size='14px' weight={500} style={spacing('mb-10')}>
                    <FormattedMessage id='sfoxexchangedata.link.micro.deposit2' defaultMessage="Deposit 2" />
                  </Text>
                  <Field name='deposit2' component={TextBox} validate={[required]} type='number' />
                </InputContainer>
              </Container>
            </Form>
        }
      </Container>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(MicroDeposits)
