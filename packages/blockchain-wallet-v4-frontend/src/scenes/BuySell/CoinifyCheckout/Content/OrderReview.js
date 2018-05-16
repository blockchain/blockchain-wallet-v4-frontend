import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button, HeartbeatLoader, Link } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import FaqRow from 'components/Faq/FaqRow'
import CountdownTimer from 'components/Form/CountdownTimer'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { reviewOrder, currencySymbolMap } from 'services/CoinifyService'
import { FormattedMessage } from 'react-intl'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { StepTransition } from 'components/Utilities/Stepper'

const StyledFaqRow = styled(FaqRow)`
  padding: 20px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const CancelWrapper = styled.div`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={300}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)

const renderRate = (rate, q) => {
  return <FormattedMessage id='rate' defaultMessage='{rate}' values={{ rate: `${currencySymbolMap[q.baseCurrency]}${rate.toLocaleString()}` }} />
}

export const OrderDetails = ({ quoteR, onRefreshQuote, type, medium }) => (
  <ExchangeCheckoutWrapper>
    <Text size='32px' weight={600} style={spacing('mb-10')}>
      <FormattedMessage id='buy.almost_there' defaultMessage="You're almost there" />
    </Text>
    <Text size='14px' weight={300} style={spacing('mb-20')}>
      <FormattedMessage id='buy.review_order_subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
    </Text>
    <div style={{ ...flex('row align/center justify/end'), ...spacing('mt-20') }}>
      <Text size='12px' weight={500} style={spacing('mr-10')}>
        <FormattedMessage id='exchange_rate' defaultMessage='Exchange Rate' />
      </Text>
      <Text size='12px' weight={300}>
        1 BTC = {quoteR.map((q) => {
          const rate = +((1 / (Math.abs(q.quoteAmount) / 1e8)) * Math.abs(q.baseAmount)).toFixed(2)
          // console.log('create rate', `${currencySymbolMap[q.baseCurrency]}${rate.toLocaleString()}`)
          return renderRate(rate, q)
        }).getOrElse('~')}
      </Text>
    </div>
    <OrderDetailsTable style={spacing('mt-10')}>
      {renderDetailsRow(
        'order_details.amount_to_transact',
        type === 'buy' ? 'BTC Amount to Purchase' : 'BTC Amount to Sell',
        quoteR.map(q => reviewOrder.renderSummary(q, type, medium)).data.firstRow
      )}
      {renderDetailsRow(
        'order_details.trading_fee',
        'Trading Fee',
        quoteR.map(q => reviewOrder.renderSummary(q, type, medium)).data.fee
      )}
      {renderDetailsRow(
        'order_details.total_transacted',
        type === 'buy' ? 'Total Cost' : 'Total to be Received',
        quoteR.map(q => reviewOrder.renderSummary(q, type, medium)).data.total,
        'success'
      )}
    </OrderDetailsTable>
    {quoteR.map((q) => (
      <CountdownTimer
        style={spacing('mt-20')}
        expiryDate={q.expiresAt.getTime()}
        handleExpiry={onRefreshQuote}
      />
    )).getOrElse(null)}
  </ExchangeCheckoutWrapper>
)

export const OrderSubmit = ({ quoteR, onSubmit, busy, clearTradeError, goToStep }) => (
  <Fragment>
    {
      busy.error
        ? <div onClick={() => clearTradeError()}>
          <Text weight={300} color='error' size='13px' style={spacing('mb-5')}>
            Sorry, something went wrong with your trade: { busy.error_description }
          </Text>
          <span><StepTransition restart Component={Link} weight={300} size='13px'><FormattedMessage id='try_again' defaultMessage='Try again' /></StepTransition></span>
        </div>
        : <Fragment>
          <Button
            nature='primary'
            disabled={!Remote.Success.is(quoteR)}
            onClick={onSubmit}>
            {
              busy
                ? <HeartbeatLoader height='20px' width='20px' color='white' />
                : <FormattedMessage id='submit' defaultMessage='Submit' />
            }
          </Button>
          <CancelWrapper style={{ ...flex('row justify/center'), ...spacing('mt-15') }}>
            <StepTransition restart Component={Link}>
              <FormattedMessage id='cancel' defaultMessage='Cancel' />
            </StepTransition>
          </CancelWrapper>
        </Fragment>
    }
    <StyledFaqRow
      title={<FormattedMessage id='faq.how_long_to_receive_q' defaultMessage='How long does it take to get my funds?' />}
      description={<FormattedMessage id='faq.how_long_to_receive_a' defaultMessage='A bitcoin is never late, nor is it early. A bitcoin arrives precisely when it intends to.' />}
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
