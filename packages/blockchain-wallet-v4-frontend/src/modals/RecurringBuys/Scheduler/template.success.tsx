import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text, Tooltip, TooltipHost } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { RecurringBuyPeriods } from 'data/types'

const StyledSelectBox = styled(SelectBox)`
  opacity: ${(p) => (p.disabled ? '0.5' : '1')};

  & svg {
    padding-right: 12px;
    fill: ${(p) => p.theme.grey600};
  }
`
const TooltipWrapper = styled.div`
  display: flex;

  & > div {
    flex: 1;
  }
`
const LeftRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${(p) => p.theme.blue000};
  border-radius: 50%;
  padding: 8px;
  margin-right: 16px;
  height: 16px;
  width: 16px;
`

const DisplalyContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  margin-left: 16px;
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

const renderDisplay = ({ value }: { value: RecurringBuyPeriods }) => {
  return (
    <DisplalyContainer>
      <LeftRow>
        <IconWrapper>
          <Icon data-e2e='recurringBuyScheduler' name='sync-regular' size='16px' color='blue600' />
        </IconWrapper>
        <Text size='16px' weight={600}>
          {getText(value)}
        </Text>
      </LeftRow>
    </DisplalyContainer>
  )
}

const renderItem = ({ value }: { value: RecurringBuyPeriods }) => {
  return <Text>{getText(value)}</Text>
}

const SchedulerSelectBox = (props) => {
  return (
    <StyledSelectBox
      {...props}
      data-e2e='recurringBuyTimeFrame'
      elements={[
        {
          group: '',
          items: [
            { value: RecurringBuyPeriods.ONE_TIME },
            { value: RecurringBuyPeriods.DAILY },
            { value: RecurringBuyPeriods.WEEKLY },
            { value: RecurringBuyPeriods.BI_WEEKLY },
            { value: RecurringBuyPeriods.MONTHLY }
          ]
        }
      ]}
      value={RecurringBuyPeriods.ONE_TIME}
      grouped={false}
      templateDisplay={renderDisplay}
      templateItem={renderItem}
    />
  )
}

const SchedulerContainer = (props) => {
  return (
    <>
      {props.disabled ? (
        <TooltipWrapper>
          <TooltipHost id='recurringBuyTT'>
            <SchedulerSelectBox {...props} />
          </TooltipHost>
          <Tooltip id='recurringBuyTT'>
            <FormattedMessage
              id='modals.recurringbuys.disabled.paymentmethod'
              defaultMessage='Recurring buys are not available for this payment method yet.'
            />
          </Tooltip>
        </TooltipWrapper>
      ) : (
        <SchedulerSelectBox {...props} />
      )}
    </>
  )
}

const Scheduler = (props: InjectedFormProps & { disabled: boolean }) => {
  return <Field {...props} component={SchedulerContainer} name='frequency' />
}

export default reduxForm<{}, { disabled: boolean }>({
  destroyOnUnmount: false,
  form: 'recurringBuyScheduler'
})(Scheduler)
