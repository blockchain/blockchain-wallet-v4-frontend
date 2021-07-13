import React from 'react'
import { FormattedMessage } from 'react-intl'
import { WrappedFieldProps } from 'redux-form'

import { TabMenu, TabMenuItem, TooltipHost } from 'blockchain-info-components'

type Props = WrappedFieldProps

const TabMenuPaymentType: React.FC<Props> = props => {
  const handleClick = (value: 'full' | 'partial') => {
    props.input.onChange(value)
  }

  return (
    <TabMenu>
      <TabMenuItem
        width='50%'
        selected={props.input.value === 'full'}
        onClick={() => handleClick('full')}
      >
        <FormattedMessage
          id='modals.borrow.repayloan.fullrepayment'
          defaultMessage='Full Repayment'
        />
      </TabMenuItem>
      <TabMenuItem
        disabled
        width='50%'
        selected={props.input.value === 'partial'}
        // onClick={() => handleClick('partial')}
      >
        <TooltipHost id='coming-soon'>
          <FormattedMessage
            id='modals.borrow.repayloan.partialrepayment'
            defaultMessage='Partial Repayment'
          />
        </TooltipHost>
      </TabMenuItem>
    </TabMenu>
  )
}

export default TabMenuPaymentType
