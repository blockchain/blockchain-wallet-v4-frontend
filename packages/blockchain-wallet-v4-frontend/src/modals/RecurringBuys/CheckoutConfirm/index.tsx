import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader,
  FlyoutSubHeader,
  getPeriodSubTitleText,
  getPeriodTitleText
} from 'components/Flyout'
import { CheckoutRow } from 'components/Rows'
import { FiatType, SBOrderType } from 'core/types'
import { actions, selectors } from 'data'
import {
  getBankAccount,
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getPaymentMethodId
} from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType, RecurringBuyPeriods } from 'data/types'

import { displayFiat, getPaymentMethod, getPaymentMethodDetails } from '../../SimpleBuy/model'
import { Props as _P } from '..'

const Confirm = ({
  bankAccounts,
  cards,
  close,
  order,
  period,
  quote,
  recurringBuyActions
}: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const baseCurrency = getBaseCurrency(order)
  const paymentMethodId = getPaymentMethodId(order)
  const subTotalAmount = fiatToString({
    unit: getCounterCurrency(order) as FiatType,
    value: getCounterAmount(order)
  })
  const fee = order.fee || quote.fee
  const totalAmount = fiatToString({
    unit: getCounterCurrency(order) as FiatType,
    value: getCounterAmount(order)
  })
  const bankAccount = getBankAccount(order, bankAccounts)
  const cardDetails = cards.filter((card) => card.id === paymentMethodId)[0] || null
  const createRecurringBuy = useCallback(() => {
    recurringBuyActions.createRecurringBuy()
  }, [recurringBuyActions])
  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='closeRecurringBuyModalCheckoutStep' mode='back' onClick={close}>
        <FormattedMessage id='simplebuy.checkoutconfirm' defaultMessage='Checkout' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        <FlyoutSubHeader
          data-e2e='recurringBuySubTotalAmount'
          title={`${amount} ${currency}`}
          subTitle={subTotalAmount}
        />

        <CheckoutRow
          title={
            <FormattedMessage id='modals.simplebuy.confirm.rate' defaultMessage='Exchange Rate' />
          }
          text={
            <div data-e2e='rbExchangeRate'>
              {displayFiat(order, quote.rate)} / {baseCurrency}
            </div>
          }
          toolTip={
            <Text size='12px' weight={500} color='grey600'>
              <TextGroup inline>
                <Text size='14px'>
                  <FormattedMessage
                    id='modals.simplebuy.confirm.coin_tooltip'
                    defaultMessage='Blockchain.com provides the best market price we receive and applies a spread.'
                  />
                </Text>
                <Link
                  href='https://support.blockchain.com/hc/en-us/articles/360061672651-Wallet-Pricing'
                  size='14px'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <FormattedMessage
                    id='modals.simplebuy.summary.learn_more'
                    defaultMessage='Learn more'
                  />
                </Link>
              </TextGroup>
            </Text>
          }
        />

        <CheckoutRow
          title={<FormattedMessage id='copy.fee' defaultMessage='Fee' />}
          text={displayFiat(order, fee || '0')}
        />

        <CheckoutRow
          title={<FormattedMessage id='copy.total' defaultMessage='Total' />}
          text={totalAmount}
        />

        <CheckoutRow
          title={<FormattedMessage id='checkout.payment_method' defaultMessage='Payment Method' />}
          text={getPaymentMethod(order, {} as BankTransferAccountType)}
          additionalText={getPaymentMethodDetails(order, bankAccount, cardDetails)}
        />

        <CheckoutRow
          title={<FormattedMessage id='copy.frequency' defaultMessage='Frequency' />}
          text={getPeriodTitleText(period)}
          additionalText={getPeriodSubTitleText(period)}
        />

        <CheckoutRow
          title={
            <FormattedMessage id='copy.available_to_trade' defaultMessage='Available to Trade' />
          }
          text={<FormattedMessage id='copy.instantly' defaultMessage='Instantly' />}
        />
        <Text
          size='12px'
          weight={500}
          color='grey600'
          style={{ padding: '40px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='modals.simplebuy.confirm.activity'
            defaultMessage='Your final amount may change due to market activity.'
          />
        </Text>
      </FlyoutContent>
      <FlyoutFooter>
        <Button
          bold
          size='16px'
          nature='primary'
          data-e2e='getStartedWithRecurringBuys'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={createRecurringBuy}
        >
          <FormattedMessage id='copy.schdule' defaultMessage='Schedule' />
        </Button>
        <Button
          bold
          size='16px'
          nature='light-red'
          data-e2e='maybeLaterRecurringBuys'
          type='button'
          fullwidth
          color='red600'
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={() => close()}
        >
          <FormattedMessage id='copy.cancel' defaultMessage='Cancel' />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

const mapStateToProps = (state: RootState) => ({
  bankAccounts: selectors.components.brokerage.getBankTransferAccounts(state).getOrElse([]),
  cards: selectors.components.simpleBuy.getSBCards(state).getOrElse([]),
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType,
  period: selectors.components.recurringBuy.getPeriod(state) as RecurringBuyPeriods,
  quote: selectors.components.simpleBuy.getSBQuote(state).getOrFail('Could not get exchange rate')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Confirm)
