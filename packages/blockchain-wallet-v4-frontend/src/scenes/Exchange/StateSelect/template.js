import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { validEmail } from 'services/FormHelper'
import { FormattedMessage } from 'react-intl'
import { Text, Image, Button } from 'blockchain-info-components'
import { Form, SelectBoxUSState, TextBox } from 'components/Form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #DDD;
  margin-top: 30px;
  margin-left: 30px;
  width: 60%;
  padding: 30px;
`
const Header = styled.div`
  margin-bottom: 20px;
`
const FormContainer = styled.div`
  margin-top: 20px;
`
const ResponseContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`

const StateSelect = (props) => {
  const { handleSubmit, allowState, handleGoToStep, pristine, handleNotify } = props

  let response = null

  if (allowState) {
    response = <ResponseContainer>
      <Image name='shapeshiftLogo' height='45px' width='105px' />
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.exchange.will-process' defaultMessage='Our partner ShapeShift will process your exchange.' />
      </Text>
      <Button style={{marginTop: '20px'}} nature='primary' onClick={handleGoToStep}>
        Continue
      </Button>
    </ResponseContainer>
  }
  if (!allowState) {
    response = <ResponseContainer>
      <Text size='13px' weight={300} color='error' style={{marginBottom: '15px'}}>
        <FormattedMessage id='scenes.exchange.not-available' defaultMessage='This service is not yet available in your state. If you would like to be notified when it is available, sign up below.' />
      </Text>
      <Field name='userEmail' component={TextBox} placeholder='Email address' validate={[validEmail]} required />
      <Button style={{marginTop: '20px'}} nature='primary' onClick={handleNotify}>Notify Me</Button>
    </ResponseContainer>
  }
  if (pristine) response = ''

  return (
    <Container>
      <Header>
        <Text weight={300} size='20px' color='brand-primary'>
          <FormattedMessage id='scenes.exchange.simple' defaultMessage='Simple. Seamless. Secure.' />
        </Text>
      </Header>
      <Text weight={300} size='14px'>
        <FormattedMessage id='scenes.exchange.exchanging' defaultMessage='Blockchain works with exchange partners to make exchanging coins in your wallet secure and seamless.' />
      </Text>
      <Form onSubmit={handleSubmit}>
        <FormContainer>
          <Text size='14px' weight={500} style={{marginBottom: '10px'}}>
            <FormattedMessage id='scene.exchange.select-state' defaultMessage='Select your state of residency:' />
          </Text>
          <Field name='userState' component={SelectBoxUSState} />
          {response}
        </FormContainer>
      </Form>
    </Container>
  )
}

export default reduxForm({ form: 'stateSelect' })(StateSelect)
