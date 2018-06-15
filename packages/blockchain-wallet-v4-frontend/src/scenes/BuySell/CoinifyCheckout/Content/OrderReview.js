import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, Link } from 'blockchain-info-components'
import FaqRow from 'layouts/Wallet/TrayRight/Faq/FaqRow'
import CountdownTimer from 'components/Form/CountdownTimer'
import { spacing } from 'services/StyleService'
import { reviewOrder, getRateFromQuote } from 'services/CoinifyService'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { BorderBox, Row } from 'components/BuySell/Signup'
import { StepTransition } from 'components/Utilities/Stepper'
import ReviewForm from './ReviewForm'

const ExchangeRateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
`
const StyledFaqRow = styled(FaqRow)`
  padding: 20px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const rateHelper = (quoteR) =>
  quoteR.map(getRateFromQuote).getOrElse(`~`)

export const OrderDetails = ({ quoteR, onRefreshQuote, type, medium }) => (
  <Row>
    <BorderBox>
      <Text size='32px' weight={600} style={spacing('mb-10')}>
        <FormattedMessage id='scenes.buysell.coinifycheckout.content.orderreview.buy.almostthere' defaultMessage="You're almost there" />
      </Text>
      <Text size='14px' weight={300} style={spacing('mb-20')}>
        <FormattedMessage id='scenes.buysell.coinifycheckout.content.orderreview.buy.revieworder.subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
      </Text>
      <ExchangeRateWrapper>
        <Text size='12px' weight={500} style={spacing('mr-10')}>
          <FormattedMessage id='scenes.buysell.coinifycheckout.content.orderreview.exchangerate' defaultMessage='Exchange Rate' />
        </Text>
        <Text size='12px' weight={300}>
          1 BTC = { rateHelper(quoteR) }
        </Text>
      </ExchangeRateWrapper>
      <OrderDetailsTable style={spacing('mt-10')}>
        <OrderDetailsRow>
          {
            type === 'buy'
              ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttopurchase' defaultMessage='BTC Amount to Purchase' /></Text>
              : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttosell' defaultMessage='BTC Amount to Sell' /></Text>
          }
          <Text size='13px' weight={300}>{quoteR.map(q => reviewOrder.renderFirstRow(q, medium)).getOrElse('~')}</Text>
        </OrderDetailsRow>
        <OrderDetailsRow>
          <Text size='13px' weight={300}><FormattedMessage id='orderdetails.tradingfee' defaultMessage='Trading Fee' /></Text>
          <Text size='13px' weight={300}>{quoteR.map(q => reviewOrder.renderFeeRow(q, medium, type)).getOrElse('~')}</Text>
        </OrderDetailsRow>
        <OrderDetailsRow>
          {
            type === 'buy'
              ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totalcost' defaultMessage='Total Cost' /></Text>
              : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totaltobereceived' defaultMessage='Total to be Received' /></Text>
          }
          <Text size='13px' weight={300} color='success'>{quoteR.map(q => reviewOrder.renderTotalRow(q, medium, type)).getOrElse('~')}</Text>
        </OrderDetailsRow>
      </OrderDetailsTable>
      {quoteR.map((q) => (
        <CountdownTimer
          style={spacing('mt-20')}
          expiryDate={q.expiresAt.getTime()}
          handleExpiry={onRefreshQuote}
          tooltipExpiryTime='15 minutes'
        />
      )).getOrElse(null)}
    </BorderBox>
  </Row>
)

export const OrderSubmit = (props) => {
  const { busy, clearTradeError, onSubmit, quoteR } = props

  return (
    <Fragment>
      {
        busy.error
          ? <div onClick={() => clearTradeError()}>
            <Text weight={300} color='error' size='13px' style={spacing('mb-5')}>
              <FormattedMessage id='scenes.buysell.orderreview.wrong' defaultMessage='Sorry, something went wrong with your trade:' />
              {busy.error_description}
            </Text>
            <span>
              <StepTransition restart Component={Link} weight={300} size='13px'>
                <FormattedMessage id='try_again' defaultMessage='Try again' />
              </StepTransition>
            </span>
          </div>
          : <ReviewForm busy={busy} onSubmit={onSubmit} quoteR={quoteR} />
      }
      <StyledFaqRow
        title={<FormattedMessage id='faq.how_long_to_receive_q' defaultMessage='How long does it take to get my funds?' />}
        description={
          <div>
            <FormattedMessage id='faq.how_long_to_receive_a1' defaultMessage='The quote expires within 15 minutes of placing the order. If the transaction is not broadcasted during that time the order will not be processed.' />
            <FormattedMessage id='faq.how_long_to_receive_a2' defaultMessage='Coinify will contact you with intructions on how to receive a BTC refund if they are received after the quote expires, and if the amount received is higher or lower that the one specified in the order.' />
            <FormattedMessage id='faq.how_long_to_receive_a3' defaultMessage='Coinify won’t be refunding the bitcoin transaction fee.' />
          </div>
        }
      />
      <StyledFaqRow
        title={<FormattedMessage id='faq.exchange_rate_q' defaultMessage='What is the exchange rate?' />}
        description={<FormattedMessage id='faq.exchange_rate_a' defaultMessage='The exchange rate varies from minute to minute.' />}
      />
      <StyledFaqRow
        title={<FormattedMessage id='faq.exchange_fees_q' defaultMessage='What are the fees?' />}
        description={<FormattedMessage id='faq.exchange_fees_a' defaultMessage='Each exchange takes a small percentage of the total amount as a fee.' />}
      />
    </Fragment>
  )
}
