import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, HeartbeatLoader, Link, Separator, Text } from 'blockchain-info-components'
import { CaptchaBox, Form } from 'components/Form'
import { FormGroup } from '../../../components/Form'

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
const SecondStepForm = styled(Form)`
  margin-top: 10px;
`
const CaptchaText = styled(Text)`
  margin-top: 6px;
`
const BackLink = styled(Link)`
  margin-right: 15px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 6px;
`

const SecondStep = (props) => {
  const { busy, previousStep, handleSubmit, invalid } = props

  return (
    <Wrapper>
      <Header>
        <Text size='30px' weight={300}>
          <FormattedMessage id='scenes.reset2fa.secondstep.reset' defaultMessage='Reset 2FA' />
        </Text>
        <Text size='10px'>
          <FormattedMessage id='scenes.reset2fa.secondstep.step3' defaultMessage='Step 2 of 2' />
        </Text>
      </Header>
      <Separator />
      <SecondStepForm onSubmit={handleSubmit}>
        <CaptchaText size='14px' weight={500}>
          <FormattedMessage id='scenes.reset2fa.secondstep.captcha' defaultMessage='Captcha' />
        </CaptchaText>
        <Field name='code' autoFocus validate={[required]} component={CaptchaBox} />
        <Footer>
          <BackLink onClick={previousStep} size='13px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.secondstep.back' defaultMessage='Go Back' />
          </BackLink>
          <Button type='submit' nature='primary' uppercase disabled={busy || invalid} >
            {
              busy
                ? <HeartbeatLoader height='20px' width='20px' color='white' />
                : <FormattedMessage id='scenes.reset2fa.secondstep.reset' defaultMessage='Reset' />
            }
          </Button>
        </Footer>
      </SecondStepForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'reset2FA', destroyOnUnmount: false })(SecondStep)
