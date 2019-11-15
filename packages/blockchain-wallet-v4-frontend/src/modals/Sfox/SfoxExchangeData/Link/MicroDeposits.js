import { Field, reduxForm } from 'redux-form'
import { Form, TextBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { PartnerHeader } from 'components/IdentityVerification'
import { required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'
import { Text, TextGroup } from 'blockchain-info-components'
import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

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
          <FormattedMessage
            id='sfoxexchangedata.link.micro.title'
            defaultMessage='Verify Your Bank Account'
          />
        </PartnerHeader>
        {onStep === 'welcome' ? (
          <Fragment>
            <Text size='13px' weight={400}>
              <FormattedMessage
                id='sfoxexchangedata.link.micro.description'
                defaultMessage='To verify your bank details, SFOX will send two micro-deposits to your bank account for a few cents each. Once received, select Enter Deposit Details to finish setting up your account.'
              />
            </Text>
            <TextGroup inline style={spacing('mt-10')}>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='sfoxexchangedata.link.micro.bear'
                  defaultMessage='Bear with us:'
                />
              </Text>
              <Text size='13px' weight={400}>
                <FormattedMessage
                  id='sfoxexchangedata.link.micro.description2'
                  defaultMessage='receiving these deposits can take up to 5 business days.'
                />
              </Text>
            </TextGroup>
          </Fragment>
        ) : (
          <Form>
            <Container>
              <InputContainer>
                <Text size='14px' weight={500} style={spacing('mb-10')}>
                  <FormattedMessage
                    id='sfoxexchangedata.link.micro.deposit1'
                    defaultMessage='Deposit 1'
                  />
                </Text>
                <Field
                  name='deposit1'
                  component={TextBox}
                  validate={[required]}
                  type='number'
                />
              </InputContainer>
              <InputContainer>
                <Text size='14px' weight={500} style={spacing('mb-10')}>
                  <FormattedMessage
                    id='sfoxexchangedata.link.micro.deposit2'
                    defaultMessage='Deposit 2'
                  />
                </Text>
                <Field
                  name='deposit2'
                  component={TextBox}
                  validate={[required]}
                  type='number'
                />
              </InputContainer>
            </Container>
          </Form>
        )}
      </Container>
    )
  }
}

export default reduxForm({ form: 'sfoxLink' })(MicroDeposits)
