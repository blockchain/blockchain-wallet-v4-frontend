import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text, Tooltip, TooltipHost } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

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

const renderDisplay = (props) => {
  const { text } = props

  return (
    <DisplalyContainer>
      <LeftRow>
        <IconWrapper>
          <Icon data-e2e='recurringBuyScheduler' name='sync-regular' size='16px' color='blue600' />
        </IconWrapper>
        <Text size='16px' weight={600}>
          {text}
        </Text>
      </LeftRow>
    </DisplalyContainer>
  )
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
            { text: 'One time purchase', value: 0 },
            { text: 'Every day', value: 1 },
            { text: 'Every week', value: 2 },
            { text: 'Every 2 weeks', value: 3 },
            { text: 'Every month', value: 4 }
          ]
        }
      ]}
      value={0}
      grouped={false}
      templateDisplay={renderDisplay}
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
