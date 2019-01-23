import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { CSVLink } from 'react-csv'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'
import {
  DateBoxDebounced,
  SelectBoxBtcAddresses,
  SelectBoxBchAddresses,
  Form
} from 'components/Form'
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

  & > :first-child {
    margin-right: 10px;
  }
`

const DownloadBtn = styled(CSVLink)`
  text-decoration: none;
`

const FirstStep = props => {
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
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.transactionreport.wallet'
                  defaultMessage='Select wallet'
                />
              </Text>
            </Row>
            <Row margin='30px'>
              <Field
                name='from'
                coin={coin}
                component={
                  coin === 'BTC' ? SelectBoxBtcAddresses : SelectBoxBchAddresses
                }
              />
            </Row>
            <Row>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.transactionreport.timerange'
                  defaultMessage='Select time range'
                />
              </Text>
            </Row>
            <Row margin='30px'>
              <TimeContainer>
                <Field
                  name='start'
                  validate={[required, validStartDate]}
                  component={DateBoxDebounced}
                  isValidDate={isValidStartDate}
                />
                <Icon name='right-arrow' size='30px' />
                <Field
                  name='end'
                  validate={[required, validEndDate]}
                  component={DateBoxDebounced}
                  isValidDate={isValidEndDate}
                />
              </TimeContainer>
            </Row>
          </Container>
          <Footer>
            <Link size='13px' weight={300} fullwidth onClick={closeAll}>
              <FormattedMessage
                id='modals.transactionreport.close'
                defaultMessage='Close'
              />
            </Link>
            {generating ? (
              csvData ? (
                <DownloadBtn
                  data={csvData}
                  filename={filename}
                  target='_blank'
                  onClick={onDownload}
                >
                  <Button nature='success'>
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
              <Button type='submit' nature='primary' disabled={generating}>
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

FirstStep.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'transactionReport' })(FirstStep)
