import { always, equals, identity, ifElse, includes } from 'ramda'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { model, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  AmountHeader,
  Wrapper as BorderWrapper,
  ExchangeAmount,
  ExchangeAmounts,
  ExchangeText,
  LargeTableRow,
  Note,
  Title
} from 'components/Exchange'
import {
  Button,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { OrderNote, OrderStatus, selectColor } from 'components/OrderStatus'

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
  > span:nth-child(2) {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: ${props => props.theme.white};
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
  color: ${props => props.theme.blue200};
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
          <Button fullwidth height='56px' nature='primary' weight={400}>
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

const getTargetAmount = (withdrawalAmount, targetCoinModel, status) =>
  includes(status, [FAILED, EXPIRED]) ? (
    <StrikeThrough>{`${withdrawalAmount} ${targetCoinModel.coinTicker}`}</StrikeThrough>
  ) : (
    `${withdrawalAmount} ${targetCoinModel.coinTicker}`
  )

export const ExchangeResults = ({
  position,
  total,
  close,
  status,
  id,
  sourceCoinModel,
  targetCoin,
  targetCoinModel,
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
            color={sourceCoinModel.colorCode}
            name={sourceCoinModel.icons.circleFilled}
          />
          <Icon size='12px' name='arrow-right' />
          <Icon
            size='42px'
            color={targetCoinModel.colorCode}
            name={targetCoinModel.icons.circleFilled}
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
            <SummaryExchangeAmount color='grey700'>
              <StatusCircle color={color} marginRight='4px' />
              <OrderStatus status={status} />
            </SummaryExchangeAmount>
          </LargeTableRow>
          <LargeTableRow>
            <ExchangeText>{getSourceMessage(status)}</ExchangeText>
            <ExchangeAmounts>
              <SummaryExchangeAmount
                color='grey700'
                data-e2e='exchangeResultsSourceValue'
              >
                {`${depositAmount} ${sourceCoinModel.coinTicker}`}
              </SummaryExchangeAmount>
            </ExchangeAmounts>
          </LargeTableRow>
          {!includes(status, [REFUNDED, PENDING_REFUND]) && (
            <LargeTableRow>
              <ExchangeText>{getTargetMessage(status)}</ExchangeText>
              <ExchangeAmounts>
                <SummaryExchangeAmount
                  color='grey700'
                  data-e2e='exchangeResultsTargetValue'
                >
                  {getTargetAmount(withdrawalAmount, targetCoinModel, status)}
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
              <ExchangeText weight={400}>{`${
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
                  weight={400}
                >{`1 ${sourceCoinModel.coinTicker} = ${rate} ${targetCoinModel.coinTicker}`}</ExchangeText>
              </MidTableRow>
            )}
          {includes(status, [REFUNDED, PENDING_REFUND]) && (
            <MidTableRow>
              <ExchangeText>{getRefundMessage(status)}</ExchangeText>
              <ExchangeText weight={400}>{`${
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

const mapStateToProps = (state, ownProps) => ({
  sourceCoinModel: selectors.core.walletOptions
    .getCoinModel(state, ownProps.sourceCoin)
    .getOrFail(),
  targetCoinModel: selectors.core.walletOptions
    .getCoinModel(state, ownProps.targetCoin)
    .getOrFail()
})

const enhance = compose(
  modalEnhancer(RESULTS_MODAL),
  connect(mapStateToProps)
)

export default enhance(ExchangeResults)
