import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { Button, Link, ModalBody, ModalFooter } from 'blockchain-info-components'
import { DateBox, SelectBoxBitcoinAddresses, Form } from 'components/Form'

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
  const { coin, position, total, close, closeAll, ...rest } = props
  const { onSubmit } = rest

  return (
    <Form onSubmit={onSubmit}>
      <ModalBody>
        <Container>
          <Addresses>
            <Field name='from' component={SelectBoxBitcoinAddresses} props={{coin}} />
          </Addresses>
          <Dates>
            <Field name='start' component={DateBox} />
            <Field name='end' component={DateBox} />
          </Dates>
        </Container>

      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} fullwidth onClick={close}>
          <FormattedMessage id='modals.firststep.transactionreport.close' defaultMessage='Close' />
        </Link>
        <ButtonContainer>
          <Button type='submit' nature='primary'>
            <FormattedMessage id='modals.firststep.transactionreport.generate' defaultMessage='Generate' />
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
