import React from 'react'
import { CSVLink } from 'react-csv'
import { FormattedMessage } from 'react-intl'
import { format, isBefore } from 'date-fns'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  DateInput,
  HeartbeatLoader,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import Form from 'components/Form/Form'
import SelectBoxBchAddresses from 'components/Form/SelectBoxBchAddresses'
import SelectBoxBtcAddresses from 'components/Form/SelectBoxBtcAddresses'
import SelectBoxEthAddresses from 'components/Form/SelectBoxEthAddresses'
import SelectBoxXlmAddresses from 'components/Form/SelectBoxXlmAddresses'
import { required } from 'services/forms'

import { OwnProps, StateProps } from '.'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const DateSelectRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const DateDivider = styled.div`
  min-width: 18px;
`
const DateLabel = styled(Text)`
  margin-bottom: 6px;
`
const EndDateLabel = styled(DateLabel)`
  margin-right: 140px;
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45px;
`
const DownloadButton = styled(CSVLink)`
  text-decoration: none;
  width: 100%;
`

const isValidDateRange = (val, { end, start }) => {
  if (isBefore(new Date(end), new Date(start))) {
    return 'Invalid date range'
  }
}

export const validAddressOrWallet = (value) => {
  return value !== 'all' ? undefined : (
    <FormattedMessage
      id='modals.transactions.report.required'
      defaultMessage='Wallet selection required'
    />
  )
}

type Props = OwnProps & StateProps

const DownloadTransactions: React.FunctionComponent<InjectedFormProps<{}, Props> & Props> = (
  props
) => {
  const { closeAll, coin, csvData, filename, generating, handleSubmit, invalid, position, total } =
    props
  const minDate = '2009-01-03' // bitcoin start date
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage
          id='modals.transactions.report.title'
          defaultMessage='Download Transactions'
        />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Text size='14px' weight={500} capitalize style={{ marginBottom: '6px' }}>
                <FormattedMessage id='modals.transactions.report.wallet' defaultMessage='Wallet' />
              </Text>
            </Row>
            <Row>
              {coin === 'BCH' && (
                <Field
                  coin={coin}
                  component={SelectBoxBchAddresses}
                  includeAll={false}
                  name='from'
                  validate={[required, validAddressOrWallet]}
                />
              )}
              {coin === 'BTC' && (
                <Field
                  coin={coin}
                  component={SelectBoxBtcAddresses}
                  includeAll={false}
                  name='from'
                  validate={[required, validAddressOrWallet]}
                />
              )}
              {coin === 'ETH' && (
                <Field
                  coin={coin}
                  component={SelectBoxEthAddresses}
                  name='from'
                  validate={[required, validAddressOrWallet]}
                />
              )}
              {coin === 'XLM' && (
                <Field
                  coin={coin}
                  component={SelectBoxXlmAddresses}
                  name='from'
                  validate={[required, validAddressOrWallet]}
                />
              )}
              {window.coins[coin].coinfig.type.erc20Address && (
                <Field
                  coin={coin}
                  component={SelectBoxEthAddresses}
                  name='from'
                  validate={[required, validAddressOrWallet]}
                />
              )}
            </Row>
            <Row style={{ marginTop: '16px' }}>
              <DateSelectRow>
                <DateLabel size='14px' weight={500} capitalize>
                  <FormattedMessage
                    id='modals.transactions.report.startdate'
                    defaultMessage='start date'
                  />
                </DateLabel>
                <EndDateLabel size='14px' weight={500} capitalize>
                  <FormattedMessage
                    id='modals.transactions.report.enddate'
                    defaultMessage='end date'
                  />
                </EndDateLabel>
              </DateSelectRow>
            </Row>
            <Row style={{ marginBottom: '16px' }}>
              <DateSelectRow>
                <Field
                  name='start'
                  validate={[required, isValidDateRange]}
                  min={minDate}
                  max={today}
                  component={DateInput}
                  fullwidth
                />
                <DateDivider />
                <Field
                  name='end'
                  validate={[required, isValidDateRange]}
                  min={minDate}
                  max={today}
                  component={DateInput}
                  fullwidth
                />
              </DateSelectRow>
            </Row>
          </Container>
          <Footer>
            {generating ? (
              csvData.length > 0 ? (
                <DownloadButton
                  data={csvData}
                  filename={filename}
                  target='_blank'
                  onClick={closeAll}
                  width='100%'
                >
                  <Button data-e2e='downloadReport' height='45px' nature='success' width='100%'>
                    <FormattedMessage
                      id='modals.transactions.report.download'
                      defaultMessage='Download Report'
                    />
                  </Button>
                </DownloadButton>
              ) : (
                <Button
                  data-e2e='loadingTransactionButton'
                  disabled
                  fullwidth
                  height='48px'
                  nature='primary'
                >
                  <HeartbeatLoader height='20px' width='20px' color='white' />
                </Button>
              )
            ) : (
              <Button
                data-e2e='generateReport'
                disabled={generating || invalid}
                height='45px'
                nature='primary'
                type='submit'
                width='100%'
              >
                <FormattedMessage
                  id='modals.transactions.report.generate'
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

export default reduxForm<{}, Props>({ form: 'transactionReport' })(DownloadTransactions)
