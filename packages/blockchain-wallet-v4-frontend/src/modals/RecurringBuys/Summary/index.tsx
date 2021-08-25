import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import moment from 'moment'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { FiatType, SBOrderType, WithdrawalLockCheckRule } from 'blockchain-wallet-v4/src/types'
import { FlyoutContainer, FlyoutContent, FlyoutFooter, getPeriodTitleText } from 'components/Flyout'
import { actions, selectors } from 'data'
import { getCounterAmount, getCounterCurrency } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods } from 'data/types'

import { Props as _P } from '..'

const SuccessInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 76px;
`
const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 85px;
  position: relative;
  margin-bottom: 24px;
`
const SyncIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  width: 72px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.blue600};
`
const StyledIcon = styled(Icon)`
  position: absolute;
  top: -11px;
  right: -11px;

  &:before {
    border: 4px solid ${(p) => p.theme.white};
    border-radius: 50%;
  }
`

const Success = ({ modalActions, order, period, withdrawLockCheck }: Props) => {
  const fiatAmount = fiatToString({
    unit: getCounterCurrency(order) as FiatType,
    value: getCounterAmount(order)
  })
  const coin = order.outputCurrency
  const days = moment.duration(withdrawLockCheck.lockTime, 'seconds').days()
  return (
    <FlyoutContainer>
      <FlyoutContent mode='middle'>
        <SuccessInfo>
          <IconsWrapper>
            <StyledIcon name='checkmark-circle-filled' color='green400' size='32px' />
            <SyncIconWrapper>
              <Icon name='sync-regular' color='white' size='40px' />
            </SyncIconWrapper>
          </IconsWrapper>

          <Text size='20px' weight={600} color='grey900' style={{ marginBottom: '9px' }}>
            <FormattedMessage
              id='modals.recurringbuys.recurring_buy_started'
              defaultMessage='Recurring Buy Started'
            />
          </Text>
          <Text
            size='14px'
            weight={500}
            color='grey900'
            style={{ lineHeight: '24px', marginBottom: '28px' }}
          >
            <FormattedMessage
              id='modals.recurringbuys.we_will_buy'
              defaultMessage='We will buy {fiatAmount} of {coin} {period} at that moment’s market price. Cancel this recurring buy at anytime.'
              values={{
                coin,
                fiatAmount,
                period: getPeriodTitleText(period)
              }}
            />
          </Text>
          <Text size='12px' weight={500} color='grey600' style={{ lineHeight: '16px' }}>
            <FormattedMessage
              id='modals.recurringbuys.for_each_buy'
              defaultMessage='For each buy, you will not be able to Send or Withdraw these funds for {days} days.'
              values={{
                days
              }}
            />
          </Text>
        </SuccessInfo>
      </FlyoutContent>
      <FlyoutFooter>
        <Button
          data-e2e='recurringBuySuccessOk'
          fullwidth
          nature='primary'
          onClick={modalActions.closeAllModals}
        >
          <FormattedMessage id='copy.ok' defaultMessage='Ok' />
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
  quote: selectors.components.simpleBuy.getSBQuote(state).getOrFail('Could not get exchange rate'),
  withdrawLockCheck: selectors.components.send
    .getWithdrawLockCheckRule(state)
    .getOrElse({ lockTime: 259200 } as WithdrawalLockCheckRule) as WithdrawalLockCheckRule
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Success)
