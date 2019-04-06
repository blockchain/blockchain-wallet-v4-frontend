import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { always, includes, identity, ifElse, equals } from 'ramda'

import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'

import {
  AmountHeader,
  ExchangeText,
  ExchangeAmount,
  ExchangeAmounts,
  LargeTableRow,
  Note,
  Title,
  Wrapper as BorderWrapper
} from 'components/Exchange'
import { OrderStatus, selectColor, OrderNote } from 'components/OrderStatus'
import {
  Button,
  Link,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const SummaryWrapper = styled(BorderWrapper)`
  padding: 0;
  width: 100%;
  margin-bottom: 16px;
`
const SummaryNote = styled(Note)`
  font-size: 13px;
  line-height: auto;
  margin-bottom: 24px;
`
const Header = styled(ModalHeader)`
  padding: 20px 20px 0 0;
  border-bottom: 0px;
`
const CoinIconTitle = styled(Title)`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: initial;
  span:nth-child(2) {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: ${props => props.theme['white']};
    justify-content: center;
    align-items: center;
    margin: 0px -6px;
    z-index: 1;
  }
`
const StatusCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  &:after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${props => props.theme[props.color]};
  }
`
const MidTableRow = styled(LargeTableRow)`
  min-height: auto;
`
const OrderRow = styled(AmountHeader)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 600;
  margin-bottom: 24px;
  white-space: nowrap;
`
const SummaryExchangeAmount = styled(ExchangeAmount)`
  justify-content: flex-end;
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

const getSourceMessage = status => {
  switch (status) {
    case EXPIRED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.exchangecoin'
          defaultMessage='Exchange'
        />
      )
    case FINISHED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.depositedcoin'
          defaultMessage='Deposited'
        />
      )
    case REFUNDED:
    case PENDING_REFUND:
      return (
        <FormattedMessage
          id='modals.exchangeresults.broadcastcoin'
          defaultMessage='Broadcast'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangeresults.exchangecoin'
          defaultMessage='Exchange'
        />
      )
  }
}

const getTargetMessage = status => {
  switch (status) {
    case FINISHED:
      return (
        <FormattedMessage
          id='modals.exchangeresults.coinreceived'
          defaultMessage='Received'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangeresults.receivecoin'
          defaultMessage='Receive'
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

const getButton = status => {
  switch (status) {
    case EXPIRED:
    case FAILED:
      return (
        <Link
          target='_blank'
          href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000180551'
        >
          <Button fullwidth height='56px' nature='primary' weight={300}>
            <FormattedMessage
              id='modals.exchangedetails.support'
              defaultMessage='Contact Support'
            />
          </Button>
        </Link>
      )
    default:
      return null
  }
}

const getTargetAmount = (withdrawalAmount, targetCoin, status) =>
  includes(status, [FAILED, EXPIRED]) ? (
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
  rate,
  refundAmount
}) => {
  const color = ifElse(equals('transferred'), always('brand-yellow'), identity)(
    selectColor(status)
  )
  return (
    <Modal size='small' position={position} total={total}>
      <Header onClose={close} />
      <ModalBody>
        <CoinIconTitle>
          <Icon
            size='42px'
            color={sourceCoin.toLowerCase()}
            name={sourceCoin.toLowerCase() + '-circle-filled'}
          />
          <Icon size='12px' name='thick-arrow-right' />
          <Icon
            size='42px'
            color={targetCoin.toLowerCase()}
            name={targetCoin.toLowerCase() + '-circle-filled'}
          />
        </CoinIconTitle>
        {status !== FINISHED && (
          <SummaryNote>
            <OrderNote status={status} />
          </SummaryNote>
        )}
        <OrderRow>
          <Text weight={600}>
            <FormattedMessage
              id='modals.exchangeresults.orderid'
              defaultMessage='Order ID'
            />
          </Text>
          {id}
        </OrderRow>
        <SummaryWrapper>
          <LargeTableRow>
            <ExchangeText>
              <FormattedMessage
                id='modals.exchangeresults.status'
                defaultMessage='Status'
              />
            </ExchangeText>
            <SummaryExchangeAmount color='gray-5'>
              <StatusCircle color={color} marginRight='4px' />
              <OrderStatus status={status} />
            </SummaryExchangeAmount>
          </LargeTableRow>
          <LargeTableRow>
            <ExchangeText>{getSourceMessage(status)}</ExchangeText>
            <ExchangeAmounts>
              <SummaryExchangeAmount
                color='gray-5'
                data-e2e='exchangeResultsSourceValue'
              >
                {`${depositAmount} ${sourceCoin}`}
              </SummaryExchangeAmount>
            </ExchangeAmounts>
          </LargeTableRow>
          {!includes(status, [REFUNDED, PENDING_REFUND]) && (
            <LargeTableRow>
              <ExchangeText>{getTargetMessage(status)}</ExchangeText>
              <ExchangeAmounts>
                <SummaryExchangeAmount
                  color='gray-5'
                  data-e2e='exchangeResultsTargetValue'
                >
                  {getTargetAmount(withdrawalAmount, targetCoin, status)}
                </SummaryExchangeAmount>
              </ExchangeAmounts>
            </LargeTableRow>
          )}
          {includes(status, [
            FINISHED,
            PENDING_DEPOSIT,
            PENDING_EXECUTION,
            PENDING_WITHDRAWAL,
            FINISHED_DEPOSIT
          ]) && (
            <MidTableRow>
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
            </MidTableRow>
          )}
          {rate &&
            includes(status, [
              FINISHED,
              PENDING_DEPOSIT,
              PENDING_EXECUTION,
              PENDING_WITHDRAWAL,
              FINISHED_DEPOSIT
            ]) && (
              <MidTableRow>
                <ExchangeText>
                  <FormattedMessage
                    id='modals.exchangeresults.rate'
                    defaultMessage='Exchange rate'
                  />
                </ExchangeText>
                <ExchangeText
                  weight={300}
                >{`1 ${sourceCoin} = ${rate} ${targetCoin}`}</ExchangeText>
              </MidTableRow>
            )}
          {includes(status, [REFUNDED, PENDING_REFUND]) && (
            <MidTableRow>
              <ExchangeText>{getRefundMessage(status)}</ExchangeText>
              <ExchangeText weight={300}>{`${
                status === REFUNDED ? '' : '~'
              } ${refundAmount}`}</ExchangeText>
            </MidTableRow>
          )}
        </SummaryWrapper>
        {getButton(status)}
      </ModalBody>
    </Modal>
  )
}

export default modalEnhancer(RESULTS_MODAL)(ExchangeResults)
