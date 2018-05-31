import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button, Icon, HeartbeatLoader, Link, Tooltip } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import FaqRow from 'layouts/Wallet/TrayRight/Faq/FaqRow'
import CountdownTimer from 'components/Form/CountdownTimer'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { reviewOrder } from 'services/SfoxService'
import { FormattedMessage } from 'react-intl'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import FundingSource from 'components/BuySell/FundingSource'
import { StepTransition } from 'components/Utilities/Stepper'

const StyledFaqRow = styled(FaqRow)`
  padding: 20px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const MethodContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 42px;
  border: 1px solid ${props => props.theme['gray-2']}
`
const CancelWrapper = styled.div`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`
const ToolTipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  div:first-of-type {
    margin-right: 5px;
  }
`

export const OrderDetails = ({ quoteR, account, onRefreshQuote, type }) => (
  <ExchangeCheckoutWrapper>
    <Text size='32px' weight={600} style={spacing('mb-10')}>
      <FormattedMessage id='buy.almost_there' defaultMessage="You're almost there" />
    </Text>
    <Text size='14px' weight={300} style={spacing('mb-20')}>
      <FormattedMessage id='buy.review_order_subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
    </Text>
    <Text size='14px' weight={300} style={spacing('mt-20')}>
      <FormattedMessage id='buy.connected_account' defaultMessage='Your Connected Account' />:
    </Text>
    <MethodContainer style={spacing('mt-10')}>
      <Icon style={spacing('ml-15')} name='bank-filled' size='26px' />
      <FundingSource account={account} />
    </MethodContainer>
    <div style={{ ...flex('row align/center justify/end'), ...spacing('mt-20') }}>
      <Text size='12px' weight={500} style={spacing('mr-10')}>
        <FormattedMessage id='exchange_rate' defaultMessage='Exchange Rate' />
      </Text>
      <Text size='12px' weight={300}>
        1 BTC = {quoteR.map((quote) => `$${quote.rate}`).getOrElse('~')}
      </Text>
    </div>
    <OrderDetailsTable style={spacing('mt-10')}>
      <OrderDetailsRow>
        {
          type === 'buy'
            ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttopurchase' defaultMessage='BTC Amount to Purchase' /></Text>
            : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttosell' defaultMessage='BTC Amount to Sell' /></Text>
        }
        <Text size='13px' weight={300}>{quoteR.map(quote => reviewOrder.renderFirstRow(quote, type)).getOrElse('~')}</Text>
      </OrderDetailsRow>
      <OrderDetailsRow>
        <ToolTipWrapper>
          <Text size='13px' weight={300}>
            <FormattedMessage id='orderdetails.tradingfee' defaultMessage='Trading Fee' />
          </Text>
          <Tooltip>
            <FormattedMessage id='orderdetails.tradingfee.tooltip' defaultMessage='The fee charged to execute a trade through SFOX.' />
          </Tooltip>
        </ToolTipWrapper>
        <Text size='13px' weight={300}>{quoteR.map(quote => `$${(+quote.feeAmount).toFixed(2)}`).getOrElse('~')}</Text>
      </OrderDetailsRow>
      <OrderDetailsRow>
        {
          type === 'buy'
            ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totalcost' defaultMessage='Total Cost' /></Text>
            : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totaltobereceived' defaultMessage='Total to be Received' /></Text>
        }
        <Text size='13px' weight={300} color='success'>{quoteR.map(quote => reviewOrder.renderTotal(quote, type)).getOrElse('~')}</Text>
      </OrderDetailsRow>
    </OrderDetailsTable>
    {quoteR.map((quote) => (
      <CountdownTimer
        style={spacing('mt-20')}
        expiryDate={quote.expiresAt.getTime()}
        handleExpiry={onRefreshQuote}
        tooltipExpiryTime='30 seconds'
      />
    )).getOrElse(null)}
  </ExchangeCheckoutWrapper>
)

export const OrderSubmit = ({ quoteR, onSubmit, busy, clearTradeError }) => (
  <Fragment>
    {
      busy instanceof Error
        ? <div>
          <Text color='error' size='13px'>
            Sorry, something went wrong with your trade: { busy.message }
          </Text>
          <span onClick={() => clearTradeError()}><StepTransition prev Component={Link} weight={300} size='13px'><FormattedMessage id='try_again' defaultMessage='Try again' /></StepTransition></span>
        </div>
        : <Fragment>
          <Button
            nature='primary'
            disabled={!Remote.Success.is(quoteR)}
            onClick={quoteR.map((quote) => () => onSubmit(quote)).getOrElse(null)}>
            {
              busy
                ? <HeartbeatLoader height='20px' width='20px' color='white' />
                : <FormattedMessage id='submit' defaultMessage='Submit' />
            }
          </Button>
          <CancelWrapper style={{ ...flex('row justify/center'), ...spacing('mt-15') }}>
            <StepTransition prev Component={Link}>
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
