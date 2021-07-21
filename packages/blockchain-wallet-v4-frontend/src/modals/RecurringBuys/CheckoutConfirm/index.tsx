import React, { useCallback } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { AmountSubHeader, Button, CheckoutRow, FlyoutContainer, FlyoutContent, FlyoutHeader, FlyoutFooter, Text, TextGroup, Link } from 'blockchain-info-components'
import { RootState } from 'data/rootReducer'
import { actions, selectors } from 'data'
import { SBOrderType } from 'core/types'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'

import { getBaseAmount, getBaseCurrency, getCounterAmount, getCounterCurrency } from 'data/components/simpleBuy/model'
import { RecurringBuyPeriods } from 'data/types'

import { Props as _P } from '..'
import { displayFiat } from '../../SimpleBuy/model'
import { FlyoutWrapper } from 'components/Flyout'

const Confirm = ({ close, order, supportedCoins, quote }: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const baseCurrency = getBaseCurrency(order, supportedCoins)
  const subTotalAmount = fiatToString({
    unit: getCounterCurrency(order, supportedCoins),
    value: getCounterAmount(order)
  })
  const fee = order.fee || quote.fee
  const totalAmount = fiatToString({
    unit: getCounterCurrency(order, supportedCoins),
    value: getCounterAmount(order) + fee
  })
  const foo = getCounterAmount(order)
  const feed = fee
  // ONE_TIME is not a recurring buy option so take it out before displaying
  const periods = Object.values(RecurringBuyPeriods).filter((p) => p !== RecurringBuyPeriods.ONE_TIME)

  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e="closeRecurringBuyModalCheckoutStep"
        mode="back"
        onClick={close}
      >
        <FormattedMessage
          id='simplebuy.checkoutconfirm'
          defaultMessage='Checkout' />
      </FlyoutHeader>
      <FlyoutContent>
        <AmountSubHeader
          data-e2e='recurringBuySubTotalAmount'
          title={`${amount} ${currency}`}
          subTitle={subTotalAmount}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='modals.simplebuy.confirm.rate'
              defaultMessage='Exchange Rate'
            />
          )}
          text={(
            <div data-e2e='rbExchangeRate'>
              {displayFiat(order, supportedCoins, quote.rate)} / {baseCurrency}
            </div>
          )}
          toolTip={(
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
          )}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='copy.fee'
              defaultMessage='Fee'
            />
          )}
          text={displayFiat(order, supportedCoins, fee || '0')}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='copy.total'
              defaultMessage='Total'
            />
          )}
          text={totalAmount}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='checkout.payment_method'
              defaultMessage='Payment Method'
            />
          )}
          text={displayFiat(order, supportedCoins, fee || '0')}
          additionalText={''}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='copy.frequency'
              defaultMessage='Frequency'
            />
          )}
          text={displayFiat(order, supportedCoins, fee || '0')}
          additionalText={''}
        />

        <CheckoutRow
          title={(
            <FormattedMessage
              id='copy.available_to_trade'
              defaultMessage='Available to Trade'
            />
          )}
          text={(
            <FormattedMessage
              id='copy.instantly'
              defaultMessage='Instantly'
            />
          )}
        />
        <Text size='12px' weight={500} color='grey600' style={{ textAlign: 'center', padding: '40px' }}>
          <FormattedMessage
            id='modals.simplebuy.confirm.activity_card11'
            defaultMessage='Your final amount might change due to market activity. For your security, buy orders with a bank account are subject to up to a 14 day holding period. You can Swap or Sell during this time. We will notify you once the funds are fully available.'
          />
        </Text>
      </FlyoutContent>
      <FlyoutFooter>
        <Button
          nature='primary'
          data-e2e='getStartedWithRecurringBuys'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={close}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.get_started'
            defaultMessage='Get Started'
          />
        </Button>
        <Button
          nature='light'
          data-e2e='maybeLaterRecurringBuys'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={close}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.maybe_later'
            defaultMessage='Maybe Later'
          />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType,
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('Failed to load coin models'),
  quote: selectors.components.simpleBuy.getSBQuote(state).getOrFail('Could not get exchange rate')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Confirm)
