import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { CheckBox, Form, PasswordBox, TextBox } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled.div`
  padding: 5px 0;
`

const SecondStep = (props) => {
  const { handleSubmit, previous, submitting, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.recover.secondstep.funds' defaultMessage='Recover funds' />
        <Text font='10px'>
          <FormattedMessage id='scenes.recover.secondstep.step2' defaultMessage='Step 2 of 2: Create a new wallet' smallest />
        </Text>
      </Header>
      <FormattedMessage id='scenes.recover.secondstep.explain' defaultMessage='Recover bitcoins from your lost wallet' small light altFont />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.recover.secondstep.email' defaultMessage='Email' small medium />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <FormattedMessage id='scenes.recover.secondstep.password' defaultMessage='Password' small medium />
        <Field name='password' validate={[required, validPassword]} component={PasswordBox} score />
        <FormattedMessage id='scenes.recover.secondstep.confirmationPassword' defaultMessage='Confirm Password' small medium />
        <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: Terms}} fullwidth />
        <Button nature='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={handleSubmit}>
          <FormattedMessage id='scenes.recover.secondstep.recover' defaultMessage='Recover funds' />
        </Button>
      </Form>
      <Footer>
        <Link onClick={previous}>
          <FormattedMessage id='scenes.recover.secondstep.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default SecondStep
