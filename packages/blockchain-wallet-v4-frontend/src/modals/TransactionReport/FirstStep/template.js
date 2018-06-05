import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { DateBoxDebounced, SelectBoxBitcoinAddresses, Form } from 'components/Form'
import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${props => props.margin || '10px'};
`
const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  & > :first-child { margin-right: 10px; }
`

const FirstStep = (props) => {
  const { coin, close, submitting, invalid, onSubmit } = props

  return (
    <Form onSubmit={onSubmit}>
      <Container>
        <Row>
          <Text size='13px' weight={400} capitalize>
            <FormattedMessage id='modals.transactionreport.firststep.selectwallet' defaultMessage='Select wallet' />
          </Text>
        </Row>
        <Row margin='30px'>
          <Field name='from' component={SelectBoxBitcoinAddresses} props={{ coin }} />
        </Row>
        <Row>
          <Text size='13px' weight={400} capitalize>
            <FormattedMessage id='modals.transactionreport.firststep.selectwallet' defaultMessage='Select time range' />
          </Text>
        </Row>
        <Row margin='30px'>
          <TimeContainer>
            <Field name='start' validate={[required]} component={DateBoxDebounced} />
            <Icon name='right-arrow' size='30px' />
            <Field name='end' validate={[required]} component={DateBoxDebounced} />
          </TimeContainer>
        </Row>
      </Container>
      <Footer>
        <Link size='13px' weight={300} fullwidth onClick={close}>
          <FormattedMessage id='modals.firststep.transactionreport.firststep.close' defaultMessage='Close' />
        </Link>
        <Button type='submit' nature='primary' disabled={submitting || invalid}>
          <FormattedMessage id='modals.firststep.transactionreport.firststep.generate' defaultMessage='Export CSV' />
        </Button>
      </Footer>
    </Form>
  )
}

FirstStep.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(FirstStep)
