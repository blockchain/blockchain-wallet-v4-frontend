import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { required, validMmemonic } from 'services/FormHelper'
import { Form, HelpBlock, RouterLink, SecondaryButton, Separator, Text, TextBox, TextGroup } from 'blockchain-info-components'

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

const FirstStep = (props) => {
  const { next, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text id='scenes.recover.firststep.funds' text='Recover funds' biggest light capitalize />
        <Text id='scenes.recover.firststep.step1' text='Step 1 of 2: Enter 12 word passphrase' smallest />
      </Header>
      <Text id='scenes.recover.firststep.explain' text='Recover bitcoins from your lost wallet' small light altFont />
      <Separator />
      <Form>
        <TextGroup>
          <Text id='scenes.recover.firststep.warning' text='You should always pair or login if you have access to your Wallet ID and password.' smaller medium red />
          <Text id='scenes.recover.firststep.warning2' text='Recovering your funds will create a new Wallet ID.' smaller medium red />
        </TextGroup>
        <Text id='scenes.recover.firststep.passphrase' text='Your recovery phrase' small medium />
        <Field name='passphrase' validate={[required, validMmemonic]} component={TextBox} />
        <HelpBlock>
          <Text id='scenes.recover.firststep.passphrase_explain' text='Enter your 12 recovery words with spaces to recover your funds & transactions' small light altFont />
        </HelpBlock>
        <SecondaryButton disabled={submitting || invalid} onClick={next} fullwidth>
          <Text id='scenes.recover.firststep.continue' text='Continue' uppercase white />
        </SecondaryButton>
      </Form>
      <Footer>
        <RouterLink to='/help'><Text id='scenes.recover.firststep.back' text='Go back' small light cyan /></RouterLink>
      </Footer>
    </Wrapper>

  )
}

export default FirstStep
