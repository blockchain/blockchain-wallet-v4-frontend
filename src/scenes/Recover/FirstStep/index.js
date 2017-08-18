import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required, validMmemonic } from 'services/FormHelper'
import { Button, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, HelpBlock, TextBox } from 'components/Form'
import RouterLink from 'components/RouterLink'

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
        <FormattedMessage id='scenes.recover.firststep.funds' defaultMessage='Recover funds' />
        <Text size='10px'>
          <FormattedMessage id='scenes.recover.firststep.step1' defaultMessage='Step 1 of 2: Enter 12 word passphrase' />
        </Text>
      </Header>
      <FormattedMessage id='scenes.recover.firststep.explain' defaultMessage='Recover bitcoins from your lost wallet' />
      <Separator />
      <Form>
        <TextGroup>
          <Text color='red'>
            <FormattedMessage id='scenes.recover.firststep.warning' defaultMessage='You should always pair or login if you have access to your Wallet ID and password.' />
            <FormattedMessage id='scenes.recover.firststep.warning2' defaultMessage='Recovering your funds will create a new Wallet ID.' />
          </Text>
        </TextGroup>
        <FormattedMessage id='scenes.recover.firststep.passphrase' defaultMessage='Your recovery phrase' />
        <Field name='passphrase' validate={[required, validMmemonic]} component={TextBox} />
        <HelpBlock>
          <FormattedMessage id='scenes.recover.firststep.passphrase_explain' defaultMessage='Enter your 12 recovery words with spaces to recover your funds & transactions' />
        </HelpBlock>
        <Button nature='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={next}>
          <FormattedMessage id='scenes.recover.firststep.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <RouterLink to='/help'>
          <FormattedMessage id='scenes.recover.firststep.back' defaultMessage='Go back' />
        </RouterLink>
      </Footer>
    </Wrapper>

  )
}

export default FirstStep
