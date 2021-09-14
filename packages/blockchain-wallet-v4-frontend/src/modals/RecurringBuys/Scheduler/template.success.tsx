import React from 'react'
import { FormattedMessage } from 'react-intl'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import { PaymentType } from 'middleware/analyticsMiddleware/types'
import styled from 'styled-components'

import { Tooltip, TooltipHost } from 'blockchain-info-components'
import { GreyCartridge } from 'components/Cartridge'
import { availableMethodsToolTip } from 'components/Flyout'
import { RecurringBuyPeriods } from 'data/types'

const DisplalyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`
const CustomGreyCartridge = styled(GreyCartridge)`
  border: 1px solid ${(p) => p.theme.grey100};
`
const getText = (value: RecurringBuyPeriods) => {
  switch (value) {
    case RecurringBuyPeriods.DAILY:
      return (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.every_day'
          defaultMessage='Every day'
        />
      )
    case RecurringBuyPeriods.WEEKLY:
      return (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.every_week'
          defaultMessage='Every week'
        />
      )
    case RecurringBuyPeriods.BI_WEEKLY:
      return (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.2_weeks'
          defaultMessage='Every 2 weeks'
        />
      )
    case RecurringBuyPeriods.MONTHLY:
      return (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.every_month'
          defaultMessage='Every month'
        />
      )
    case RecurringBuyPeriods.ONE_TIME:
    default:
      return (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.one_time'
          defaultMessage='One time purchase'
        />
      )
  }
}

type SchedulerProps = {
  availableMethods: any
  children: React.ReactNode
  hasAvailablePeriods: boolean
  onClick: () => void
}
const Scheduler = ({
  availableMethods,
  children,
  hasAvailablePeriods,
  onClick
}: SchedulerProps) => {
  return (
    <DisplalyContainer>
      {hasAvailablePeriods ? (
        <GreyBlueCartridge
          onClick={onClick}
          style={{ marginLeft: '0' }}
          role='button'
          data-e2e='sbRecurringBuyScheduler'
        >
          {children}
        </GreyBlueCartridge>
      ) : (
        <TooltipHost id='recurring-buy-disabled'>
          <CustomGreyCartridge
            style={{ cursor: 'pointer' }}
            role='button'
            data-e2e='sbRecurringBuySchedulerDisabled'
          >
            {children}
          </CustomGreyCartridge>
          <Tooltip id='recurring-buy-disabled'>{availableMethodsToolTip(availableMethods)}</Tooltip>
        </TooltipHost>
      )}
    </DisplalyContainer>
  )
}

export default Scheduler
