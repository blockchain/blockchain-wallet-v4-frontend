import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { CSVDownload } from 'react-csv'
import { map, isEmpty } from 'ramda'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'blockchain-info-components'
import { DateBox, SelectBoxAddresses, Form } from 'components/Form'

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

const TransactionReport = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { onSubmit, data, filename } = rest
  console.log(data, filename)
  const headers = [['date', 'time', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']]
  const records = map((record) => [record.date, record.time, record.type, record.amount_btc, record.value_then, record.value_now, record.exchange_rate_then, record.tx], data)

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={onSubmit}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage id='modals.transactionreport.title' defaultMessage='Export history' />
          <Tooltip>
            <FormattedMessage id='modals.transactionreport.help' defaultMessage='Export the transaction history of your addresses in CSV format' />
          </Tooltip>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Addresses>
              <Field name='from' component={SelectBoxAddresses} />
            </Addresses>
            <Dates>
              <Field name='start' component={DateBox} />
              <Field name='end' component={DateBox} />
            </Dates>
          </Container>
          {filename && <CSVDownload data={records} headers={headers} filename={filename} target='_blank' />}
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} fullwidth onClick={close}>
            <FormattedMessage id='modals.transactionreport.close' defaultMessage='Close' />
          </Link>
          <Button type='submit' nature='primary'>
            <FormattedMessage id='modals.transactionreport.export' defaultMessage='Export' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

TransactionReport.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(TransactionReport)
