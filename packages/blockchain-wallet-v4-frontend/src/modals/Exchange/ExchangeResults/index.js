import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { always, contains, identity, ifElse, equals } from 'ramda'

import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'

import {
  ExchangeText,
  ExchangeAmount,
  AmountHeader,
  Delimiter,
  TableRow,
  Note
} from 'components/Exchange'
import { OrderStatus, selectColor, OrderNote } from 'components/OrderStatus'
import {
  Button,
  Link,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'blockchain-info-components'

const ExchangeResultsFooter = styled(ModalFooter)`
  > div {
    justify-content: center;
  }
`
const StatusCircle = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: ${props => props.theme[props.color]};
`

const ResultsHeader = styled(ModalHeader)`
  .headerText {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${props => props.theme[props.color]};
  }
`

const ResultAmountHeader = styled(AmountHeader)`
  margin-bottom: 0;
  margin-top: 8px;
`

const OrderRow = styled(AmountHeader)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 600;
  margin-bottom: 24px;
`

const StrikeThrough = styled.s`
  color: ${props => props.theme['brand-tertiary']};
`

const { RESULTS_MODAL, STATES } = model.components.exchangeHistory
const {
  REFUNDED,
  PENDING_REFUND,
  PENDING_DEPOSIT,
  PENDING_EXECUTION,
  PENDING_WITHDRAWAL,
  FINISHED_DEPOSIT,
  FAILED,
  EXPIRED,
  FINISHED
} = STATES

const getSourceMessage = (status, coin) => {
  switch (status) {
    case EXPIRED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.exchange'
          defaultMessage='Exchange {coin}'
          values={{ coin }}
        />
      )
    case FINISHED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.deposited'
          defaultMessage='{coin} Deposited'
          values={{ coin }}
        />
      )
    case REFUNDED:
    case PENDING_REFUND:
      return (
        <FormattedMessage
          id='modals.exchangeresults.broadcast'
          defaultMessage='{coin} Broadcast'
          values={{ coin }}
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangeresults.exchange'
          defaultMessage='Exchange {coin}'
          values={{ coin }}
        />
      )
  }
}

const getTargetMessage = (status, coin) => {
  switch (status) {
    case FINISHED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.received'
          defaultMessage='{coin} Received'
          values={{ coin }}
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangeresults.receive'
          defaultMessage='Receive {coin}'
          values={{ coin }}
        />
      )
  }
}

const getRefundMessage = status => {
  switch (status) {
    case REFUNDED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.totalrefunded'
          defaultMessage='Total refunded'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangeresults.totaltoberefunded'
          defaultMessage='Total to be refunded'
        />
      )
  }
}

const getButton = (status, close) => {
  switch (status) {
    case EXPIRED:
      return (
        <Link
          target='_blank'
          href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000180551'
        >
          <Button nature='primary' size='13px' weight={300}>
            <FormattedMessage
              id='modals.exchangedetails.support'
              defaultMessage='Contact Support'
            />
          </Button>
        </Link>
      )
    default:
      return (
        <Button nature='primary' size='13px' weight={300} onClick={close}>
          <FormattedMessage
            id='modals.exchange.exchangeresults.close'
            defaultMessage='Close'
          />
        </Button>
      )
  }
}

const getTargetAmount = (withdrawalAmount, targetCoin, status) =>
  contains(status, [FAILED, EXPIRED]) ? (
    <StrikeThrough>{`${withdrawalAmount} ${targetCoin}`}</StrikeThrough>
  ) : (
    `${withdrawalAmount} ${targetCoin}`
  )

export const ExchangeResults = ({
  position,
  total,
  close,
  status,
  id,
  sourceCoin,
  targetCoin,
  depositAmount,
  withdrawalAmount,
  targetFiat,
  currency,
  fee,
  rate,
  refundAmount
}) => {
  const color = ifElse(equals('transferred'), always('brand-yellow'), identity)(
    selectColor(status)
  )
  const headerColor = color === 'error' ? color : 'gray-5'
  return (
    <Modal size='small' position={position} total={total}>
      <ResultsHeader onClose={close} color={headerColor}>
        <StatusCircle color={color} />
        <OrderStatus status={status} />
      </ResultsHeader>
      <ModalBody>
        {status !== FINISHED && (
          <Note>
            <OrderNote status={status} />
          </Note>
        )}
        <OrderRow>
          <FormattedMessage
            id='modals.exchangeresults.order'
            defaultMessage='Order'
          />
          {id}
        </OrderRow>
        <ResultAmountHeader>
          {getSourceMessage(status, sourceCoin)}
        </ResultAmountHeader>
        <ExchangeAmount>{`${depositAmount} ${sourceCoin}`}</ExchangeAmount>
        {!contains(status, [REFUNDED, PENDING_REFUND]) && (
          <React.Fragment>
            <ResultAmountHeader>
              {getTargetMessage(status, targetCoin)}
            </ResultAmountHeader>
            <ExchangeAmount>
              {getTargetAmount(withdrawalAmount, targetCoin, status)}
            </ExchangeAmount>
          </React.Fragment>
        )}
        <Delimiter />
        {contains(status, [
          FINISHED,
          PENDING_DEPOSIT,
          PENDING_EXECUTION,
          PENDING_WITHDRAWAL,
          FINISHED_DEPOSIT
        ]) && (
          <TableRow>
            <ExchangeText>
              <FormattedMessage
                id='modals.exchangeresults.value'
                defaultMessage='Total Value'
              />
              {status === FINISHED && (
                <React.Fragment>
                  &nbsp;
                  <FormattedMessage
                    id='modals.exchangeresults.valuenotcie'
                    defaultMessage='(when exchanged)'
                  />
                </React.Fragment>
              )}
            </ExchangeText>
            <ExchangeText weight={300}>{`${
              status === FINISHED ? '' : '~'
            } ${targetFiat} ${currency}`}</ExchangeText>
          </TableRow>
        )}
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='modals.exchangeresults.fee'
              defaultMessage='Network Fee'
            />
          </ExchangeText>
          <ExchangeText weight={300}>{`${fee} ${targetCoin}`}</ExchangeText>
        </TableRow>
        {rate &&
          contains(status, [
            FINISHED,
            PENDING_DEPOSIT,
            PENDING_EXECUTION,
            PENDING_WITHDRAWAL,
            FINISHED_DEPOSIT
          ]) && (
            <TableRow>
              <ExchangeText>
                <FormattedMessage
                  id='modals.exchangeresults.rate'
                  defaultMessage='Exchange rate'
                />
              </ExchangeText>
              <ExchangeText
                weight={300}
              >{`1 ${sourceCoin} = ${rate} ${targetCoin}`}</ExchangeText>
            </TableRow>
          )}
        {contains(status, [REFUNDED, PENDING_REFUND]) && (
          <TableRow>
            <ExchangeText>{getRefundMessage(status)}</ExchangeText>
            <ExchangeText weight={300}>{`${
              status === REFUNDED ? '' : '~'
            } ${refundAmount}`}</ExchangeText>
          </TableRow>
        )}
      </ModalBody>
      <ExchangeResultsFooter>{getButton(status, close)}</ExchangeResultsFooter>
    </Modal>
  )
}

export default modalEnhancer(RESULTS_MODAL)(ExchangeResults)
