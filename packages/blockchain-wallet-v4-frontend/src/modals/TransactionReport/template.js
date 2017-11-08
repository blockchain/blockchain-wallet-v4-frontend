import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { CSVLink } from 'react-csv-2'
import { map } from 'ramda'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'blockchain-info-components'
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
const DownloadContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > :last-child { margin-left: 10px; }
`
const DownloadLink = styled(CSVLink)`
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme['brand-secondary']};
`

const TransactionReport = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { onSubmit, data, filename } = rest

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
              <Field name='from' component={SelectBoxBitcoinAddresses} />
            </Addresses>
            <Dates>
              <Field name='start' component={DateBox} />
              <Field name='end' component={DateBox} />
            </Dates>
          </Container>

        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} fullwidth onClick={close}>
            <FormattedMessage id='modals.transactionreport.close' defaultMessage='Close' />
          </Link>
          <DownloadContainer>
            { filename &&
              <DownloadLink data={data} filename={filename} target='_blank'>
                <FormattedMessage id='modals.transactionreport.download' defaultMessage='Download' />
              </DownloadLink>
            }
            <Button type='submit' nature='primary'>
              <FormattedMessage id='modals.transactionreport.generate' defaultMessage='Generate' />
            </Button>
          </DownloadContainer>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

TransactionReport.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(TransactionReport)
