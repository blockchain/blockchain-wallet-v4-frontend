import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { CSVDownload } from 'react-csv'

import { Button, Icon, Link, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'
import { DateBoxDebounced, SelectBoxBitcoinAddresses, Form } from 'components/Form'
import { required } from 'services/FormHelper'
import { validStartDate, validEndDate } from './validation'

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
  const { coin, csvData, position, total, closeAll, submitting, invalid, handleSubmit, isValidStartDate, isValidEndDate } = props

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage id='modals.transactionreport.export' defaultMessage='Export {coin} transactions history' values={{ coin }} />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage id='modals.transactionreport.selectwallet' defaultMessage='Select wallet' />
              </Text>
            </Row>
            <Row margin='30px'>
              <Field name='from' component={SelectBoxBitcoinAddresses} coin={coin} />
            </Row>
            <Row>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage id='modals.transactionreport.selecttimerange' defaultMessage='Select time range' />
              </Text>
            </Row>
            <Row margin='30px'>
              <TimeContainer>
                <Field name='start' validate={[required, validStartDate]} component={DateBoxDebounced} isValidDate={isValidStartDate} />
                <Icon name='right-arrow' size='30px' />
                <Field name='end' validate={[required, validEndDate]} component={DateBoxDebounced} isValidDate={isValidEndDate} />
              </TimeContainer>
            </Row>
          </Container>
          <Footer>
            <Link size='13px' weight={300} fullwidth onClick={closeAll}>
              <FormattedMessage id='modals.transactionreport.firststep.close' defaultMessage='Close' />
            </Link>
            <Button type='submit' nature='primary' disabled={submitting || invalid}>
              <FormattedMessage id='modals.transactionreport.firststep.generate' defaultMessage='Export CSV' />
            </Button>
            {csvData && <CSVDownload data={csvData} />}
          </Footer>
        </Form>
      </ModalBody>
    </Modal>
  )
}

FirstStep.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(FirstStep)
