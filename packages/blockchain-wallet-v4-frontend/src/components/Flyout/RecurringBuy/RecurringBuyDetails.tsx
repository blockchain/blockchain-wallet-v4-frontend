import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Banner, Button } from 'blockchain-info-components'
import { FiatType, SBPaymentTypes } from 'core/types'
import { RecurringBuyPeriods } from 'data/types'

import { Exchange } from '../../../../../blockchain-wallet-v4/src'
import CheckoutRow from '../../Rows/Checkout'
import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'
import { getPaymentMethodText, getPeriodSubTitleText, getPeriodTitleText } from '../model'
import SubHeader from '../SubHeader'

const StyledBanner = styled(Banner)`
  border: unset;
`

const RecurringBuyDetails = ({
  closeClick,
  complete,
  crypto,
  currency,
  id,
  nextPayment,
  paymentMethod,
  period,
  removeClick,
  standardAmount
}: Props) => {
  const closeClickCallback = useCallback(() => {
    closeClick()
  }, [closeClick])
  const removeClickCallback = useCallback(() => {
    removeClick(id)
  }, [removeClick, id])
  const bannerProps = {
    children: (complete && <FormattedMessage id='copy.complete' defaultMessage='Complete' />) || (
      <>
        {getPeriodTitleText(period)} {getPeriodSubTitleText(period, nextPayment)}
      </>
    ),
    type: (complete && 'success') || undefined
  }
  const amountString = `${Exchange.getSymbol(currency)}${standardAmount}`
  return (
    <Container>
      <Header data-e2e='recurringBuyDetailsClose' mode='close' onClick={closeClickCallback}>
        <FormattedMessage id='copy.recurring_buy' defaultMessage='Recurring Buy' />
      </Header>
      <Content mode='top'>
        <SubHeader
          data-e2e='recurringBuyAmount'
          subTitle={<StyledBanner {...bannerProps} />}
          title={`${amountString} of ${crypto}`}
        />
        <CheckoutRow
          subTitle={amountString}
          title={<FormattedMessage id='copy.amount' defaultMessage='Amount' />}
        />
        <CheckoutRow subTitle={crypto} title='Crypto' />
        <CheckoutRow
          subTitle={
            <>
              {getPeriodTitleText(period)} {getPeriodSubTitleText(period, nextPayment)}
            </>
          }
          title={<FormattedMessage id='copy.frequency' defaultMessage='Frequency' />}
        />
        <CheckoutRow
          subTitle={getPaymentMethodText(paymentMethod)}
          title={<FormattedMessage id='checkout.payment_method' defaultMessage='Payment Method' />}
        />
        <CheckoutRow
          subTitle={moment(nextPayment).format('ddd, MMMM Do')}
          title={<FormattedMessage id='copy.next_buy' defaultMessage='Next Buy' />}
        />
      </Content>
      <Footer>
        <Button
          data-e2e='removeRecurringBuyButton'
          nature='light-red'
          fullwidth
          onClick={removeClickCallback}
        >
          <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  closeClick: () => void
  complete: boolean
  crypto: string
  currency: FiatType
  id: string
  nextPayment: string | number
  paymentMethod: SBPaymentTypes
  period: RecurringBuyPeriods
  removeClick: (id: string) => void
  standardAmount: string | number
}

export default RecurringBuyDetails
