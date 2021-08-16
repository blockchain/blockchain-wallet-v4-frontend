import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BlueCartridge } from 'components/Cartridge'
import { RecurringBuyPeriods } from 'data/types'

const DisplalyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
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
  children: React.ReactNode
  onClick: () => void
}
const Scheduler = ({ children, onClick }: SchedulerProps) => {
  return (
    <DisplalyContainer>
      <BlueCartridge
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        role='button'
        data-e2e='sbEnterAmountMax'
      >
        {children}
      </BlueCartridge>
    </DisplalyContainer>
  )
}

export default Scheduler
