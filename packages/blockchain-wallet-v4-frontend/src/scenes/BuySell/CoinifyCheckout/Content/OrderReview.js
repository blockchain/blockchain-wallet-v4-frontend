import { FormattedMessage } from 'react-intl'
import React, { Fragment } from 'react'
import styled from 'styled-components'

import { BackButton } from 'components/BuySell/styled'
import { getRateFromQuote, reviewOrder } from 'services/CoinifyService'
import {
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  OrderDetailsRow,
  OrderDetailsTable
} from 'components/BuySell/OrderDetails'
import {
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'
import { spacing } from 'services/StyleService'
import { StepTransition } from 'components/Utilities/Stepper'
import CountdownTimer from 'components/Form/CountdownTimer'
import media from 'services/ResponsiveService'
import ReviewForm from './ReviewForm'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`
const OrderReviewContainer = styled.div`
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CenteredPartnerSubHeader = styled(PartnerSubHeader)`
  text-align: center;
`
const CountdownTimerWrapper = styled.div`
  display: flex;
  margin-right: 10px;
  margin-bottom: 10px;
`
const ErrorContainer = styled.div`
  width: 450px;
  margin: 0 auto 50px auto;
  text-align: center;
  ${media.mobile`
    width: 90%;
  `};
`
const Header = styled(PartnerHeader)`
  ${media.mobile`
    margin-top: 25px;
  `};
`
const FeeText = styled(Text)`
  display: flex;
  align-items: center;
`

const FONT_SIZE = '16px'
const FONT_COLOR = 'brand-primary'

const rateHelper = quoteR => quoteR.map(getRateFromQuote).getOrElse(`~`)

export const OrderDetails = ({ quoteR, onRefreshQuote, type, medium }) => (
  <Wrapper>
    <OrderReviewContainer>
      <StepTransition restart Component={BackButton}>
        <Icon name='arrow-left' size='20px' color='brand-secondary' cursor />
      </StepTransition>
      <Header color={FONT_COLOR}>
        <FormattedMessage
          id='scenes.buysell.coinifycheckout.content.orderreview.buy.almostthere'
          defaultMessage="You're almost there"
        />
      </Header>
      <CenteredPartnerSubHeader weight={400}>
        {type === 'buy' ? (
          <FormattedMessage
            id='scenes.buysell.coinifycheckout.content.orderreview.buy.revieworder.subheader'
            defaultMessage='Please confirm your order details before we direct you to our secure payment provider.'
          />
        ) : (
          <FormattedMessage
            id='scenes.buysell.coinifycheckout.content.orderreview.sell.revieworder.subheader'
            defaultMessage='Please confirm your order details.'
          />
        )}
      </CenteredPartnerSubHeader>
      <OrderDetailsTable width='400px' padding='20px 20px 10px 20px'>
        <OrderDetailsRow short noPaddingTop noBorderBottom>
          <Text size={FONT_SIZE} weight={500}>
            <FormattedMessage
              id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.exchange_rate'
              defaultMessage='Exchange rate'
            />
          </Text>
          <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
            1 BTC = {rateHelper(quoteR)}
          </Text>
        </OrderDetailsRow>
        <CountdownTimerWrapper>
          {quoteR
            .map(q => (
              <CountdownTimer
                expiryDate={q.expiresAt.getTime()}
                handleExpiry={onRefreshQuote}
                tooltipExpiryTime='15 minutes'
                hideTooltip
              />
            ))
            .getOrElse(null)}
        </CountdownTimerWrapper>
        <OrderDetailsRow short noBorderBottom borderTop>
          {type === 'buy' ? (
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.btc_purchase'
                defaultMessage='Purchase'
              />
            </Text>
          ) : (
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.btc_sell'
                defaultMessage='Sell'
              />
            </Text>
          )}
          <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
            {quoteR.map(q => reviewOrder.renderFirstRow(q)).getOrElse('~')}
          </Text>
        </OrderDetailsRow>
        {type === 'buy' ? (
          <OrderDetailsRow short noBorderBottom>
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.tx_fee'
                defaultMessage='Transaction Fee'
              />
            </Text>
            <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
              -
              {quoteR
                .map(q => reviewOrder.renderMinerFeeRow(q, medium, type))
                .getOrElse('~')}{' '}
              BTC
            </Text>
          </OrderDetailsRow>
        ) : null}
        {type === 'buy' ? (
          <OrderDetailsRow short>
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.to_be_received'
                defaultMessage='To Be Received'
              />
            </Text>
            <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
              {quoteR
                .map(q => reviewOrder.renderBtcToBeReceived(q, medium, type))
                .getOrElse('~')}{' '}
              BTC
            </Text>
          </OrderDetailsRow>
        ) : null}
        <OrderDetailsRow short noBorderBottom>
          <Text size={FONT_SIZE} weight={500}>
            <FormattedMessage
              id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.amount'
              defaultMessage='Amount'
            />
          </Text>
          <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
            {quoteR.map(q => reviewOrder.renderAmountRow(q)).getOrElse('~')}
          </Text>
        </OrderDetailsRow>
        <OrderDetailsRow short noBorderBottom>
          <FeeText size={FONT_SIZE} weight={500}>
            <FormattedMessage
              id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.payment_fee'
              defaultMessage='Payment Fee'
            />
            <TooltipHost id='buysellOrderReview'>
              <TooltipIcon name='info' />
            </TooltipHost>
          </FeeText>
          <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
            {quoteR
              .map(q => reviewOrder.renderFeeRow(q, medium, type))
              .getOrElse('~')}
          </Text>
        </OrderDetailsRow>
        <OrderDetailsRow short>
          {type === 'buy' ? (
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.total_cost'
                defaultMessage='Total Cost'
              />
            </Text>
          ) : (
            <Text size={FONT_SIZE} weight={500}>
              <FormattedMessage
                id='scenes.buysell.coinifycheckout.content.orderreview.orderdetails.total_to_receive'
                defaultMessage='To Receive'
              />
            </Text>
          )}
          <Text size={FONT_SIZE} weight={500} color={FONT_COLOR}>
            {quoteR
              .map(q => reviewOrder.renderTotalRow(q, medium, type))
              .getOrElse('~')}
          </Text>
        </OrderDetailsRow>
      </OrderDetailsTable>
    </OrderReviewContainer>
  </Wrapper>
)

export const OrderSubmit = props => {
  const { busy, clearTradeError, onSubmit, quoteR } = props

  return (
    <Fragment>
      {busy.error ? (
        <ErrorContainer onClick={() => clearTradeError()}>
          <Text weight={400} color='error' size='13px' style={spacing('mb-5')}>
            <FormattedMessage
              id='scenes.buysell.orderreview.wrong'
              defaultMessage='Sorry, something went wrong with your trade:'
            />{' '}
            {busy.error_description}
          </Text>
          <span>
            <StepTransition restart Component={Link} weight={400} size='13px'>
              <FormattedMessage
                id='scenes.buysell.orderreview.try_again'
                defaultMessage='Try again'
              />
            </StepTransition>
          </span>
        </ErrorContainer>
      ) : (
        <ReviewForm busy={busy} onSubmit={onSubmit} quoteR={quoteR} />
      )}
    </Fragment>
  )
}
