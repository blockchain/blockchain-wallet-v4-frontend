import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required, validEmail, validPassword } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, PasswordBox, TextBox, CheckBox } from 'components/generic/Form'
import { Link } from 'components/generic/Link'
import { Separator } from 'components/generic/Separator'
import { Text } from 'components/generic/Text'

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
const TermsLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const TermsLabel = (
  <TermsLabelContainer>
    <Text id='scenes.register.registerform.read' text='I have read and agree to the' small light />
    <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
      <Text id='scenes.register.registerform.terms' text='Terms of Service' small light cyan />
    </Link>
  </TermsLabelContainer>
)

const SecondStep = (props) => {
  const { handleClickStep2, submitting, invalid } = props
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
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox} props={{children: TermsLabel}} fullwidth />
        <SecondaryButton disabled={submitting || invalid} onClick={handleClickStep2} fullwidth>
          <Text id='scenes.recover.secondstep.recover' text='Recover funds' uppercase white />
        </SecondaryButton>
      </Form>
      <Footer>
        <Link onClick={props.handleGoBackStep2}><Text id='scenes.recover.secondstep.back' text='Go back' small light cyan /></Link>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'recoverForm2' })(SecondStep)
