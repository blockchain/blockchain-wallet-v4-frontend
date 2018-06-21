import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, Link } from 'blockchain-info-components'
import Helper from 'components/BuySell/FAQ'
import CountdownTimer from 'components/Form/CountdownTimer'
import { spacing } from 'services/StyleService'
import { reviewOrder, getRateFromQuote } from 'services/CoinifyService'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { BorderBox, Row } from 'components/BuySell/Signup'
import { StepTransition } from 'components/Utilities/Stepper'
import ReviewForm from './ReviewForm'
import { update } from 'ramda'

const ExchangeRateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
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
  const { busy, clearTradeError, onSubmit, quoteR, type } = props

  let helpers = [
    {
      question: <FormattedMessage id='coinifyexchangedata.cyo.helper1.question' defaultMessage='How long will the buy order take?' />,
      answer: <FormattedMessage id='coinifyexchangedata.cyo.helper1.answer' defaultMessage='How long a buy order takes depends on your chosen payment method, which can always be changed. If buying through bank transfer, you will receive bitcoin within 2-3 days. If you chose to pay with a credit or debit card, you can plan to receive your bitcoin within 24 hours (depending on your bank’s transfer policies).' />
    },
    {
      question: <FormattedMessage id='coinifyexchangedata.cyo.helper2.question' defaultMessage='Why does the exchange rate change?' />,
      answer: <FormattedMessage id='coinifyexchangedata.cyo.helper2.answer' defaultMessage="When you choose to create a trade through bank transfer, Coinify will show you an exchange rate that may differ from the actual rate due to price fluctuations in bitcoin. Any issues that increase your order's processing time will have an effect on the final exchange rate used for that order. Once your order is ready, Coinify processes the trade and locks in the exchange rate." />
    },
    {
      question: <FormattedMessage id='coinifyexchangedata.cyo.helper3.question' defaultMessage='The small print' />,
      answer: <FormattedMessage id='coinifyexchangedata.cyo.helper3.answer' defaultMessage='To read more about how Coinify stores your information and keeps it safe, please visit their {tos} and {privacyPolicy}. For help with, or questions about your Blockchain wallet, please reach out to our support team {supportLink}.'
        values={{
          tos: <Link size='12px' weight={300} href='https://www.coinify.com/legal' target='_blank'><FormattedMessage id='tos' defaultMessage='Terms of Service' /></Link>,
          privacyPolicy: <Link size='12px' weight={300} href='https://www.coinify.com/legal/policy' target='_blank'><FormattedMessage id='privacypolicy' defaultMessage='Privacy Policy' /></Link>,
          supportLink: <Link target='_blank' href='https://support.blockchain.com' size='12px' weight={300}><FormattedMessage id='contactsupport' defaultMessage='contact support' /></Link>
        }} />
    }
  ]

  let sellFaq = {
    question: <FormattedMessage id='coinifyexchangedata.cyo.helper4.question' defaultMessage='How long will the sell order take?' />,
    answer: <FormattedMessage id='coinifyexchangedata.cyo.helper4.answer' defaultMessage='If the Bitcoin transaction of your sell order is broadcast and confirmed within the 15 minute time period for which Coinify guarantees the rate, the system will lock the exchange rate and your order will begin processing. This means that within 2 bank days we will send the funds to your bank account, as long as all details are correct and complete. Remember: you can only use a bank account registered in your own name to receive the payout.' />
  }

  const faqHelper = () => helpers.map((el, i) => <Helper key={i} question={el.question} answer={el.answer} />)

  if (type === 'sell') helpers = update(0, sellFaq, helpers)

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
      { faqHelper() }
    </Fragment>
  )
}
