import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { Button, Link, ModalBody, ModalFooter } from 'blockchain-info-components'
import { DateBox, SelectBoxBitcoinAddresses, Form } from 'components/Form'
import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Addresses = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  width: 70%;
`
const Dates = styled(Addresses)`
  & > * { width: 45%; }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > :last-child { margin-left: 10px; }
`

const FirstStep = (props) => {
  const { coin, close, submitting, invalid, onSubmit } = props

  return (
    <Form onSubmit={onSubmit}>
      <ModalBody>
        <Container>
          <Addresses>
            <Field name='from' placeholder="TEST" validate={[required]} component={SelectBoxBitcoinAddresses} props={{coin}} />
          </Addresses>
          <Dates>
            <Field name='start' validate={[required]} component={DateBox} />
            <Field name='end' validate={[required]} component={DateBox} />
          </Dates>
        </Container>
      </ModalBody>
      <ModalFooter align='right'>
        <Link size='13px' weight={300} fullwidth onClick={close}>
          <FormattedMessage id='modals.firststep.transactionreport.firststep.close' defaultMessage='Close' />
        </Link>
        <ButtonContainer>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='modals.firststep.transactionreport.firststep.generate' defaultMessage='Export' />
          </Button>
        </ButtonContainer>
      </ModalFooter>
    </Form>
  )
}

FirstStep.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(FirstStep)
