import React from 'react'
import { FormattedMessage } from 'react-intl'
import { WrappedFieldProps } from 'redux-form'

import { TabMenu, TabMenuItem, TooltipHost } from 'blockchain-info-components'

type Props = WrappedFieldProps

const TabMenuPaymentMethod: React.FC<Props & { coin: string }> = props => {
  const handleClick = (value: 'principal' | 'collateral') => {
    props.input.onChange(value)
  }

  return (
    <TabMenu>
      <TabMenuItem
        width='50%'
        selected={props.input.value === 'principal'}
        onClick={() => handleClick('principal')}
      >
        <FormattedMessage
          id='modals.borrow.repayloan.principalrepayment'
          defaultMessage='Send {coin}'
          values={{ coin: props.coin }}
        />
      </TabMenuItem>
      <TabMenuItem
        disabled
        width='50%'
        selected={props.input.value === 'collateral'}
        // onClick={() => handleClick('collateral')}
      >
        <TooltipHost id='coming-soon'>
          <FormattedMessage
            id='modals.borrow.repayloan.collateralrepayment'
            defaultMessage='Sell Collateral'
          />
        </TooltipHost>
      </TabMenuItem>
    </TabMenu>
  )
}

export default TabMenuPaymentMethod
