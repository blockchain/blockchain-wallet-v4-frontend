import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { equals } from 'ramda'
import { WrappedFieldProps } from 'redux-form'
import styled from 'styled-components'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

type Props = WrappedFieldProps

const CustomTabMenu = styled(TabMenu)`
  width: 232px;
  margin-bottom: 12px;
`

const TabMenuTimeFrame: React.FC<Props> = props => {
  const [value, setTab] = useState<'long' | 'short'>('long')
  const handleTimeFrameChange = (value: 'long' | 'short') => {
    setTab(value)
    props.input.onChange(value)
  }
  return (
    <CustomTabMenu>
      <TabMenuItem
        width='50%'
        data-e2e='longTerm'
        selected={equals(value, 'long')}
        onClick={() => handleTimeFrameChange('long')}
      >
        <FormattedMessage
          id='modals.interest.deposit.longterm'
          defaultMessage='Long-term'
        />
      </TabMenuItem>
      <TabMenuItem
        width='50%'
        data-e2e='shortTerm'
        selected={equals(value, 'short')}
        onClick={() => handleTimeFrameChange('short')}
      >
        <FormattedMessage
          id='modals.interest.deposit.shortterm'
          defaultMessage='Short-term'
        />
      </TabMenuItem>
    </CustomTabMenu>
  )
}

export default TabMenuTimeFrame
