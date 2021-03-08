import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { required, validMnemonic } from 'services/forms'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const MnemonicLabel = styled(FormLabel)`
  > div {
    margin-bottom: 0px;
  }
  + div {
    margin-bottom: 10px;
  }
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const GoBackLink = styled(LinkContainer)`
  margin-right: 15px;
`

const FirstStep = props => {
  const { handleSubmit, invalid, submitting } = props

  return (
    <Wrapper>
      <Header>
        <Text size='20px' color='blue900' weight={600} capitalize>
          <FormattedMessage
            id='scenes.recover.firststep.funds'
            defaultMessage='Recover Funds'
          />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <TextGroup>
          <Text size='13px' weight={400} color='error'>
            <FormattedMessage
              id='scenes.recover.firststep.warning'
              defaultMessage='You should always pair or login if you have access to your wallet ID and password. Recovering your funds will create a new wallet ID.'
            />
          </Text>
        </TextGroup>
        <FormGroup>
          <FormItem>
            <MnemonicLabel htmlFor='mnemonic'>
              <FormattedMessage
                id='scenes.recover.firststep.mnemonic1'
                defaultMessage='Your Secret Private Key Recovery Phrase'
              />
            </MnemonicLabel>
            <Text size='12px' weight={400}>
              <FormattedMessage
                id='scenes.recover.firststep.mnemonic_explain'
                defaultMessage='Enter your 12 word phrase, lowercase, with spaces between each word, to recover your funds & transactions.'
              />
            </Text>
            <Field
              bgColor='grey000'
              autoComplete='off'
              autoFocus
              component={TextBox}
              disableSpellcheck
              name='mnemonic'
              validate={[required, validMnemonic]}
            />
          </FormItem>
        </FormGroup>
        <Footer>
          <GoBackLink to='/help'>
            <Link size='13px' weight={400}>
              <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
            </Link>
          </GoBackLink>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'recover', destroyOnUnmount: false })(
  FirstStep
)
