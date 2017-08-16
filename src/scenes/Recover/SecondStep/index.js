import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { CheckBox, Form, Link, PasswordBox, SecondaryButton, Separator, Text, TextBox } from 'blockchain-info-components'
import Terms from 'components/shared/Terms'

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
        <Text id='scenes.recover.secondstep.funds' text='Recover funds' biggest light capitalize />
        <Text id='scenes.recover.secondstep.step2' text='Step 2 of 2: Create a new wallet' smallest />
      </Header>
      <Text id='scenes.recover.secondstep.explain' text='Recover bitcoins from your lost wallet' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.recover.secondstep.email' text='Email' small medium />
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text id='scenes.recover.secondstep.password' text='Password' small medium />
        <Field name='password' validate={[required, validPassword]} component={PasswordBox} score />
        <Text id='scenes.recover.secondstep.confirmationPassword' text='Confirm Password' small medium />
        <Field name='confirmationPassword' validate={[required, validPassword]} component={PasswordBox} />
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: Terms}} fullwidth />
        <SecondaryButton disabled={submitting || invalid} onClick={handleSubmit} fullwidth>
          <Text id='scenes.recover.secondstep.recover' text='Recover funds' uppercase white />
        </SecondaryButton>
      </Form>
      <Footer>
        <Link onClick={previous}><Text id='scenes.recover.secondstep.back' text='Go back' small light cyan /></Link>
      </Footer>
    </Wrapper>
  )
}

export default SecondStep
