import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required } from 'services/FormHelper'
import { CaptchaBox } from 'components/shared/Form'
import { Button, Form, HelpBlock, Link, Separator, Text, TextArea } from 'blockchain-info-components'

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

const ThirdStep = (props) => {
  const { handleSubmit, timestamp, previous, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.reset2fa.thirdstep.reset' defaultMessage='Reset 2FA' />
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.thirdstep.step3' defaultMessage='Step 3 of 3' />
        </Text>
      </Header>
      <FormattedMessage id='scenes.reset2fa.thirdstep.explain' defaultMessage='The process will be quicker with more precise details provided to us.' />
      <Separator />
      <Form>
        <FormattedMessage id='scenes.reset2fa.thirdstep.message' defaultMessage='Message' />
        <Field name='message' component={TextArea} />
        <HelpBlock>
          <FormattedMessage id='scenes.reset2fa.thirdstep.message_explain' defaultMessage='Enter a message for Blockchain.info admins to review.' />
        </HelpBlock>
        <FormattedMessage id='scenes.reset2fa.thirdstep.captcha' defaultMessage='Captcha' />
        <Field name='captcha' validate={[required]} component={CaptchaBox} props={{ timestamp: timestamp }} />
        <Button type='secondary' fullwidth uppercase disabled={submitting || invalid} onClick={handleSubmit}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.reset' defaultMessage='Reset' />
        </Button>
      </Form>
      <Footer>
        <Link onClick={previous}>
          <FormattedMessage id='scenes.reset2fa.thirdstep.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default ThirdStep
