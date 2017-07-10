import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextArea, CaptchaBox, HelpBlock } from 'components/generic/Form'
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

const ThirdStep = (props) => {
  const { handleClickStep3, submitting, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text id='scenes.reset2fa.thirdstep.reset' text='Reset 2FA' biggest light capitalize />
        <Text id='scenes.reset2fa.thirdstep.step3' text='Step 3 of 3' smallest />
      </Header>
      <Text id='scenes.reset2fa.thirdstep.explain' text='The process will be quicker with more precise details provided to us.' small light altFont />
      <Separator />
      <Form>
        <Text id='scenes.reset2fa.thirdstep.message' text='Message' small medium capitalize />
        <Field name='message' component={TextArea} />
        <HelpBlock>
          <Text id='scenes.reset2fa.thirdstep.message_explain' text='Enter a message for Blockchain.info admins to review.' small light altFont />
        </HelpBlock>
        <Text id='scenes.reset2fa.thirdstep.captcha' text='Captcha' small medium capitalize />
        <Field name='captcha' validate={[required]} component={CaptchaBox} />
        <SecondaryButton id='scenes.reset2fa.thirdstep.reset' text='Reset' disabled={submitting || invalid} onClick={handleClickStep3} fullwidth uppercase />
      </Form>
      <Footer>
        <Link onClick={props.handleGoBackStep3}><Text id='scenes.reset2fa.thirdstep.back' text='Go back' small light cyan /></Link>
      </Footer>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FAForm3' })(ThirdStep)
