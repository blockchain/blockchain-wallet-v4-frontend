import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, HeartbeatLoader, Link, Separator, Text } from 'blockchain-info-components'
import { CaptchaBox, Form, TextArea } from 'components/Form'

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

const ThirdStep = (props) => {
  const { busy, previousStep, onSubmit, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.thirdstep.step3' defaultMessage='Step 3 of 3' />
        </Text>
      </Header>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.reset2fa.thirdstep.explain' defaultMessage='The process will be quicker with more precise details provided to us.' />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.message' defaultMessage='Message' />
        </Text>
        <Field name='message' component={TextArea} />
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.message_explain' defaultMessage='Enter a message for Blockchain.info admins to review.' />
        </Text>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.captcha' defaultMessage='Captcha' />
        </Text>
        <Field name='code' validate={[required]} component={CaptchaBox} />
        <Button type='submit' nature='primary' fullwidth uppercase disabled={busy || invalid} >
          {
            busy
              ? <HeartbeatLoader height='20px' width='20px' color='white' />
              : <FormattedMessage id='scenes.reset2fa.thirdstep.reset' defaultMessage='Reset' />
          }
        </Button>
      </Form>
      <Footer>
        <Link onClick={previousStep} size='13px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.back' defaultMessage='Go Back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(ThirdStep)
