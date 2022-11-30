import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Tag } from '@blockchain-com/constellation'
import { format } from 'date-fns'

import { Exchange } from '@core'
import { BSPaymentTypes, FiatType } from '@core/types'
import { Button } from 'blockchain-info-components'
import { RecurringBuyPeriods } from 'data/types'

import CheckoutRow from '../../Rows/Checkout'
import FlyoutContainer from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'
import { getPaymentMethodText, getPeriodSubTitleText, getPeriodTitleText } from '../model'
import SubHeader from '../SubHeader'

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
    content: (complete && <FormattedMessage id='copy.complete' defaultMessage='Complete' />) || (
      <>
        {getPeriodTitleText(period)} {getPeriodSubTitleText(period, nextPayment)}
      </>
    )
  }
  const amountString = `${Exchange.getSymbol(currency)}${standardAmount}`
  return (
    <FlyoutContainer>
      <Header data-e2e='recurringBuyDetailsClose' mode='close' onClick={closeClickCallback}>
        <FormattedMessage id='copy.recurring_buy' defaultMessage='Recurring Buy' />
      </Header>
      <Content mode='top'>
        <SubHeader
          data-e2e='recurringBuyAmount'
          subTitle={<Tag as='div' {...bannerProps} variant={complete ? 'success' : 'default'} />}
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
          subTitle={format(new Date(nextPayment), 'EEE, MMMM do')}
          title={<FormattedMessage id='copy.next_buy' defaultMessage='Next Buy' />}
        />
      </Content>
      <Footer collapsed>
        <Button
          data-e2e='removeRecurringBuyButton'
          nature='light-red'
          fullwidth
          onClick={removeClickCallback}
        >
          <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
        </Button>
      </Footer>
    </FlyoutContainer>
  )
}

export type Props = {
  closeClick: () => void
  complete: boolean
  crypto: string
  currency: FiatType
  id: string
  nextPayment: string | number
  paymentMethod: BSPaymentTypes
  period: RecurringBuyPeriods
  removeClick: (id: string) => void
  standardAmount: string | number
}

export default RecurringBuyDetails
