import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, HeartbeatLoader, Separator, Text } from 'blockchain-info-components'
import { CheckBox, Form, FormGroup, PasswordBox, TextBox } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const GoBackLink = styled(Link)`
  margin-right: 15px;
`

const validatePasswordsMatch = values => {
  return values.password === values.confirmationPassword ? {} : { confirmationPassword: 'Passwords must match' }
}

const SecondStep = (props) => {
  const { busy, onSubmit, previousStep, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.recover.secondstep.funds' defaultMessage='Recover Funds' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.recover.secondstep.step2' defaultMessage='Step 2 of 2: Create a new wallet' />
        </Text>
      </Header>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.recover.secondstep.explain' defaultMessage='Recover funds from your lost wallet' />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.recover.secondstep.email' defaultMessage='Email' />
          </Text>
          <Field name='email' validate={[required, validEmail]} component={TextBox} />
        </FormGroup>
        <FormGroup>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.recover.secondstep.password' defaultMessage='Password' />
          </Text>
          <Field name='password' validate={[required]} component={PasswordBox} score />
        </FormGroup>
        <FormGroup>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.recover.secondstep.confirmationPassword' defaultMessage='Confirm Password' />
          </Text>
          <Field name='confirmationPassword' validate={[required]} component={PasswordBox} />
        </FormGroup>
        <FormGroup>
          <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
            <Terms />
          </Field>
        </FormGroup>
        <Footer>
          <GoBackLink onClick={previousStep} size='13px' weight={300}>
            <FormattedMessage id='scenes.recover.secondstep.back' defaultMessage='Go Back' />
          </GoBackLink>
          <Button type='submit' nature='primary' uppercase disabled={busy || invalid}>
            { busy
              ? <HeartbeatLoader height='20px' width='20px' color='white' />
              : <FormattedMessage id='scenes.recover.secondstep.recover' defaultMessage='Recover Funds' />
            }
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({
  form: 'recover',
  destroyOnUnmount: false,
  validate: validatePasswordsMatch
})(SecondStep)
