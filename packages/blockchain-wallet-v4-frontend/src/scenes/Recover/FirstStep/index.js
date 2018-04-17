import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validMnemonic } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'

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
const Footer = styled.div`
  padding: 5px 0;
`

const FirstStep = (props) => {
  const { nextStep, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.recover.firststep.funds' defaultMessage='Recover Funds' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.recover.firststep.step1' defaultMessage='Step 1 of 2: Enter 12 word passphrase' />
        </Text>
      </Header>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.recover.firststep.explain' defaultMessage='Recover funds from your lost wallet' />
      </Text>
      <Separator />
      <Form onSubmit={nextStep}>
        <TextGroup inline>
          <Text size='13px' weight={300} color='error'>
            <FormattedMessage id='scenes.recover.firststep.warning' defaultMessage='You should always pair or login if you have access to your Wallet ID and password.' />
          </Text>
          <Text size='13px' weight={300} color='error'>
            <FormattedMessage id='scenes.recover.firststep.warning2' defaultMessage='Recovering your funds will create a new Wallet ID.' />
          </Text>
        </TextGroup>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.recover.firststep.mnemonic' defaultMessage='Your backup phrase' />
        </Text>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.recover.firststep.mnemonic_explain' defaultMessage='Enter your 12 word phrase, with spaces between each, to recover your funds & transactions.' />
        </Text>
        <Field name='mnemonic' validate={[required, validMnemonic]} component={TextBox} />
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
          <FormattedMessage id='scenes.recover.firststep.continue' defaultMessage='Continue' />
        </Button>
      </Form>
      <Footer>
        <LinkContainer to='/help'>
          <Link size='13px' weight={300}>
            <FormattedMessage id='scenes.recover.firststep.back' defaultMessage='Go Back' />
          </Link>
        </LinkContainer>
      </Footer>
    </Wrapper>

  )
}

export default reduxForm({ form: 'recover', destroyOnUnmount: false })(FirstStep)
