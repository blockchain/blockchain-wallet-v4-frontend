import { CSVLink } from 'react-csv'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import {
  DateBoxDebounced,
  Form,
  SelectBoxBchAddresses,
  SelectBoxBtcAddresses,
  SelectBoxEthAddresses
} from 'components/Form'
import { required } from 'services/FormHelper'
import { validEndDate, validStartDate } from './validation'

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
const DateSelectRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const DateLabel = styled(Text)`
  margin-bottom: 6px;
`
const EndDateLabel = styled(DateLabel)`
  margin-right: 50px;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  & > :first-child {
    margin-right: 10px;
  }
`
const DownloadBtn = styled(CSVLink)`
  text-decoration: none;
`

const TransactionHistory = props => {
  const {
    closeAll,
    coin,
    csvData,
    filename,
    generating,
    handleSubmit,
    isValidEndDate,
    isValidStartDate,
    onDownload,
    position,
    total
  } = props

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage
          id='modals.transactionreport.title'
          defaultMessage='Export {coin} transactions history'
          values={{ coin }}
        />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.transactionreport.wallet'
                  defaultMessage='Select wallet'
                />
              </Text>
            </Row>
            <Row margin='30px'>
              {coin === 'BCH' && (
                <Field
                  coin={coin}
                  component={SelectBoxBchAddresses}
                  includeAll={false}
                  name='from'
                />
              )}
              {coin === 'BTC' && (
                <Field
                  coin={coin}
                  component={SelectBoxBtcAddresses}
                  includeAll={false}
                  name='from'
                />
              )}
              {coin === 'ETH' && (
                <Field
                  coin={coin}
                  component={SelectBoxEthAddresses}
                  name='from'
                />
              )}
            </Row>
            <Row>
              <DateSelectRow>
                <DateLabel size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='modals.transactionreport.startdate'
                    defaultMessage='Select start date'
                  />
                </DateLabel>
                <EndDateLabel size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='modals.transactionreport.enddate'
                    defaultMessage='Select end date'
                  />
                </EndDateLabel>
              </DateSelectRow>
            </Row>
            <Row margin='34px'>
              <DateSelectRow>
                <Field
                  name='start'
                  validate={[required, validStartDate]}
                  component={DateBoxDebounced}
                  isValidDate={isValidStartDate}
                />
                <Icon
                  name='arrow-right'
                  size='26px'
                  style={{ marginTop: '-6px' }}
                />
                <Field
                  name='end'
                  validate={[required, validEndDate]}
                  component={DateBoxDebounced}
                  isValidDate={isValidEndDate}
                />
              </DateSelectRow>
            </Row>
          </Container>
          <Footer>
            {generating ? (
              csvData ? (
                <DownloadBtn
                  data={csvData}
                  filename={filename}
                  target='_blank'
                  onClick={onDownload}
                >
                  <Button nature='success' data-e2e='downloadReport'>
                    <FormattedMessage
                      id='modals.transactionreport.download'
                      defaultMessage='Download Report'
                    />
                  </Button>
                </DownloadBtn>
              ) : (
                <HeartbeatLoader />
              )
            ) : (
              <Button
                type='submit'
                nature='primary'
                disabled={generating}
                data-e2e='generateReport'
              >
                <FormattedMessage
                  id='modals.transactionreport.generatecsv'
                  defaultMessage='Generate Report'
                />
              </Button>
            )}
          </Footer>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default reduxForm({ form: 'transactionReport' })(TransactionHistory)
